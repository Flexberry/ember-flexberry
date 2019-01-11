/**
  jQuery flexberry.downloadFile plugin.
*/
;(function($, window, undefined) {
  var defaultOptions = {
    url: '',
    headers: {},
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
      xhrFields: {
        responseType: 'blob'
      },
      success: function(result) {
        var anchorProperties = {
          href: URL.createObjectURL(result),
          hidden: true
        };

        if (!options.openFileInNewWindowInsteadOfLoading)
        {
          anchorProperties.download = options.fileName;
        } else {
          anchorProperties.target = '_blank';
        }

        var $anchor = $('<a/>', anchorProperties);

        if (window.navigator.msSaveOrOpenBlob) {
          var downloadFunction = function() {
            window.navigator.msSaveOrOpenBlob(result, options.fileName);
          };

          $anchor.on('click', downloadFunction);
          $anchor.click();
          $anchor.off('click', downloadFunction);
        } else {
          $('body').append($anchor);

          $anchor.get(0).click();
        }

        $anchor.remove();
        if (typeof options.onSuccess === 'function') {
          options.onSuccess();
        }
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
