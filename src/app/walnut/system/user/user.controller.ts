import { Controller, Get, Post, Body } from '@nestjs/common';

import { UserService } from './user.service';
import { UserInterface } from './user.interface';
import { CreateUserDto } from './dto/user-create.dto';

/*
 * Controllers are responsible for handling incoming requests and returning responses to the client.
 */
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Get()
  async findAll(): Promise<UserInterface[]> {
    return this.userService.findAll();
  }
}
