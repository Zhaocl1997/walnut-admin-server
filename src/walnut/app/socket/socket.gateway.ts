import { AppConstCacheKeys, AppConstCacheType } from '@/const/app/cache';
import { AppCacheService } from '@/modules/app/monitor/cache/cache.service';
import { AppMonitorUserDTO } from '@/modules/app/monitor/user/dto/user.dto';
import { AppMonitorUserService } from '@/modules/app/monitor/user/user.service';
import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import { SocketService } from './socket.service';
import { ConfigService } from '@nestjs/config';

// TODO extract to config
@WebSocketGateway({
  namespace: 'walnut-namespace',
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketGateway.name);

  constructor(
    private readonly socketService: SocketService,
    private readonly monitorUserService: AppMonitorUserService,
    private readonly cacheService: AppCacheService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer()
  private readonly server: Server;

  afterInit(client: Server) {
    // TODO typeError
    // instrument(this.server, {
    //   auth: false,
    //   mode: 'development',
    //   // namespaceName: 'walnut-namespace',
    // });

    this.logger.debug(`Websocket Server Started, Listening on Port: ${this.configService.get<number>('socket.port')}`);
    this.socketService.socket = client;
  }

  async handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);

    const fingerprint = client.handshake.query['fingerprint'] as string;

    const cache = await this.cacheService.get<[string, string][]>(
      AppConstCacheKeys.SOCKET_POOL,
    );

    if (cache && cache.length !== 0) {
      const index = cache.findIndex((i) => i[0] === fingerprint);

      if (index !== -1) {
        cache.splice(index, 1);

        await this.cacheService.set(AppConstCacheKeys.SOCKET_POOL, cache, {
          t: AppConstCacheType.BUILT_IN,
          ttl: 0,
        });
      }
    }

    // set to db
    await this.monitorUserService.socketHandler({
      left: true,
      focus: false,
      visitorId: fingerprint,
    });
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.debug(`Client connected: ${client.id}`);

    const fingerprint = client.handshake.query['fingerprint'] as string;

    const cache = await this.cacheService.get<[string, string][]>(
      AppConstCacheKeys.SOCKET_POOL,
    );

    if (cache && cache.length !== 0) {
      const index = cache.findIndex((i) => i[0] === fingerprint);

      if (index === -1) {
        cache.push([fingerprint, client.id]);
      } else {
        cache[index] = [fingerprint, client.id];
      }

      await this.cacheService.set(AppConstCacheKeys.SOCKET_POOL, cache, {
        t: AppConstCacheType.BUILT_IN,
        ttl: 0,
      });
    } else {
      await this.cacheService.set(
        AppConstCacheKeys.SOCKET_POOL,
        [[fingerprint, client.id]],
        {
          t: AppConstCacheType.BUILT_IN,
          ttl: 0,
        },
      );
    }
  }

  @SubscribeMessage('hello')
  onHello(@MessageBody() data: string) {   
    this.logger.debug(data);
    this.server.emit('onMessage', { msg: 'Hello world', content: data });
  }

  @SubscribeMessage('state')
  async stateHandler(@MessageBody() payload: AppMonitorUserDTO) {
    await this.monitorUserService.socketHandler(payload);
  }

  @SubscribeMessage('signin')
  async signinHandler(@MessageBody() payload: AppMonitorUserDTO) {
    await this.monitorUserService.signin(payload);
  }

  @SubscribeMessage('signout')
  async signoutHandler(@MessageBody() visitorId: string) {
    await this.monitorUserService.signout(visitorId);
  }
}
