declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_API_PREFIX: string;
      APP_API_VERSION: string;
      APP_PORT: string;

      APP_THROTTLE_TTL: string;
      APP_THROTTLE_LIMIT: string;

      APP_CACHE_TTL: string;
      APP_CACHE_MAX: string;

      APP_I18N_FALLBACK: string;

      APP_REDIS_HOST: string
      APP_REDIS_PORT: string
      APP_REDIS_PASS: string

      DATABASE_HOST: string;
      DATABASE_PORT: string;
      DATABASE_NAME: string;
      DATABASE_SOURCE: string;
      DATABASE_USER: string;
      DATABASE_PASS: string;

      AUTH_GITHUB_CLIENTID: string
      AUTH_GITHUB_CLIENTSECRET: string
      AUTH_GITHUB_CALLBACK: string

      AUTH_GITEE_CLIENTID: string
      AUTH_GITEE_CLIENTSECRET: string
      AUTH_GITEE_CALLBACK: string

      AUTH_WEIBO_CLIENTID: string
      AUTH_WEIBO_CLIENTSECRET: string
      AUTH_WEIBO_CALLBACK: string

      JWT_ACCESS_TOKEN_SECRET: string;
      JWT_ACCESS_TOKEN_EXPIRE: string;
      JWT_REFRESH_TOKEN_SECRET: string;
      JWT_REFRESH_TOKEN_EXPIRE: string;

      CRYPTO_REQUEST_KEY: string;
      CRYPTO_REQUEST_IV: string;

      CRYPTO_RESPONSE_KEY: string;
      CRYPTO_RESPONSE_IV: string;

      SOCKET_SERVER_PORT: string
      SOCKET_SERVER_PATH: string
      SOCKET_SERVER_ORIGIN: string

      VENDOR_KEYS_BAIDU: string

      EMAIL_HOST: string
      EMAIL_PORT: string
      EMAIL_AUTH_USER: string
      EMAIL_AUTH_PASS: string
      EMAIL_FROM_ADDRESS: string
      EMAIL_FROM_NAME: string

      VENDOR_KEYS_ALI_OSS_REGION: string;
      VENDOR_KEYS_ALI_OSS_BUCKET: string;
      VENDOR_KEYS_ALI_OSS_ID: string;
      VENDOR_KEYS_ALI_OSS_SECRET: string;
      VENDOR_KEYS_ALI_OSS_ENDPOINT: string;
      VENDOR_KEYS_ALI_OSS_ROLE_ARN: string;
      VENDOR_KEYS_ALI_OSS_ROLE_SESSION_NAME: string;

      VENDOR_KEYS_TX_SMS_REGION: string
      VENDOR_KEYS_TX_SMS_ID: string
      VENDOR_KEYS_TX_SMS_SECRET: string
      VENDOR_KEYS_TX_SMS_ENDPOINT: string
      VENDOR_KEYS_TX_SMS_SDK_APP_ID: string
      VENDOR_KEYS_TX_SMS_SIGN_NAME: string
      VENDOR_KEYS_TX_SMS_TEMPLATE_ID: string
    }
  }
}

export {};
