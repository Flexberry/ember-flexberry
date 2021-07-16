export default {
  'forms': {
    'edit-form': {
      'saved-message': 'Saved.',
      'save-failed-message': 'Save failed.',
      'delete-failed-message': 'Delete failed',

      'save-button-text': 'Save',
      'saveAndClose-button-text': 'Save and close',
      'delete-button-text': 'Delete',
      'close-button-text': 'Close',
      'more-button-text': 'More'
    },

    'error-form': {
      caption: 'An error has occurred',
      'show-more': 'Show more',
      retry: 'Retry',
      error: 'Error',
      'ember-data-request': 'Server is not available, check the connection to the server',
      'invalid-sorting-value': 'Invalid sorting parameters value',
    },

    'i-i-s-caseberry-logging-objects-application-log-l': {
      caption: 'Application log'
    },

    'new-platform-flexberry-services-lock-list': {
      caption: 'Block list',
    },

    'loading': {
      caption: 'Loading...',
    }
  },

  'components': {
    'flexberry-simpledatetime': {
      'scroll-caption-text': 'Scroll to increment',
    },

    'flexberry-error': {
      caption: 'An error has occurred',
      'show-more': 'Show more',
      'unknown-error': 'Unknown error occurred',
    },

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

      'preview-image-alternative-text': 'Image viewing isn\'t available',

      'error-dialog-caption': 'File component error',
      'error-dialog-content': 'File component error occurred',
      'error-dialog-ok-button-caption': 'OK',
      'error-preview-caption': 'Preview can not be loaded',
      'error-dialog-size-unit-bt': 'Bytes',
      'error-dialog-size-unit-kb': 'Kilobytes',
      'error-dialog-size-unit-mb': 'Magabytes',
      'error-dialog-size-unit-gb': 'Gigabytes',

      'add-file-error-caption': 'Add file error',
      'file-too-big-error-message': 'File size must not be greater than {{maxFileSize}} {{sizeUnit}}. ' +
        'Selected file \'{{fileName}}\' has size of {{actualFileSize}} {{sizeUnit}}.',

      'file-extension-error-message': 'Selected file \'{{fileName}}\' has unavailable extension.',

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
      'preview-button-text': 'View',
      'dropdown': {
        'messages': {
          'noResultsHeader': 'No results',
          'noResults': 'No results found'
        }
      }
    },
    'flexberry-objectlistview': {
      'placeholder': 'There is no data',
      'showing-entries': {
        'showing': 'Showing ',
        'of': ' of ',
        'entries': ' entries'
      },
      'without-sorting': 'Without sorting',
      'search-page-placeholder': '№ page',
      'search-button-text': 'Go to page'
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
        'add-menu-item-title': 'Add record',
        'edit-menu-item-title': 'Edit record',
        'prototype-menu-item-title': 'Create record by prototype',
        'delete-menu-item-title': 'Delete record'
      },
      'hierarchy-buttons': {
        'plus-button-title': 'Expand',
        'minus-button-title': 'Collapse',
      },
      'filters': {
        'eq': 'Equals',
        'neq': 'Not equal',
        'le': 'Less than',
        'ge': 'Greater than',
        'like': 'Contains',
        'nlike': 'Does not contain',
        'empty': 'Empty',
        'nempty': 'Not empty',
        'between': 'Between',
      },
      'filter-condition': 'Condition',
      'clear-filter-in-column': 'Clear the filter in this column',
    },

    'olv-filter-interval': {
      'from': '(from)',
      'to': '(to)'
    },

    'olv-toolbar': {
      'add-button-text': 'Add',
      'refresh-button-text': 'Refresh',
      'delete-button-text': 'Delete',
      'custom-button-text': 'Custom button',
      'hierarchy-button-text': 'On/off hierarchy',
      'coll-expand-button-text':'Collapse/Expand all hierarchies',
      'filter-button-text': 'Add filter',
      'remove-filter-button-text': 'Reset filter',
      'search-button-text': 'Search',
      'clear-search-button-text': 'Clear search',
      'export-excel-button-text': 'Export to Excel',
      'filter-by-any-match-placeholder': 'Search...',
      'create-setting-title': 'New setting',
      'use-setting-title': 'Use',
      'export-title': 'Unload',
      'edit-setting-title': 'Edit',
      'remove-setting-title': 'Remove',
      'set-default-setting-title': 'Default setting',
      'create-limit-title': 'New limit',
      'use-limit-title': 'Use',
      'edit-limit-title': 'Edit',
      'remove-limit-title': 'Remove',
      'set-default-limit-title': 'Default limit',
      'show-default-setting-title': 'Show settings',
      'show-setting-caption': 'To set this settings by default you can copy and init property developerUserSettings in /app/routes/',
      'close': 'Close',
      'copy': 'Copy',
      'copied': 'Copied',
      'ctrlc': 'Press Ctrl/C to copy',
      'check-all-at-page-button-text': 'Check all entries on the current page',
      'uncheck-all-at-page-button-text': 'Uncheck all entries on the current page',
      'check-all-button-text': 'Check all on all pages',
      'uncheck-all-button-text': 'Uncheck all on all pages',
      'clear-sorting-button-text': 'Set the default sorting',
      'clear-select-button-text': 'Deselect'
    },

    'groupedit-toolbar': {
      'add-button-text': 'Add',
      'delete-button-text': 'Delete',
      'clear-settings-button-text': 'Restore default settings',
      'custom-button-text': 'Custom button',
      'move-up-button-text': 'Move up',
      'move-down-button-text': 'Move down',
    },

    'colsconfig-dialog-content': {
      'title': 'Customize the display of colums',
      'export-modal-dialog-title': 'Customize export in Excel',
      'export-title': 'Export in Excel',
      'dont-show-columns': 'Do not display columns',
      'columns-order': 'Specify the order of the columns',
      'column-name': 'Column name',
      'sort-direction': 'Sorting direction',
      'sort-direction-caption': 'Sorting',
      'sort-priority': 'Priority column sorting',
      'sort-priority-caption': 'Priority',
      'column-width': 'Column width',
      'column-width-caption': 'Width',
      'save-colwidths': 'Save columns width',
      'setting-name': 'Setting name',
      'enter-setting-name': 'Enter setting name',
      'use': 'Use',
      'export': 'Unload',
      'use-without-save': 'Use this settings without saving in setting ',
      'save': 'Save',
      'have-errors': 'When you save a configuration errors occurred: ',
      'setting': 'Setting ',
      'is-saved': ' is saved',
      'col-width-on': 'Enable setting column widths',
      'per-page': 'Records count on page',
      'det-separate-rows': 'List\'s properties in separate rows',
      'det-separate-cols': 'List\'s properties in separate columns',
      'sort-direction-none': 'None',
      'sort-direction-asc': 'Ascending',
      'sort-direction-desc': 'Descending',
    },

    'advlimit-dialog-content': {
      'title': 'Customize limit',
      'limit-name': 'Limit name',
      'enter-limit-name': 'Enter limit name',
      'use': 'Use',
      'save': 'Save',
      'have-errors': 'When you save a limit errors occurred: ',
      'cant-parse': 'Can\'t convert current limit string to predicate',
      'limit': 'Limit ',
      'is-saved': ' was saved',
      'is-deleted': ' was deleted',
      'is-correct': 'Current limit string is correct',
      'check': 'Check'
    },

    'filters-dialog-content': {
      'clear-this-filter': 'Reset this filter',
      'title': 'Configuring record filtering',
      'clear': 'Reset filter',
      'apply': 'Apply'
    },

    'form-load-time-tracker': {
      'load-time': 'Load time',
      'render-time': 'Render time',
    },

    'flexberry-dialog': {
      'approve-button': {
        'caption': 'Ok'
      },
      'deny-button': {
        'caption': 'Cancel'
      }
    },

    'flexberry-jsonarea': {
      'placeholder': '(Enter JSON-string)',
      'parse-error': {
        'caption': 'Error while parsing entered JSON-string'
      }
    },

    'flexberry-tree': {
      'placeholder': 'Tree nodes are not defined'
    }

  },

  'models': {
    'i-i-s-caseberry-logging-objects-application-log': {
      'projections': {
        'ApplicationLogL': {
          'processId': {
            __caption__: 'URL'
          },
          'timestamp':{
            __caption__: 'Time'
          },
          'category':{
            __caption__: 'Category'
          },
          'eventId':{
            __caption__: 'Event ID'
          },
          'priority':{
            __caption__: 'Priority'
          },
          'severity':{
            __caption__: 'Severity'
          },
          'title':{
            __caption__: 'Title'
          },
          'machineName':{
            __caption__: 'Server'
          },
          'appDomainName':{
            __caption__: 'Browser'
          },
          'processName':{
            __caption__: 'Process name'
          },
          'threadName':{
            __caption__: 'ThreadName'
          },
          'win32ThreadId':{
            __caption__: 'Win32ThreadId',
          },
          'message':{
            __caption__: 'Message'
          },
          'formattedMessage':{
            __caption__: 'Formatted message'
          }
        }
      }
    },
    'new-platform-flexberry-services-lock': {
      'projections': {
        'LockL': {
          'lockKey': { __caption__: 'Key locked object' },
          'userName': { __caption__: 'User locked object' },
          'lockDate': { __caption__: 'Date lock' },
        },
      },
    },
  }
};
