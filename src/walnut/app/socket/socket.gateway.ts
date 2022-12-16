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

// TODO extract to config
@WebSocketGateway({
  namespace: 'walnut-namespace',
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketGateway.name);

  @WebSocketServer()
  private readonly server: Server;

  afterInit() {
    this.logger.debug('Websocket Server Started, Listening on Port: 5173');
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('hello')
  onHello(@MessageBody() data: string) {
    this.logger.debug(data);
    this.server.emit('onMessage', { msg: 'Hello world', content: data });
  }
}
