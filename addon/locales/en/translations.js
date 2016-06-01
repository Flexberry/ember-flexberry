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
      'default-text': '(no value)'
    },

    'flexberry-datepicker': {
      placeholder: '(no value)',

      // Months and days of week names are taken from moment.js.
      'apply-button-text': 'Apply',
      'cancel-button-text': 'Cancel'
    },

    'flexberry-file': {
      placeholder: '(no file)',

      'add-btn-text': 'Add File',
      'remove-btn-text': 'Remove File',
      'upload-btn-text': 'Upload File',
      'download-btn-text': 'Download File',

      'error-dialog-title': 'File component error',
      'error-dialog-content': 'File component error occurred',
      'error-dialog-ok-btn-text': 'OK',

      'add-file-error-title': 'Add file error',
      'file-too-big-message': 'File size must not be greater than {{maxSize}} bytes. Selected file {{fileName}} has size of {{actualSize}} bytes.',

      'upload-file-error-title': 'File upload error',
      'upload-file-error-message': 'Upload {{fileName}} failed. {{errorText}}',

      'download-file-error-title': 'File download error',
      'download-file-error-message': 'Download {{fileName}} failed. {{errorText}}',
      'menu-for-file': {
        'zoom-image-item-title': 'Zoom image',
        'replace-file-item-title': 'Replace file',
        'delete-file-item-title': 'Delete file'
      }
    },

    'flexberry-lookup': {
      placeholder: '(no value)',
      'choose-button-text': 'Choose',
      'remove-button-text': 'Remove'
    },

    'modal-dialog': {
      'ok-button-text': 'OK',
      'close-button-text': 'Close'
    },

    'object-list-view': {
      'no-data-text': 'There is no data',
      'single-column-header-title': 'Model properties',
      'menu-in-row': {
        'edit-menu-item-title': 'Edit record',
        'delete-menu-item-title': 'Delete record'
      }
    },

    'olv-toolbar': {
      'add-button-text': 'Add',
      'refresh-button-text': 'Refresh',
      'delete-button-text': 'Delete',
      'custom-button-text': 'Custom button',
      'filter-by-any-match-placeholder': 'Search...'
    }
  } 
};
