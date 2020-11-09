import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { UserService } from './user.service';
import { UserInterface } from './user.interface';
import { CreateUserDto, ReadUserDto, UpdateUserDto } from './dto';

/*
 * Controllers are responsible for handling incoming requests and returning responses to the client.
 */
@ApiTags('system/user')
// @ApiHeader({
//   name: 'myHeader',
//   description: 'Custom header',
// })
@Controller('system')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get('user/:id')
  async read(@Param() params: ReadUserDto) {
    return this.userService.read(params);
  }

  @Delete('user/:id')
  async delete(@Param() params) {
    return this.userService.delete(params.id);
  }

  @Post('user')
  // @ApiResponse({
  //   status: 201,
  //   description: 'The user has been successfully created.',
  // })
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Put('user')
  async update(@Body() userData: UpdateUserDto) {
    return this.userService.update(userData);
  }

  @Post('user/list')
  async findAll(): Promise<UserInterface[]> {
    // console.log(this.configService.get<number>('port'));

    return this.userService.findAll();
  }
}
