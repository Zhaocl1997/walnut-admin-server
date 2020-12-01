import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleService } from '../../system/role/role.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private roleService: RoleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const rolename = (await this.roleService.findById(user.role)).rolename;

    if (!roles.includes(rolename)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
