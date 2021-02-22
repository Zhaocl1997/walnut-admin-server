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
import { Schema } from 'mongoose';

import { MenuService } from './menu.service';
import { Menu } from './schema/menu.schema';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('system/menu')
@Controller('system/menu')
@UseGuards(JwtAuthGuard)
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Post()
  async create(@Body() menuData: any) {
    return await this.menuService.create(menuData);
  }

  @Get(':id')
  async read(@Param('id') id: Schema.Types.ObjectId) {
    return await this.menuService.read(id);
  }

  @Put()
  async update(@Body() menuData: any) {   
    return await this.menuService.update(menuData);
  }

  @Delete(':id')
  async delete(@Param('id') id: Schema.Types.ObjectId) {
    return await this.menuService.delete(id);
  }

  @Post('list')
  async findAll(@Body() listParams: any): Promise<Menu[]> {       
    return await this.menuService.findAll();
  }
}
