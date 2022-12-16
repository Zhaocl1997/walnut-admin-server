import Sts20150401, * as $Sts20150401 from '@alicloud/sts20150401';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';

export const generateSTSToken = async (
  accessKeyId: string,
  accessKeySecret: string,
  endpoint: string,
  roleArn: string,
  roleSessionName: string,
) => {
  const config = new $OpenApi.Config({
    accessKeyId,
    accessKeySecret,
    endpoint,
  });

  const client = new Sts20150401(config);

  const assumeRole = new $Sts20150401.AssumeRoleRequest({
    roleArn,
    roleSessionName,
  });

  const res = await client.assumeRole(assumeRole);

  return res;
};
