import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const WalnutUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IWalnutTokenPayload => {
    const request = ctx.switchToHttp().getRequest<IWalnutRequest>();
    return request.user;
  },
);
