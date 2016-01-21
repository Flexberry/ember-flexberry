/* jshint node: true */

module.exports = function(environment) {
  var backendRootUrl = 'https://northwindodata.azurewebsites.net';
  var ENV = {
    modulePrefix: 'dummy',
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
      // when it is created

      // It's a custom property, used to prevent duplicate backend urls in sources.
      backendUrls: {
        root: backendRootUrl,
        api: backendRootUrl + '/odata',
        authToken: backendRootUrl + '/Token'
      },

      // Custom property with components settings.
      components: {
        // Settings for flexberry-file component.
        flexberryFile: {
          // URL of file upload controller.
          uploadUrl: backendRootUrl + '/api/File',

          // URL of file download controller.
          downloadUrl: backendRootUrl + '/api/File',

          // Max file size in bytes for uploading files.
          maxUploadFileSize: null,

          // Text to be displayed instead of file name, if file has not been selected.
          placeholder: '(no file)',

          // Flag: indicates whether to upload file on controllers modelPreSave event.
          uploadOnModelPreSave: true,

          // Flag: indicates whether to show upload button or not.
          showUploadButton: true,

          // Flag: indicates whether to show modal dialog on upload errors or not.
          showModalDialogOnUploadError: true,

          // Flag: indicates whether to show modal dialog on download errors or not.
          showModalDialogOnDownloadError: true,

          // Add button title.
          addButtonTitle: 'Add file',

          // Remove button title.
          removeButtonTitle: 'Remove file',

          // Upload button title.
          uploadButtonTitle: 'Upload file',

          // Download button title.
          downloadButtonTitle: 'Download file'
        }
      }
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

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  /*if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }*/

  /*if (environment === 'production') {
  }*/

  return ENV;
};
