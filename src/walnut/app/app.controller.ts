import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  hello() {
    return this.appService.getHello();
  }

  @Get(':photoName')
  servePhoto(@Param('photoName') photo, @Res() res) {   
    res.sendFile(photo, { root: 'assets' });
  }
}
