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

  /*class AppHost {
   constructor(hostName, cspProtocol, protocol = 'http') {
   this.protocol = protocol;
   this.hostName = hostName;
   this.cspProtocol = cspProtocol;
   }
   // host name with protocol
   pName() {
   return `${this.protocol}://${this.hostName}`;
   }
   // host name with csp protocol
   cspName() {
   return `${this.cspProtocol || this.protocol}://${this.hostName}`;
   }
   // odata host name
   odata() {
   return `${this.pName()}/odata`;
   }
   // token host name for token-base-authentication
   token() {
   return `${this.pName()}/Token`;
   }
   }*/
  // *************
  // Not working yet. Transformed that code with babel to code below
  // *************

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) {
          descriptor.writable = true;
        }
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function (Constructor, protoProps, staticProps) {
      if (protoProps) {
        defineProperties(Constructor.prototype, protoProps);
      }
      if (staticProps) {
        defineProperties(Constructor, staticProps);
      }
      return Constructor;
    };
  })();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  var AppHost = (function () {
    function AppHost(hostName, cspProtocol) {
      var protocol = arguments[2] === undefined ? 'http' : arguments[2];

      _classCallCheck(this, AppHost);

      this.protocol = protocol;
      this.hostName = hostName;
      this.cspProtocol = cspProtocol;
    }

    _createClass(AppHost, [
      {
        key: 'pName',

        // host name with protocol
        value: function pName() {
          return '' + this.protocol + '://' + this.hostName;
        }
      },
      {
        key: 'cspName',

        // host name with csp protocol
        value: function cspName() {
          return '' + (this.cspProtocol || this.protocol) + '://' + this.hostName;
        }
      },
      {
        key: 'odata',

        // odata host name
        value: function odata() {
          return '' + this.pName() + '/odata';
        }
      },
      {
        key: 'token',

        // token url name for token-base-authentication
        value: function token() {
          return '' + this.pName() + '/Token';
        }
      }
    ]);

    return AppHost;
  })();



  ENV.APP = {
    // Here you can pass flags/options to your application instance
    // when it is created
    availableHosts: [
      new AppHost("northwindodata.azurewebsites.net", "https"),
      new AppHost("localhost:4356"),
      new AppHost("localhost:1180")
    ]
  };

  var activeHost = ENV.APP.availableHosts[0]; // just change index to connect to your server
  ENV.APP.activeHost = {
    name: activeHost.pName(),
    odata: activeHost.odata(),
    token: activeHost.token()
  };

  // Read more about CSP:
  // http://www.ember-cli.com/#content-security-policy
  // https://github.com/rwjblue/ember-cli-content-security-policy
  // http://content-security-policy.com
  ENV.contentSecurityPolicy = {
    'style-src': "'self' 'unsafe-inline'",
    'connect-src': "'self' " + ENV.APP.availableHosts.map(function (item) {
      return item.cspName()
    }).join(" ")
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
      crossOriginWhitelist: ENV.APP.availableHosts.map(function (item) {
        return item.odata();
      })
    };
  }

  if (environment === 'production') {

  }

  return ENV;
};
