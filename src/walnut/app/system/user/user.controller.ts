import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto, ReadUserDto, UpdateUserDto } from './dto';
import { User, UserDocument } from './schema/user.schema';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RoleService } from '../role/role.service';

@ApiTags('system/user')
@Controller('system/user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
  ) {}

  @Get(':id')
  async read(@Param() params: ReadUserDto) {
    return this.userService.read(params);
  }

  @Delete(':id')
  async delete(@Param() params) {
    return this.userService.delete(params.id);
  }

  @Post()
  async create(@Body() userData: any) {
    const defaultRole = await this.roleService.findOne('user');
    const newUser = { ...userData, role: defaultRole._id };
    return this.userService.create(newUser);
  }

  @Put()
  async update(@Body() userData: UpdateUserDto) {
    return this.userService.update(userData);
  }

  @Post('list')
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
