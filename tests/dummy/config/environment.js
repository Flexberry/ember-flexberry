'use strict';

module.exports = function(environment) {
  var backendUrl = 'http://stands-backend.flexberry.net';

  if (environment === 'development-loc') {
    // Use `ember s -e development-loc` command for local backend usage.
    backendUrl = 'http://localhost:6501';
  }

  let ENV = {
    repositoryName: 'ember-flexberry/dummy',
    modulePrefix: 'dummy',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Application name
      name: 'dummy',

      // Here you can pass flags/options to your application instance
      // when it is created
      backendUrl: backendUrl,

      // It's a custom property, used to prevent duplicate backend urls in sources.
      backendUrls: {
        root: backendUrl,
        api: backendUrl + '/odata'
      },

      // Log service settings.
      log: {
        // Flag: indicates whether log service is enabled or not.
        enabled: true,

        // Flag: indicates whether to store error messages or not.
        storeErrorMessages: true,

        storeWarnMessages: true,
        storeLogMessages: false,
        storeInfoMessages: true,
        storeDebugMessages: true,
        storeDeprecationMessages: true,
        storePromiseErrors: true,
        showPromiseErrors: true,
        errorMessageFilterActive: true,
      },

      perf: {
        enabled: false,
      },

      // Settings lock.
      lock: {
        enabled: true,
        openReadOnly: true,
        unlockObject: true,
      },

      // Flag: indicates whether to use user settings service or not.
      useUserSettingsService: true,

      // Flag: indicates whether to use adv limit service or not.
      useAdvLimitService: true,

      // Custom property with components settings.
      components: {
        // Settings for flexberry-file component.
        flexberryFile: {
          // URL of file upload controller.
          uploadUrl: backendUrl + '/api/File',

          // Max file size in bytes for uploading files.
          maxUploadFileSize: null,

          // Flag: indicates whether to upload file on controllers modelPreSave event.
          uploadOnModelPreSave: true,

          // Flag: indicates whether to show upload button or not.
          showUploadButton: true,

          // Flag: indicates whether to show modal dialog on upload errors or not.
          showModalDialogOnUploadError: true,

          // Flag: indicates whether to show modal dialog on download errors or not.
          showModalDialogOnDownloadError: true,
        },

        // For guideline theme
        // Settings for flexberry-objectlistview component.
        flexberryObjectlistview: {
          // Flag indicates whether to side page or usually mode.
          useSidePageMode: false,
        },

        // Settings for flexberry-lookup component.
        flexberryLookup: {
          // Flag: indicates whether to side page or usually mode.
          useSidePageMode: false,
        },

        flexberryGroupedit: {
          // Flag: indicates whether to side page or usually mode.
          useSidePageMode: false,

          // Flag: indicates whether to show asterisk icon in first column of every changed row.
          showAsteriskInRow: true,
        },

        flexberrySimpledatetime: {
          // The selector to get the element (using `jQuery`) for the `appendTo` flatpickr option, see https://flatpickr.js.org/options/.
          calendarContext: undefined
        }
      },
    }
  };

  // Read more about CSP:
  // http://www.ember-cli.com/#content-security-policy
  // https://github.com/rwjblue/ember-cli-content-security-policy
  // http://content-security-policy.com
  ENV.contentSecurityPolicy = {
    'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
    'font-src': "'self' data: https://fonts.gstatic.com",
    'connect-src': "'self' " + ENV.APP.backendUrls.root
  };

  // Read more about ember-i18n: https://github.com/jamesarosen/ember-i18n.
  ENV.i18n = {
    // Should be defined to avoid ember-i18n deprecations.
    // Locale will be changed then to navigator current locale (in instance initializer).
    defaultLocale: 'ru'
  };

  // Read more about ember-moment: https://github.com/stefanpenner/ember-moment.
  // Locale will be changed then to same as ember-i18n locale (and will be changed every time when i18n locale changes).
  ENV.moment = {
    outputFormat: 'L',
    includeLocales: ['ru']
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
    ENV.locationType = 'none';

    // URL of the backend running in docker.
    backendUrl = 'http://localhost:6500';
    ENV.APP.backendUrl = backendUrl;
    ENV.APP.backendUrls.root = backendUrl;
    ENV.APP.backendUrls.api = backendUrl + '/odata';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {

    // here you can enable a production-specific feature
  }

  // Change paths to application assets if build has been started with the following parameters:
  // ember build --gh-pages --gh-pages-branch=<branch-to-publish-on-gh-pages>.
  if (process.argv.indexOf('--gh-pages') >= 0) {
    var branch;

    // Retrieve branch name from process arguments.
    process.argv.forEach(function (value) {
      if (value.indexOf('--gh-pages-branch=') >= 0) {
        branch = value.split('=')[1];
        return;
      }
    });

    // Change base URL to force paths to application assets be relative.
    ENV.rootURL = '/' + ENV.repositoryName + '/' + branch + '/';
    ENV.locationType = 'hash';
  }

  return ENV;
};
