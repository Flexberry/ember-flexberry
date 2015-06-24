/* jshint node: true */

module.exports = function(environment) {

  var backendRootUrl;
  if (environment !== 'development-local') {
    // Use remote service by default.
    backendRootUrl = 'https://northwindodata.azurewebsites.net';
  } else {
    // To work with a local service, run `ember serve --environment=development-local`.
    backendRootUrl = 'http://localhost:1180';
  }

  var ENV = {
    modulePrefix: 'prototype-ember-cli-application',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created.

      // It's a custom property, used to prevent duplicate backend urls in sources.
      backendUrls: {
        root: backendRootUrl,
        api: backendRootUrl + '/odata',
        authToken: backendRootUrl + '/Token'
      }
    }
  };

  // Read more about CSP:
  // http://www.ember-cli.com/#content-security-policy
  // https://github.com/rwjblue/ember-cli-content-security-policy
  // http://content-security-policy.com
  ENV.contentSecurityPolicy = {
    'style-src': "'self' 'unsafe-inline'",
    'connect-src': "'self' " + ENV.APP.backendUrls.root
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  } else {
    ENV['simple-auth'] = {
      authorizer: 'authorizer:custom',
      crossOriginWhitelist: [ENV.APP.backendUrls.root]
    };
  }

  if (environment === 'production') {

  }

  return ENV;
};
