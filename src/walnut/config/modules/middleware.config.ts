import { AppConstHeaders } from '@/const/app/header';
import { AppConstRequestMethod } from '@/const/app/methods';
import { registerAs } from '@nestjs/config';

export default registerAs('middleware', () => ({
  userAgent: {
    os: ['Mobile', 'Mac OS', 'Windows', 'UNIX', 'Linux', 'iOS', 'Android'],
    browser: [
      'IE',
      'Safari',
      'Mobile Safari',
      'Edge',
      'Opera',
      'Chrome',
      'Firefox',
      'Samsung Browser',
      'UCBrowser',
    ],
  },

  cors: {
    allowMethod: [
      AppConstRequestMethod.GET,
      AppConstRequestMethod.POST,
      AppConstRequestMethod.DELETE,
      AppConstRequestMethod.PUT,
      AppConstRequestMethod.PATCH,
    ],

    // allowOrigin: '*', // allow all origin
    // allowOrigin: [/example\.com(\:\d{1,4})?$/], // allow all subdomain, and all port
    // allowOrigin: [/example\.com$/], // allow all subdomain without port

    allowHeader: [
      'Accept',
      'Accept-Language',
      'Content-Language',
      'Content-Type',
      'Origin',
      'Authorization',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Credentials',
      'Access-Control-Expose-Headers',
      'Access-Control-Max-Age',
      'Referer',
      'Host',
      'X-Requested-With',
      'X-Content-Type-Options',
      AppConstHeaders.ID,
      AppConstHeaders.IP,
      AppConstHeaders.LANGUAGE,
      AppConstHeaders.TIMESTAMP,
      AppConstHeaders.TIMEZONE,
      AppConstHeaders.RES_TIME,
      AppConstHeaders.USER_AGENT,
      AppConstHeaders.VERSION,
      AppConstHeaders.REPO_VERSION,
      AppConstHeaders.LOCATION,
      AppConstHeaders.FINGERPRINT,
      AppConstHeaders.LOCATION,
      AppConstHeaders.ERROR,
      AppConstHeaders.SLEEP,
    ],
  },

  ip: {
    blackList: [],
  },
}));
