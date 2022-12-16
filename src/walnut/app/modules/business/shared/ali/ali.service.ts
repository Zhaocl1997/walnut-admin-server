import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateSTSToken } from '@/utils/vendor/ali-oss-sts';

@Injectable()
export class SharedAliService {
  constructor(private configService: ConfigService) {}

  async getSTSToken() {
    const { id, secret, region, bucket, endPoint, roleArn, roleSessionName } =
      this.configService.get<{
        region: string;
        bucket: string;
        id: string;
        secret: string;
        endPoint: string;
        roleArn: string;
        roleSessionName: string;
      }>('vendor.ali.OSS');

    const res = await generateSTSToken(
      id,
      secret,
      endPoint,
      roleArn,
      roleSessionName,
    );

    return {
      accessKeyId: res.body.credentials.accessKeyId,
      accessKeySecret: res.body.credentials.accessKeySecret,
      stsToken: res.body.credentials.securityToken,
      region: region,
      bucket: bucket,
    };
  }
}
