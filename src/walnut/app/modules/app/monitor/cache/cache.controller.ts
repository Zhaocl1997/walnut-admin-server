import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { orderBy } from 'lodash';
import * as sizeof from 'object-sizeof';

import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';
import { HasRole } from '@/decorators/walnut/hasRole.decorator';
import { AppConstRoles } from '@/const/role';
import { AppDayjs } from '@/utils/dayjs';
import { HasPermission } from '@/decorators/walnut/hasPermission.decorator';
import { AppConstPermissionMonitorCache } from '@/const/permissions/monitor/cache';

import { WalnutCrudDecorators } from '@/decorators/crud';
import { AppConstLogOperateTitle } from '@/const/decorator/logOperate';

import { AppCacheService } from './cache.service';
import { AppMonitorCacheEntity } from './cache.entity';
import { WalnutListRequestDTO } from '@/common/dto/list.dto';

const { ReadDecorator, ListDecorator, DeleteDecorator } = WalnutCrudDecorators({
  title: AppConstLogOperateTitle.APP_CACHE,
  DTO: '',
  extra: {
    needOperateLog: false,
  },
});

@ApiTags('app/monitor/cache')
@Controller('app/monitor/cache')
// @HasRole(AppConstRoles.ADMIN)
@UseGuards(JwtAccessGuard)
export class AppCacheController {
  constructor(private readonly cacheService: AppCacheService) {}

  @ReadDecorator('key')
  @HasPermission(AppConstPermissionMonitorCache.READ)
  async read(@Param('key') key: string) {
    return {
      value: await this.cacheService.get(key),
    };
  }

  // need to define before `DeleteDecorator`
  @Delete('/clear')
  @HttpCode(HttpStatus.OK)
  @HasPermission(AppConstPermissionMonitorCache.CLEAR)
  async clearCache() {
    await this.cacheService.clear();

    return true;
  }

  @DeleteDecorator('key')
  @HasPermission(AppConstPermissionMonitorCache.DELETE)
  async deleteCache(@Param('key') key: string) {
    await this.cacheService.del(key);

    return true;
  }

  @ListDecorator()
  @HasPermission(AppConstPermissionMonitorCache.LIST)
  async list(@Body() params: WalnutListRequestDTO<any>) {
    const allData = await this.cacheService.list();

    let arr = [];

    Object.entries(allData).map(([key, value]) => {
      const startTime = AppDayjs(value.start);
      const expireTime = startTime.add(value.ttl, 'second');

      arr.push({
        key: key,

        // @ts-expect-error
        valueBytes: sizeof(value.v),
        expire: +value.ttl,
        type: value.t,
        startTime: startTime,
        expireTime: expireTime,
      });
    });

    const { sort, query, page } = params;

    if (sort) {
      // sort
      arr = orderBy(
        arr,
        [sort[0].field],
        [sort[0].order === 'ascend' ? 'asc' : 'desc'],
      );
    }

    if (query) {
      // filter
      Object.entries(query).map(([key, value]) => {
        arr = arr.filter((i) =>
          key && value && Array.isArray(value)
            ? value.includes(i[key.toLowerCase()].toLowerCase())
            : i[key.toLowerCase()].toLowerCase().includes(value),
        );
      });
    }

    let format = arr.map((i) => new AppMonitorCacheEntity(i));

    return {
      total: format.length,
      data: format,
    };
  }
}
