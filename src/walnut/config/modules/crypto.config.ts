import { registerAs } from '@nestjs/config';

export default registerAs('crypto', () => ({
  request: {
    key: process.env.CRYPTO_REQUEST_KEY,
    iv: process.env.CRYPTO_REQUEST_IV,
  },
  response: {
    key: process.env.CRYPTO_RESPONSE_KEY,
    iv: process.env.CRYPTO_RESPONSE_IV,
  },
}));
