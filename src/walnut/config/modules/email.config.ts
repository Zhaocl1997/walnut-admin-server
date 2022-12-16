import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASS,
  },
  defaults: {
    from: {
      address: process.env.EMAIL_FROM_ADDRESS,
      name: process.env.EMAIL_FROM_NAME,
    },
  },
}));
