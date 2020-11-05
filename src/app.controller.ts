import { Controller, Get } from '@nestjs/common';

/*
 * Controllers are responsible for handling incoming requests and returning responses to the client.
 */
@Controller()
export class AppController {
  @Get()
  root(): string {
    return '<h1>Hello World!</h1>';
  }
}
