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

import { RoleService } from './role.service';
import { Role, RoleDocument } from './schema/role.schema';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('system/role')
@Controller('system/role')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get(':id')
  async read(@Param() params: any) {
    return this.roleService.read(params);
  }

  @Delete(':id')
  async delete(@Param() params) {
    return this.roleService.delete(params.id);
  }

  @Post()
  async create(@Body() roleData: RoleDocument) {
    return this.roleService.create(roleData);
  }

  @Put()
  async update(@Body() roleData: any) {
    return this.roleService.update(roleData);
  }

  @Post('list')
  async findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }
}
