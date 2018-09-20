/**
  jQuery flexberry.downloadFile plugin.
*/
;(function($, window, undefined) {
  var defaultOptions = {
    url: '',
    onError: function(errorMessage) {
      console.error(errorMessage);
    }
  };

  var downloadFile = function(options) {
    options = $.extend(true, defaultOptions, options);

    $.ajax({
      // For IE encodeURI is necessary.
      // Without encodeURI IE will return 404 for files with cyrillic names in URL.
      url: encodeURI(options.url),
      type: 'GET',
      headers: options.headers,
      processData: false,
      xhr: () => {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        return xhr;
      },
      success: function(result) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(result);
        a.download = options.filename;
        document.body.appendChild(a);

        if (typeof options.onSuccess === 'function') {
          options.onSuccess();
        }

        a.click();
        document.body.removeChild(a);
      },
      error: function(error) {
        if (typeof options.onError === 'function') {
          options.onError(error);
        } else {
          defaultOptions.onError(error);
        }
      }
    });
  };

  // Extend $ namespace with flexberry.downloadFile.
  downloadFile.defaultOptions = defaultOptions;
  $.extend(true, $, {
    flexberry: {
      downloadFile: downloadFile
    }
  });
})(jQuery, this);
