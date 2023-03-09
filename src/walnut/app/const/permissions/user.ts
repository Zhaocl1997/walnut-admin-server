export const AppConstPermissionUser = {
  CREATE: 'system:user:create',
  READ: 'system:user:read',
  UPDATE: 'system:user:update',
  DELETE: 'system:user:delete',
  DELETE_MANY: 'system:user:deleteMany',
  LIST: 'system:user:list',

  PASSWORD_UPDATE: 'system:user:password:update',
  PASSWORD_RESET: 'system:user:passowrd:reset'
} as const;
