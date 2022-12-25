import { Global, Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { AppMonitorUserModule } from '@/modules/app/monitor/user/user.module';

@Global()
@Module({
  imports: [AppMonitorUserModule],
  providers: [SocketGateway, SocketService],
  exports: [SocketService],
})
export class SocketModule {}
