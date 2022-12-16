import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  access: {
    secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    expire: process.env.JWT_ACCESS_TOKEN_EXPIRE,
  },
  refresh: {
    secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    expire: process.env.JWT_REFRESH_TOKEN_EXPIRE,
  },
}));
