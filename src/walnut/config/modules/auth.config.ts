import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  github: {
    clientId: process.env.AUTH_GITHUB_CLIENTID,
    clientSecret: process.env.AUTH_GITHUB_CLIENTSECRET,
    callbackURL: process.env.AUTH_GITHUB_CALLBACK,
  },
  gitee: {
    clientId: process.env.AUTH_GITEE_CLIENTID,
    clientSecret: process.env.AUTH_GITEE_CLIENTSECRET,
    callbackURL: process.env.AUTH_GITEE_CALLBACK,
  },
  weibo: {
    clientId: process.env.AUTH_WEIBO_CLIENTID,
    clientSecret: process.env.AUTH_WEIBO_CLIENTSECRET,
    callbackURL: process.env.AUTH_WEIBO_CALLBACK,
  },
}));
