import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT),

  api: {
    prefix: process.env.APP_API_PREFIX,
    version: parseInt(process.env.APP_API_VERSION),
  },

  throttle: {
    ttl: parseInt(process.env.APP_THROTTLE_TTL) * 1000,
    limit: parseInt(process.env.APP_THROTTLE_LIMIT),
  },

  i18n: {
    fallback: process.env.APP_I18N_FALLBACK,
  },

  cache: {
    ttl: parseInt(process.env.APP_CACHE_TTL) * 1000,
    max: parseInt(process.env.APP_CACHE_MAX),
  },

  redis: {
    host: process.env.APP_REDIS_HOST,
    port: parseInt(process.env.APP_REDIS_PORT),
    pass: process.env.APP_REDIS_PASS,
  },
}));
