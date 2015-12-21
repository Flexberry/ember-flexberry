/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-flexberry',

  included: function(app) {
    this._super.included.apply(this._super, arguments);

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
      development: 'bower_components/jquery-file-download/src/Scripts/jquery.fileDownload.js',
      production:  'bower_components/jquery-file-download/src/Scripts/jquery.fileDownload.js'
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
      development: 'bower_components/datatables/media/js/jquery.dataTables.js',
      production:  'bower_components/datatables/media/js/jquery.dataTables.min.js'
    });

    app.import({
      development: 'bower_components/datatables/media/css/jquery.dataTables.css',
      production:  'bower_components/datatables/media/css/jquery.dataTables.min.css'
    });

    app.import('bower_components/datatables/media/images/sort_asc_disabled.png', {
      destDir: 'images'
    });
    app.import('bower_components/datatables/media/images/sort_asc.png', {
      destDir: 'images'
    });
    app.import('bower_components/datatables/media/images/sort_both.png', {
      destDir: 'images'
    });
    app.import('bower_components/datatables/media/images/sort_desc_disabled.png', {
      destDir: 'images'
    });
    app.import('bower_components/datatables/media/images/sort_desc.png', {
      destDir: 'images'
    });

    // Custom script which fixes some jQuery 1.10.x+ AJAX bugs with code from newer jQuery.3.0.0-alpha1+compat version.
    app.import('vendor/jquery.3.0.0-alpha1+compat/jquery.ajaxreplacement.js');
  }
};
