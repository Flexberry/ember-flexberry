/**
  jQuery flexberry.downloadFile plugin.
  It uses iframe to download files as attachments, and can call onError callback in case of download error.
  Success callback is not supported because in common case we couldn't check iframe's request success without timeouts.
*/
;(function($, window, undefined) {
  var defaultOptions = {
    url: '',
    iframeContainer: 'body',
    onError: function(errorMessage) {
      console.error(errorMessage);
    }
  };

  var downloadFile = function(options) {
    options = $.extend(true, defaultOptions, options);
    
    var iframeInitialLoadCompleted = false;
    var errorOccurred = false;
    var errorMessage = '';

    // Actions order in cases of success/fail in different browsers.
    // So call of iframe's load callback after iframeInitialLoadCompleted is 100% fail.
    //
    // Chrome:  success - load, iframeInitialLoadCompleted     fail - load, iframeInitialLoadCompleted, load.
    // Opera:   success - load, iframeInitialLoadCompleted     fail - load, iframeInitialLoadCompleted, load.
    // Firefox: success - iframeInitialLoadCompleted           fail - iframeInitialLoadCompleted, load.
    // IE:      success - iframeInitialLoadCompleted           fail - iframeInitialLoadCompleted, load.
    var $iframe = $('<iframe>')
      .hide()
      .on('load', function(e) {
        if (errorOccurred) {
          return;
        }

        try {
          if (iframeInitialLoadCompleted) {
            errorOccurred = true;
          }

          var iframeDocument = e.target.contentWindow ? e.target.contentWindow.document : e.target.contentDocument;
          var $iframeBody = $(iframeDocument.body);
          if ($iframeBody[0] && $iframeBody.prop('innerHTML').length > 0) {
            errorMessage = $iframeBody.prop('innerText');
          }           
        } catch(ex) {
          // The only way to get exception here is when file request has been failed,
          // but application and file domains are different.
          // So it is 100% guarantee that file download failed,
          // but we can't access iframe's document and get actual error message because of same origin policy.
          errorMessage = '';
        } finally {
          if (errorOccurred) {
            errorMessage = 'Request to \'' + options.url + '\' failed.' + (errorMessage ? ' ' + errorMessage : '');
            if (typeof options.onError === 'function') {
              options.onError(errorMessage);
            } else {
              defaultOptions.onError(errorMessage);
            }

            $iframe.remove();
          }
        }
      })
      .appendTo(options.iframeContainer);
    
    $iframe.prop('src', options.url);
    iframeInitialLoadCompleted = true;
  };
  
  // Extend $ namespace with flexberry.downloadFile.
  downloadFile.defaultOptions = defaultOptions;
  $.extend(true, $, {
    flexberry: {
      downloadFile: downloadFile
    }
  });
})(jQuery, this);
