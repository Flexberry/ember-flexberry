/*!
 * jQuery v.1.10.x and higher has "permission denied" problems with AJAX "PATCH"-requests in IE.
 * Those problems where solved in jQuery3.0.0-alpha1+compat.
 * But some application components has conflicts with newer jQuery version.
 * So for a while we need to use jQuery version related to ember-cli (1.11.x),
 * but replace its AJAX-facilities with newer jQuery3.0.0-alpha1+compat version.
 */
(function() {
    // Remember reference to newer jQuery3.0.0-alpha1+compat version,
    // and restore $ as global reference to version 1.11.x.
    var jQuery3 = $.noConflict();
    jQuery3.ajax.version = '3.0.0-alpha1+compat';

    // Replace jQuery 1.11.x AJAX facilities with newer jQuery3.0.0-alpha1+compat version.
    $.ajax = jQuery3.ajax;
    $.ajaxPrefilter = jQuery3.ajaxPrefilter;
    $.ajaxSetup = jQuery3.ajaxSetup;
  }
)();
