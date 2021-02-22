import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  SetMetadata,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto, ReadUserDto, UpdateUserDto } from './dto';
import { User, UserDocument } from './schema/user.schema';
import { UserEntity } from './entities/user.entity';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { hasRole } from '../../decorators/hasRole.decorator';

import { Log } from '../../decorators/logger.decorator';
import { ActionType } from '../../decorators/actionType';

@ApiTags('system/user')
@Controller('system/user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  @Log({ title: '查询用户', action: ActionType.READ })
  async read(@Param() params: ReadUserDto) {
    return this.userService.read(params);
  }

  @Delete(':id')
  async delete(@Param() params) {
    return this.userService.delete(params.id);
  }

  /* @UseInterceptors(ClassSerializerInterceptor) */
  @Post()
  async create(@Body() userData: any): Promise<UserEntity> {
    return new UserEntity({ ...(await this.userService.create(userData)) });
  }

  @Put()
  async update(@Body() userData: UpdateUserDto) {
    return await this.userService.update(userData);
  }

  @Post('list')
  @hasRole('admin')
  @Log({ title: '查询所有用户', action: ActionType.LIST })
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }
}
