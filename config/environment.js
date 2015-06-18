/* jshint node: true */

module.exports = function(environment) {
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
    }
  };

  var activeHostName = 'http://' +
    'northwindodata.azurewebsites.net';
    //'localhost:4356';
    //'localhost:1180';

  ENV.APP = {
    activeHost: {
      name: activeHostName,
      api: activeHostName + '/odata',
      token: activeHostName + '/Token'
    }
  };

  // Read more about CSP:
  // http://www.ember-cli.com/#content-security-policy
  // https://github.com/rwjblue/ember-cli-content-security-policy
  // http://content-security-policy.com
  ENV.contentSecurityPolicy = {
    'style-src': "'self' 'unsafe-inline'",
    'connect-src': "'self' " + ENV.APP.activeHost.name
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
      crossOriginWhitelist: [ENV.APP.activeHost.name]
    };
  }

  if (environment === 'production') {

  }

  return ENV;
};
