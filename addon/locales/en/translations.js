export default {
  'forms': {
    'edit-form': {
      'saved-message': 'Saved.',
      'save-failed-message': 'Save failed.',
      'delete-failed-message': 'Delete failed',

      'save-button-text': 'Save',
      'saveAndClose-button-text': 'Save and close',
      'delete-button-text': 'Delete',
      'close-button-text': 'Close'
    },

    'i-i-s-caseberry-logging-objects-application-log-l': {
      caption: 'Application log'
    },

    'new-platform-flexberry-services-lock-list': {
      caption: 'Block list',
    }
  },

  'components': {
    'flexberry-field': {
      placeholder: '(no value)'
    },

    'flexberry-textbox': {
      placeholder: '(no value)'
    },

    'flexberry-textarea': {
      placeholder: '(no value)'
    },

    'flexberry-dropdown': {
      'placeholder': '(no value)'
    },

    'flexberry-datepicker': {
      placeholder: '(no value)',

      // Months and days of week names are taken from moment.js.
      'apply-button-text': 'Apply',
      'cancel-button-text': 'Cancel'
    },

    'flexberry-file': {
      placeholder: '(no file)',

      'add-button-title': 'Add File',
      'add-button-caption': 'Add File',
      'remove-button-title': 'Remove File',
      'upload-button-title': 'Upload File',
      'download-button-title': 'Download File',

      'preview-image-alternative-text': 'Loaded image',

      'error-dialog-caption': 'File component error',
      'error-dialog-content': 'File component error occurred',
      'error-dialog-ok-button-caption': 'OK',

      'add-file-error-caption': 'Add file error',
      'file-too-big-error-message': 'File size must not be greater than {{maxFileSize}} bytes. ' +
        'Selected file \'{{fileName}}\' has size of {{actualFileSize}} bytes.',

      'upload-file-error-caption': 'File upload error',
      'upload-file-error-message': 'Upload of \'{{fileName}}\' failed. {{errorMessage}}',

      'download-file-error-caption': 'File download error',
      'download-file-error-message': 'Download of \'{{fileName}}\' failed. {{errorMessage}}',
      'menu-for-file': {
        'zoom-image-item-caption': 'Zoom image',
        'replace-file-item-caption': 'Replace file',
        'delete-file-item-caption': 'Delete file'
      }
    },

    'flexberry-lookup': {
      'placeholder': '(no value)',
      'choose-button-text': 'Choose',
      'remove-button-text': 'Remove',
      'dropdown': {
        'messages': {
          'noResults': 'No results found.'
        }
      }
    },

    'flexberry-objectlistview': {
      'placeholder': 'There is no data',
      'showing-entries': {
        'showing': 'Showing ',
        'of': ' of ',
        'entries': ' entries'
      }
    },

    'flexberry-groupedit': {
      'placeholder': 'There is no data'
    },

    'modal-dialog': {
      'ok-button-text': 'OK',
      'close-button-text': 'Close'
    },

    'object-list-view': {
      'placeholder': 'There is no data',
      'loading-text': 'Loading data...',
      'header-title-attr': 'Click to change ordering, Ctrl+Click to append ordering for this column',
      'single-column-header-title': 'Model properties',
      'sort-ascending': 'Order ascending',
      'sort-descending': 'Order descending',
      'menu-in-row': {
        'edit-menu-item-title': 'Edit record',
        'delete-menu-item-title': 'Delete record'
      }
    },

    'object-list-view-cell': {
      'boolean-false-caption': 'False',
      'boolean-true-caption': 'True'
    },

    'olv-toolbar': {
      'add-button-text': 'Add',
      'refresh-button-text': 'Refresh',
      'delete-button-text': 'Delete',
      'custom-button-text': 'Custom button',
      'filter-by-any-match-placeholder': 'Search...',
      'create-setting-title': 'New setting',
      'use-setting-title': 'Use',
      'edit-setting-title': 'Edit',
      'remove-setting-title': 'Remove',
      'set-default-setting-title': 'Default setting',
      'show-default-setting-title': 'Show settings',
      'show-setting-caption': 'To set this settings by default you can copy and init property developerUserSettings in /app/routes/',
      'close': 'Close',
      'copy': 'Copy',
      'copied': 'Copied',
      'ctrlc': 'Press Ctrl/C to copy'
    },

    'colsconfig-dialog-content': {
      'title': 'Customize the display of colums',
      'dont-show-columns': 'Do not display columns',
      'columns-order': 'Specify the order of the columns',
      'column-name': 'Column name',
      'sort-direction': 'Sorting direction',
      'sort-priority': 'Priority column sorting',
      'column-width': 'Column width',
      'save-colwidths': 'Save columns width',
      'setting-name': 'Setting name',
      'enter-setting-name': 'Enter setting name',
      'use': 'Use',
      'use-without-save': 'Use this settings without saving in setting ',
      'save': 'Save',
      'have-errors': 'When you save a configuration errors occurred: ',
      'setting': 'Setting ',
      'is-saved': ' is saved',
      'col-width-on': 'Enable setting column widths',
      'per-page': 'Records count on page',
      'unresizable': 'Unresizable columns',
      'unresizable-row-toolbar': 'Unresizable row-toolbar column',
      'unresizable-row-menu': 'Unresizable row-menu column'
    },

    'form-load-time-tracker': {
      'load-time': 'Load time',
      'render-time': 'Render time',
    },

  },

  'models': {
    'i-i-s-caseberry-logging-objects-application-log': {
      'projections': {
        'ApplicationLogL': {
          'processId': {
            'caption': 'URL'
          },
          'timestamp':{
            'caption': 'Time'
          },
          'category':{
            'caption': 'Category'
          },
          'eventId':{
            'caption': 'Event ID'
          },
          'priority':{
            'caption': 'Priority'
          },
          'severity':{
            'caption': 'Severity'
          },
          'title':{
            'caption': 'Title'
          },
          'machineName':{
            'caption': 'Server'
          },
          'appDomainName':{
            'caption': 'Browser'
          },
          'processName':{
            'caption': 'Process name'
          },
          'threadName':{
            'caption': 'ThreadName'
          },
          'win32ThreadId':{
            'caption': 'Win32ThreadId',
          },
          'message':{
            'caption': 'Message'
          },
          'formattedMessage':{
            'caption': 'Formatted message'
          }
        }
      }
    },
    'new-platform-flexberry-services-lock': {
      'projections': {
        'LockL': {
          'lockKey': { 'caption': 'Key locked object' },
          'userName': { 'caption': 'User locked object' },
          'lockDate': { 'caption': 'Date lock' },
        },
      },
    },
  }
};
