import { Controller, Get, Post, Body, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { UserInterface } from './interfaces/user.interface';

/*
 * Controllers are responsible for handling incoming requests and returning responses to the client.
 */
@Controller('user')
export class AppController {
  constructor(private appService: AppService) {}

  @Post()
  async create(@Body() newUser: UserInterface) {
    this.appService.create(newUser);
  }

  @Get()
  async findAll(): Promise<UserInterface[]> {
    return this.appService.findAll();
  }
}
