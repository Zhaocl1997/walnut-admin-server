import * as OAuth2Strategy from 'passport-oauth2';
import { InternalOAuthError } from 'passport-oauth2';

import { inherits } from '../inherit';

function parse(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }

  var user: any = {};
  user.provider = 'weibo';
  user.id = json.idstr;
  user.name = json.screen_name || json.name;
  user.avatar_url = json.avatar_hd;
  user._raw = json;
  user._json = json;

  return user;
}

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL =
    options.authorizationURL || 'https://api.weibo.com/oauth2/authorize';
  options.tokenURL =
    options.tokenURL || 'https://api.weibo.com/oauth2/access_token';
  options.scopeSeparator = options.scopeSeparator || ',';
  options.customHeaders = options.customHeaders || {};
  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-weibo';
  }

  OAuth2Strategy.call(this, options, verify);
  this.name = 'weibo';
  this._getuidAPI =
    options.getuidAPI || 'https://api.weibo.com/2/account/get_uid.json';
  this._getProfileAPI =
    options.getProfileAPI || 'https://api.weibo.com/2/users/show.json';
}

inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function (accessToken, done) {
  var self = this;
  this._oauth2.getProtectedResource(
    this._getuidAPI,
    accessToken,
    function (err, body, res) {
      if (err) return done(new InternalOAuthError('', err));

      try {
        var raw = JSON.parse(body);
        self._oauth2.getProtectedResource(
          self._getProfileAPI + '?uid=' + raw.uid,
          accessToken,
          function (err, body, res) {
            if (err) return done(new InternalOAuthError('', err));

            try {
              done(null, parse(body)); // this is different with raw.
            } catch (e) {
              done(e);
            }
          },
        );
      } catch (e) {
        done(e);
      }
    },
  );
};

export { Strategy };

export interface WeiboUserInfo {
  id: string;
  name: string;
  avatar_url: string;
  email: string;
  provider: string;
}
