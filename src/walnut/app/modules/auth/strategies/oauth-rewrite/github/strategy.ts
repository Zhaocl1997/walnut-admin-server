import * as OAuth2Strategy from 'passport-oauth2';
import { InternalOAuthError } from 'passport-oauth2';

import { inherits } from '../inherit';

function parse(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }

  var profile: any = {};
  profile.id = String(json.id);
  profile.nodeId = json.node_id;
  profile.displayName = json.name;
  profile.username = json.login;
  profile.profileUrl = json.html_url;
  if (json.email) {
    profile.emails = [{ value: json.email }];
  }
  if (json.avatar_url) {
    profile.photos = [{ value: json.avatar_url }];
  }

  return profile;
}

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL =
    options.authorizationURL || 'https://github.com/login/oauth/authorize';
  options.tokenURL =
    options.tokenURL || 'https://github.com/login/oauth/access_token';
  options.scopeSeparator = options.scopeSeparator || ',';
  options.customHeaders = options.customHeaders || {};

  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] =
      options.userAgent || 'passport-github';
  }

  OAuth2Strategy.call(this, options, verify);
  this.name = options.name || 'github';
  this._userProfileURL =
    options.userProfileURL || 'https://api.github.com/user';
  this._userEmailURL =
    options.userEmailURL || 'https://api.github.com/user/emails';
  this._oauth2.useAuthorizationHeaderforGET(true);
  this._allRawEmails = options.allRawEmails || false;
}

inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function (accessToken, done) {
  var self = this;

  this._oauth2.get(
    this._userProfileURL,
    accessToken,
    function (err, body, res) {
      var json;

      if (err) {
        return done(
          new InternalOAuthError('Failed to fetch user profile', err),
        );
      }

      try {
        json = JSON.parse(body);
      } catch (ex) {
        return done(new Error('Failed to parse user profile'));
      }

      var profile = parse(json);
      profile.provider = 'github';
      profile._raw = body;
      profile._json = json;

      var canAccessEmail = false;
      var scopes = self._scope;
      if (typeof scopes === 'string') {
        scopes = scopes.split(self._scopeSeparator);
      }
      if (Array.isArray(scopes)) {
        canAccessEmail = scopes.some(function (scope) {
          return scope === 'user' || scope === 'user:email';
        });
      }
      if (!canAccessEmail) {
        return done(null, profile);
      }

      // Getting emails
      self._oauth2.get(
        self._userEmailURL,
        accessToken,
        function (err, body, res) {
          if (err) {
            return done(
              new InternalOAuthError('Failed to fetch user emails', err),
            );
          }

          var json = JSON.parse(body);

          if (!json || !json.length) {
            return done(new Error('Failed to fetch user emails'));
          }

          if (self._allRawEmails) {
            profile.emails = json.map(function (email) {
              email.value = email.email;
              delete email.email;
              return email;
            });
          } else {
            for (var index in json) {
              if (json[index].primary) {
                profile.emails = [{ value: json[index].email }];
                break;
              }
            }
          }

          done(null, profile);
        },
      );
    },
  );
};

export { Strategy };

export interface GitHubUserInfo {
  id: string;
  username: string;
  avatar_url: string;
  email: string;
  provider: string;
}
