import * as OAuth2Strategy from 'passport-oauth2';
import { InternalOAuthError } from 'passport-oauth2';

import { inherits } from '../inherit';

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL =
    options.authorizationURL || 'https://gitee.com/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://gitee.com/oauth/token';
  options.scopeSeparator = options.scopeSeparator || '';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'gitee';
  this._userProfileURL =
    options.userProfileURL || 'https://gitee.com/api/v5/user';
}

inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.get(
    this._userProfileURL,
    accessToken,
    function (err, body, res) {
      if (err) {
        return done(
          new InternalOAuthError('Failed to fetch user profile', err),
        );
      }
      try {
        const profile = JSON.parse(body);
        return done(null, Object.assign(profile, { provider: 'gitee' }));
      } catch (ex) {
        return done(new Error('Failed to parse user profile'));
      }
    },
  );
};

export { Strategy };

export interface GiteeUserInfo {
  id: string;
  name: string;
  avatar_url: string;
  email: string;
  provider: string;
}
