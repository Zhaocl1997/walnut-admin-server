import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';

import * as tencentcloud from 'tencentcloud-sdk-nodejs';

import type { ClientConfig } from 'tencentcloud-sdk-nodejs/tencentcloud/common/interface';
import type { SendSmsRequest } from 'tencentcloud-sdk-nodejs/tencentcloud/services/sms/v20210111/sms_models';
import type { Client } from 'tencentcloud-sdk-nodejs/tencentcloud/services/sms/v20210111/sms_client';

import { AppConstProcess } from '@/const/app/process';
import { AppConstQueue } from '@/const/app/queue';
import { WalnutExceptionSendTextMessageError } from '@/exceptions/bussiness/phone';
import { AppBaseProcessor } from '@/common/processor/base.processor';

@Processor(AppConstQueue.PHONE)
export class AppSmsProcessor extends AppBaseProcessor {
  protected readonly logger = new Logger(this.constructor.name);

  private readonly smsClient: Client;

  constructor(private readonly configService: ConfigService) {
    super();

    const clientConfig: ClientConfig = {
      /* 必填：腾讯云账户密钥对secretId，secretKey。
       * 这里采用的是从环境变量读取的方式，需要在环境变量中先设置这两个值。
       * 你也可以直接在代码中写死密钥对，但是小心不要将代码复制、上传或者分享给他人，
       * 以免泄露密钥对危及你的财产安全。
       * SecretId、SecretKey 查询: https://console.cloud.tencent.com/cam/capi */
      credential: {
        secretId: configService.get('vendor.tx.SMS.id'),
        secretKey: configService.get('vendor.tx.SMS.secret'),
      },

      /* 必填：地域信息，可以直接填写字符串ap-guangzhou，支持的地域列表参考 https://cloud.tencent.com/document/api/382/52071#.E5.9C.B0.E5.9F.9F.E5.88.97.E8.A1.A8 */
      region: configService.get('vendor.tx.SMS.region'),

      profile: {
        /* SDK默认用TC3-HMAC-SHA256进行签名，非必要请不要修改这个字段 */
        signMethod: 'HmacSHA256',

        httpProfile: {
          /**
           * 指定接入地域域名，默认就近地域接入域名为 sms.tencentcloudapi.com ，也支持指定地域域名访问，例如广州地域的域名为 sms.ap-guangzhou.tencentcloudapi.com
           */
          endpoint: configService.get('vendor.tx.SMS.endPoint'),

          /* SDK默认使用POST方法。
           * 如果你一定要使用GET方法，可以在这里设置。GET方法无法处理一些较大的请求 */
          reqMethod: 'POST',

          /* SDK有默认的超时时间，非必要请不要进行调整
           * 如有需要请在代码中查阅以获取最新的默认值 */
          reqTimeout: 60,
        },
      },
    };

    this.smsClient = new tencentcloud.sms.v20210111.Client(clientConfig);
  }

  // send verify code text message
  @Process(AppConstProcess.PHONE_VERIFY)
  async JobSendVerifyCodeTextMessage(job: Job<any>) {
    const { phoneNumber, verifyCode, expireSeconds } = job.data;

    const params: SendSmsRequest = {
      /* 短信应用ID: 短信SmsSdkAppId在 [短信控制台] 添加应用后生成的实际SmsSdkAppId，示例如1400006666 */
      // 应用 ID 可前往 [短信控制台](https://console.cloud.tencent.com/smsv2/app-manage) 查看
      SmsSdkAppId: this.configService.get('vendor.tx.SMS.sdkAppId'),
      /* 短信签名内容: 使用 UTF-8 编码，必须填写已审核通过的签名 */
      // 签名信息可前往 [国内短信](https://console.cloud.tencent.com/smsv2/csms-sign) 或 [国际/港澳台短信](https://console.cloud.tencent.com/smsv2/isms-sign) 的签名管理查看
      SignName: this.configService.get('vendor.tx.SMS.signName'),
      /* 模板 ID: 必须填写已审核通过的模板 ID */
      // 模板 ID 可前往 [国内短信](https://console.cloud.tencent.com/smsv2/csms-template) 或 [国际/港澳台短信](https://console.cloud.tencent.com/smsv2/isms-template) 的正文模板管理查看
      TemplateId: this.configService.get('vendor.tx.SMS.templateId'),
      /* 模板参数: 模板参数的个数需要与 TemplateId 对应模板的变量个数保持一致，若无模板参数，则设置为空 */
      TemplateParamSet: [`${verifyCode}`, `${Math.floor(expireSeconds / 60)}`],
      /* 下发手机号码，采用 e.164 标准，+[国家或地区码][手机号]
       * 示例如：+8613711112222， 其中前面有一个+号 ，86为国家码，13711112222为手机号，最多不要超过200个手机号*/
      PhoneNumberSet: [phoneNumber],
      /* 用户的 session 内容（无需要可忽略）: 可以携带用户侧 ID 等上下文信息，server 会原样返回 */
      SessionContext: '',
      /* 短信码号扩展号（无需要可忽略）: 默认未开通，如需开通请联系 [腾讯云短信小助手] */
      ExtendCode: '',
      /* 国际/港澳台短信 senderid（无需要可忽略）: 国内短信填空，默认未开通，如需开通请联系 [腾讯云短信小助手] */
      SenderId: '',
    };

    const res = await this.smsClient.SendSms(params);

    this.logger.debug(res);

    if (res.SendStatusSet[0].Code === 'Ok') {
      return true;
    }

    throw new WalnutExceptionSendTextMessageError();
  }
}
