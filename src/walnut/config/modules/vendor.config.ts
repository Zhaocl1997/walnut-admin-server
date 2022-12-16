import { registerAs } from '@nestjs/config';

export default registerAs('vendor', () => ({
  baidu: process.env.VENDOR_KEYS_BAIDU,

  ali: {
    OSS: {
      region: process.env.VENDOR_KEYS_ALI_OSS_REGION,
      bucket: process.env.VENDOR_KEYS_ALI_OSS_BUCKET,
      id: process.env.VENDOR_KEYS_ALI_OSS_ID,
      secret: process.env.VENDOR_KEYS_ALI_OSS_SECRET,
      endPoint: process.env.VENDOR_KEYS_ALI_OSS_ENDPOINT,
      roleArn: process.env.VENDOR_KEYS_ALI_OSS_ROLE_ARN,
      roleSessionName: process.env.VENDOR_KEYS_ALI_OSS_ROLE_SESSION_NAME,
    },
  },

  tx: {
    SMS: {
      region: process.env.VENDOR_KEYS_TX_SMS_REGION,
      id: process.env.VENDOR_KEYS_TX_SMS_ID,
      secret: process.env.VENDOR_KEYS_TX_SMS_SECRET,
      endPoint: process.env.VENDOR_KEYS_TX_SMS_ENDPOINT,
      sdkAppId: process.env.VENDOR_KEYS_TX_SMS_SDK_APP_ID,
      signName: process.env.VENDOR_KEYS_TX_SMS_SIGN_NAME,
      templateId: process.env.VENDOR_KEYS_TX_SMS_TEMPLATE_ID,
    },
  },
}));
