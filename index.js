/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-flexberry',

  included: function(app) {
    this._super.included.apply(this._super, arguments);

    app.import('vendor/polyfills.js', {
      prepend: true
    });

    app.import('vendor/ember-flexberry/register-version.js');

    app.import({
      development: 'bower_components/moment/min/moment-with-locales.js',
      production:  'bower_components/moment/min/moment-with-locales.min.js'
    });

    app.import({
      development: 'bower_components/blueimp-file-upload/js/vendor/jquery.ui.widget.js',
      production:  'bower_components/blueimp-file-upload/js/vendor/jquery.ui.widget.js'
    });

    app.import({
      development: 'bower_components/blueimp-file-upload/js/jquery.iframe-transport.js',
      production:  'bower_components/blueimp-file-upload/js/jquery.iframe-transport.js'
    });

    app.import({
      development: 'bower_components/blueimp-file-upload/js/jquery.fileupload.js',
      production:  'bower_components/blueimp-file-upload/js/jquery.fileupload.js'
    });

    app.import({
      development: 'bower_components/semantic-ui-daterangepicker/daterangepicker.js',
      production:  'bower_components/semantic-ui-daterangepicker/daterangepicker.min.js'
    });

    app.import({
      development: 'bower_components/semantic-ui-daterangepicker/daterangepicker.css',
      production:  'bower_components/semantic-ui-daterangepicker/daterangepicker.min.css'
    });

    app.import({
      development: 'bower_components/flatpickr-calendar/dist/flatpickr.js',
      production:  'bower_components/flatpickr-calendar/dist/flatpickr.min.js'
    });

    app.import({
      development: 'bower_components/semantic-ui/dist/semantic.js',
      production:  'bower_components/semantic-ui/dist/semantic.min.js'
    });

    app.import('bower_components/flatpickr-calendar/dist/flatpickr.min.css');
    app.import('bower_components/flatpickr-calendar/src/l10n/ru.js');

    // Custom devicejs
    app.import('vendor/devicejs/devicejs.js');

    // Custom script which fixes some jQuery 1.10.x+ AJAX bugs with code from newer jQuery.3.0.0-alpha1+compat version.
    app.import('vendor/jquery.3.0.0-alpha1+compat/jquery.ajaxreplacement.js');

    // Script for column resize.
    app.import('vendor/jquery.colResizable/colResizable-1.6.min.js');

    // Script for mask input.
    app.import('vendor/jquery.maskedinput.min/jquery.maskedinput.min.js');

    // JQuery file download plugin with error callbacks support.
    app.import('vendor/jquery.flexberry.downloadFile/jquery.flexberry.downloadFile.js');

    // JQuery plugin for blob data type support in ajax requests.
    app.import('vendor/jquery.blobAjaxTransport/jquery.blobajaxtransport.js');
  }
};
