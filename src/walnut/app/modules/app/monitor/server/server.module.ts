import { Module } from '@nestjs/common';
import { AppMonitorServerController } from './server.controller';
import { AppMonitorServerService } from './server.service';

@Module({
  imports: [],
  controllers: [AppMonitorServerController],
  providers: [AppMonitorServerService],
  exports: [AppMonitorServerService],
})
export class AppMonitorServerModule {}
