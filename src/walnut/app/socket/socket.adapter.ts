import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { ConfigService } from '@nestjs/config';

export class SocketIoAdapter extends IoAdapter {
  constructor(
    private readonly app: INestApplicationContext,
    private readonly configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    port = this.configService.get<number>('socket.port');
    const path = this.configService.get<string>('socket.path');
    const origins = this.configService.get<string>(
      'socket.origin',
    );
    const origin = origins.split(',');
    options.path = path;
    options.cors = { origin };
    const server = super.createIOServer(port, options);
    return server;
  }
}
