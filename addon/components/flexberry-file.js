import Ember from 'ember';

/**
 * Flexberry file component.
 */
export default Ember.Component.extend({
  /**
   * Class names for component wrapping <div>.
   */
  classNames: ['file-component', 'ui', 'fluid', 'action', 'input'],

  /**
   * Copy of value created at initialization moment or after successful upload.
   */
  initialValue: null,

  /**
   * Deserialized copy of value created at initialization moment or after successful upload.
   */
  jsonInitialValue: Ember.computed('initialValue', function() {
    var initialValue = this.get('initialValue');
    return Ember.typeOf(initialValue) === 'string' && !Ember.isBlank(initialValue) ? JSON.parse(initialValue) : null;
  }),

  /**
   * Value of file component (contains serialized file metadata such as fileName, fileSize, etc.).
   * It is binded to related model property, so every change to value will automatically change model property.
   */
  value: null,

  /**
   * Deserialized value of file component.
   */
  jsonValue: Ember.computed('value', function() {
    var value = this.get('value');
    return Ember.typeOf(value) === 'string' && !Ember.isBlank(value) ? JSON.parse(value) : null;
  }),

  /**
   * Change value handler.
   */
  valueChange: Ember.observer('value', function() {
    this.sendAction('fileChange', {
      uploadData: this.get('uploadData'),
      value: this.get('value')
    });
  }),

  /**
   * Data from jQuery fileupload plugin (contains selected file).
   */
  uploadData: null,

  /**
   * Current file selected for upload.
   */
  selectedFile: Ember.computed('uploadData', function() {
    var uploadData = this.get('uploadData');
    return uploadData && uploadData.files && uploadData.files.length > 0 ? uploadData.files[0] : null;
  }),

  /**
   * Handles uploadData change.
   */
  uploadDataChange: Ember.observer('uploadData', function() {
    var file = this.get('selectedFile');

    if (!Ember.isNone(file)) {
      var jsonValue = {
        fileName: file.name,
        fileSize: file.size
      };

      this.set('value', JSON.stringify(jsonValue));
    }
  }),

  /**
   * Flag: indicates whether file upload is in progress now.
   */
  uploadIsInProgress: false,

  /**
   * Flag: indicates whether file download is in progress now.
   */
  downloadIsInProgress: false,

  /**
   * Flag: indicates whether file component is readonly.
   * If so, then add, delete, and upload operations will be disabled, only download operation will be accessible.
   */
  readonly: false,

  /**
   * Flag: indicates whether related model property is required.
   */
  required: false,

  /**
   * Flag: indicates whether add button is visible now.
   */
  addButtonIsVisible: Ember.computed('readonly', function() {
    return !this.get('readonly');
  }),

  /**
   * Flag: indicates whether add button is enabled now.
   */
  addButtonIsEnabled: Ember.computed('uploadIsInProgress', 'downloadIsInProgress', function() {
    var uploadIsInProgress = this.get('uploadIsInProgress');
    var downloadIsInProgress = this.get('downloadIsInProgress');
    return !(uploadIsInProgress || downloadIsInProgress);
  }),

  /**
   * Add button title (will be shown on mouse hover).
   */
  addButtonTitle: null,

  /**
   * Flag: indicates whether remove button is visible now.
   */
  removeButtonIsVisible: Ember.computed('readonly', function() {
    return !this.get('readonly');
  }),

  /**
   * Flag: indicates whether remove button is enabled now.
   */
  removeButtonIsEnabled: Ember.computed('uploadIsInProgress', 'downloadIsInProgress', 'value', function() {
    var uploadIsInProgress = this.get('uploadIsInProgress');
    var downloadIsInProgress = this.get('downloadIsInProgress');
    var jsonValue = this.get('jsonValue');

    return !(uploadIsInProgress || downloadIsInProgress || Ember.isNone(jsonValue));
  }),

  /**
   * Remove button title (will be shown on mouse hover).
   */
  removeButtonTitle: null,

  // Flag: indicates whether to upload file on controllers 'modelPreSave' event.
  uploadOnModelPreSave: null,

  /**
   * Flag: indicates whether to show upload button or not.
   */
  showUploadButton: null,

  /**
   * Flag: indicates whether upload button is visible now.
   */
  uploadButtonIsVisible: Ember.computed('readonly', 'showUploadButton', function() {
    return !this.get('readonly') && this.get('showUploadButton');
  }),

  /**
   * Flag: indicates whether upload button is enabled now.
   */
  uploadButtonIsEnabled: Ember.computed('uploadIsInProgress', 'downloadIsInProgress', 'uploadData', function() {
    var uploadIsInProgress = this.get('uploadIsInProgress');
    var downloadIsInProgress = this.get('downloadIsInProgress');
    var selectedFile = this.get('selectedFile');

    return !(uploadIsInProgress || downloadIsInProgress || Ember.isNone(selectedFile));
  }),

  /**
   * Upload button title (will be shown on mouse hover).
   */
  uploadButtonTitle: null,

  /**
   * Flag: indicates whether download button is visible now.
   */
  downloadButtonIsVisible: Ember.computed('initialValue', function() {
    // Download button is always visible (but disabled if download is not available).
    return true;
  }),

  /**
   * Flag: indicates whether download button is enabled now.
   */
  downloadButtonIsEnabled: Ember.computed('uploadIsInProgress', 'downloadIsInProgress', 'initialValue', function() {
    var uploadIsInProgress = this.get('uploadIsInProgress');
    var downloadIsInProgress = this.get('downloadIsInProgress');
    var jsonInitialValue = this.get('jsonInitialValue');

    return !(uploadIsInProgress || downloadIsInProgress || Ember.isNone(jsonInitialValue));
  }),

  /**
   * Download button title (will be shown on mouse hover).
   */
  downloadButtonTitle: null,

  /**
   * Maximum file size in bytes for uploading files.
   * It should be greater then 0 and less or equal then APP.components.file.maxUploadFileSize from application config\environment.
   * If null or undefined, then APP.components.file.maxUploadFileSize from application config\environment will be used.
   */
  maxUploadFileSize: null,

  /**
   * Text to be displayed instead of file name, if file has not been selected.
   */
  placeholder: null,

  /**
   * File upload URL.
   * If null or undefined, then APP.components.file.uploadUrl from application config\environment will be used.
   */
  uploadUrl: null,

  /**
   * File download URL.
   * If null or undefined, then APP.components.file.downloadUrl from application config\environment will be used.
   */
  downloadUrl: null,

  /**
   * Flag: indicates whether to show modal dialog on upload errors or not.
   */
  showModalDialogOnUploadError: null,

  /**
   * Flag: indicates whether to show modal dialog on download errors or not.
   */
  showModalDialogOnDownloadError: null,

  /**
   * Title to be displayed in error modal dialog.
   * It will be displayed only if some error occur.
   */
  errorModalDialogTitle: 'File component error',

  /**
   * Content to be displayed in error modal dialog.
   * It will be displayed only if some error occur.
   */
  errorModalDialogContent: 'File component error occurred',

  /**
   * Selected jQuery object, containing HTML of error modal dialog.
   */
  errorModalDialog: null,

  /**
   * File name.
   * It is binded to component file name input, so every change to fileName will automatically change file name input value.
   */
  fileName: Ember.computed('value', function() {
    var jsonValue = this.get('jsonValue');
    if (Ember.isNone(jsonValue)) {
      return null;
    }

    return jsonValue.fileName;
  }),

  /**
   * Initializes file-control component.
   */
  init: function() {
    this._super.apply(this, arguments);

    // Remember initial value.
    var value = this.get('value');
    this.set('initialValue', Ember.copy(value, true));

    // Import application config\environment.
    var applicationConfig = this.container.lookupFactory('config:environment') || {};
    var fileComponentConfig = Ember.get(applicationConfig, 'APP.components.flexberryFile') || {};

    // Properties initialization helper method.
    var initProperty = function(options) {
      var componentPropertyValue = this.get(options.propertyName);
      if (!Ember.isNone(componentPropertyValue)) {
        return;
      }

      // Property is undefined. Set configuration-defined value or default.
      var configurationPropertyValue = Ember.get(fileComponentConfig, options.propertyName);
      var defaultPropertyValue = options.defaultPropertyValue;

      if (!Ember.isNone(configurationPropertyValue)) {
        this.set(options.propertyName, configurationPropertyValue);
      } else {
        this.set(options.propertyName, defaultPropertyValue);
      }
    }.bind(this);

    initProperty({
      propertyName: 'uploadUrl',
      defaultPropertyValue: null
    });
    initProperty({
      propertyName: 'downloadUrl',
      defaultPropertyValue: null
    });
    initProperty({
      propertyName: 'maxUploadFileSize',
      defaultPropertyValue: null
    });
    initProperty({
      propertyName: 'placeholder',
      defaultPropertyValue: '(no file)'
    });
    initProperty({
      propertyName: 'uploadOnModelPreSave',
      defaultPropertyValue: true
    });
    initProperty({
      propertyName: 'showUploadButton',
      defaultPropertyValue: false
    });
    initProperty({
      propertyName: 'showModalDialogOnUploadError',
      defaultPropertyValue: false
    });
    initProperty({
      propertyName: 'showModalDialogOnDownloadError',
      defaultPropertyValue: true
    });
    initProperty({
      propertyName: 'addButtonTitle',
      defaultPropertyValue: 'Add file'
    });
    initProperty({
      propertyName: 'removeButtonTitle',
      defaultPropertyValue: 'Remove file'
    });
    initProperty({
      propertyName: 'uploadButtonTitle',
      defaultPropertyValue: 'Upload file'
    });
    initProperty({
      propertyName: 'downloadButtonTitle',
      defaultPropertyValue: 'Download file'
    });
  },

  /**
   * Initializes file-control component.
   */
  didInsertElement: function() {
    var _this = this;

    var fileInputId = _this.get('elementId') + 'FlexberryFile';
    var fileInput = _this.$('.flexberry-file-file-input');
    fileInput.attr('id', fileInputId);

    var addFileButton = _this.$('.flexberry-file-add-button');
    addFileButton.attr('for', fileInputId);

    var removeFileButton = _this.$('.flexberry-file-remove-button');
    removeFileButton.on('click', function() {
      _this.removeFile.call(_this, null);
    });

    var uploadFileButton = _this.$('.flexberry-file-upload-button');
    uploadFileButton.on('click', function() {
      _this.uploadFile.call(_this, null);
    });

    var downloadFileButton = _this.$('.flexberry-file-download-button');
    downloadFileButton.on('click', function() {
      _this.downloadFile.call(_this, null);
    });

    // Initialize SemanticUI modal dialog, and remember it in a component property,
    // because after call to errorModalDialog.modal its html will disappear from DOM.
    var errorModalDialog = _this.$('.flexberry-file-error-modal-dialog');
    errorModalDialog.modal('setting', 'closable', false);
    this.set('errorModalDialog', errorModalDialog);

    // jQuery fileupload 'add' callback.
    var onFileAdd = function(e, uploadData) {
      var selectedFile = uploadData && uploadData.files && uploadData.files.length > 0 ? uploadData.files[0] : null;
      var maxUploadFileSize = _this.get('maxUploadFileSize');

      // Prevent files greater then maxUploadFileSize.
      if (!Ember.isNone(maxUploadFileSize) && selectedFile.size > maxUploadFileSize) {
        var errorTitle = 'Add file error';
        var errorContent = 'File size must not be greater then ' + maxUploadFileSize + ' bytes. ' +
          ' Selected file \'' + selectedFile.name + '\' has size of ' + selectedFile.size + ' bytes.';
        _this.showErrorModalDialog.call(_this, errorTitle, errorContent);

        return;
      }

      _this.set('uploadData', uploadData);
    };

    // Initialize jQuery fileupload plugin (https://github.com/blueimp/jQuery-File-Upload/wiki/API).
    fileInput.fileupload({
      // Disable autoUpload.
      autoUpload: false,

      // Type of data that is expected back from the server.
      dataType: 'json',

      // Maximum number of files to be selected and uploaded.
      maxNumberOfFiles: 1,

      // Enable single file uploads.
      singleFileUploads: true,

      // Disable drag&drop file adding.
      dropZone: null,

      // A string containing the URL to which the upload request should be sent.
      url: _this.get('uploadUrl'),

      // File add handler.
      add: onFileAdd
    });

    var targetObject = this.get('targetObject');
    if (!Ember.isNone(targetObject) && targetObject instanceof Ember.Controller)  {
      _this.set('currentController', targetObject);
    }

    // Subscribe on controller's 'modelPreSave'event.
    _this.subscribeOnModelPreSaveEvent();
  },

  /**
   * Destroys file-control component.
   */
  willDestroyElement: function() {
    // Unsubscribe from controller's 'modelPreSave'event.
    this.unsubscribeFromModelPresaveEvent();

    var fileInput = this.$('.flexberry-file-file-input');
    fileInput.fileupload('destroy');
  },

  /**
   * Method to remove selected file.
   */
  removeFile: function() {
    this.set('uploadData', null);
    this.set('value', null);
  },

  /**
   * Method to upload selected file.
   */
  uploadFile: function() {
    var file = this.get('selectedFile');
    if (Ember.isNone(file)) {
      return null;
    }

    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      _this.set('uploadIsInProgress', true);

      var uploadData = _this.get('uploadData');

      // Additional data.
      var initialValue = _this.get('initialValue');
      if (!Ember.isNone(initialValue)) {
        uploadData.formData = {
          // Metadata about previously uploaded file.
          previousFileDescription: _this.get('initialValue')
        };
      }

      uploadData.submit().done(function(result, textStatus, jqXhr) {
        var value = jqXhr.responseText;

        _this.set('value', value);
        _this.set('initialValue', Ember.copy(value, true));
        _this.set('uploadData', null);

        _this.sendAction('uploadSuccess', {
          uploadData: uploadData,
          response: jqXhr,
          value: value
        });
        resolve(_this.get('jsonValue'));
      }).fail(function(jqXhr, textStatus, errorThrown) {
        var fileName = ' \'' + file.name + '\'';
        var errorText = errorThrown ? ' (' + errorThrown + ')' : '';
        var errorTitle = 'File upload error';
        var errorContent = 'Upload' + fileName + ' failed' + errorText + '.';

        var showModalDialogOnUploadError = _this.get('showModalDialogOnUploadError');
        if (showModalDialogOnUploadError) {
          _this.showErrorModalDialog.call(_this, errorTitle, errorContent);
        }

        _this.sendAction('uploadFail', {
          uploadData: uploadData,
          response: jqXhr,
          value: _this.get('value')
        });
        reject(new Error(errorContent));
      }).always(function() {
        _this.set('uploadIsInProgress', false);
      });
    });
  },

  /**
   * Method to download uploaded file.
   */
  downloadFile: function() {
    var jsonInitialValue = this.get('jsonInitialValue');
    if (Ember.isNone(jsonInitialValue)) {
      return null;
    }

    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      _this.set('downloadIsInProgress', true);

      // Use jQuery fileDownload plugin (https://github.com/johnculviner/jquery.fileDownload).
      // Warning! It uses iframe to send file download request, so there is no way to set request authorization header.
      Ember.$.fileDownload(_this.get('downloadUrl') + '?' + Ember.$.param(jsonInitialValue), {
        successCallback: function(url) {
          _this.sendAction('downloadSuccess', {
            downloadData: jsonInitialValue,
            response: 'success',
            value: _this.get('value')
          });
          resolve(jsonInitialValue);
          _this.set('downloadIsInProgress', false);
        },
        failCallback: function(errorText, url) {
          var fileName = ' \'' + jsonInitialValue.fileName + '\'';
          var errorTitle = 'File download error';
          var errorContent = 'Download' + fileName + ' failed. ' + errorText;

          var showModalDialogOnDownloadError = _this.get('showModalDialogOnDownloadError');
          if (showModalDialogOnDownloadError) {
            _this.showErrorModalDialog.call(_this, errorTitle, errorContent);
          }

          _this.sendAction('downloadFail', {
            downloadData: jsonInitialValue,
            response: errorText,
            value: _this.get('value')
          });
          reject(new Error(errorText));
          _this.set('downloadIsInProgress', false);
        }
      });
    });
  },

  /**
   * Method to show error modal dialog.
   * @param {String} errorTitle Error title (window header).
   * @param {String} errorContent Error content (error description).
   */
  showErrorModalDialog: function(errorTitle, errorContent) {
    var errorModalDialog = this.get('errorModalDialog');
    if (errorModalDialog && errorModalDialog.modal) {
      this.set('errorModalDialogTitle', errorTitle);
      this.set('errorModalDialogContent', errorContent);
      errorModalDialog.modal('show');
    }
  },

  /**
   * Current controller.
   */
  currentController: null,

  /**
   * Controllers 'modelPreSave' event handler.
   */
  onModelPresave: null,

  /**
   * Method to subscribe on controller's 'modelPreSave' event.
   */
  subscribeOnModelPreSaveEvent: function() {
    var uploadOnModelPreSave = this.get('uploadOnModelPreSave');
    var currentController = this.get('currentController');
    if (!uploadOnModelPreSave || Ember.isNone(currentController) || Ember.isNone(currentController.on)) {
      return;
    }

    // If upload 'modelPreSave' is allowed, call uploadFile method on controllers 'modelPreSave' event,
    // and return upload RSVP.Promise to controller.
    var onModelPreSave = function(e) {
      var uploadFilePromise = this.uploadFile();

      if (!Ember.isNone(uploadFilePromise) && !Ember.isNone(e) && Ember.isArray(e.promises)) {
        e.promises.push(uploadFilePromise);
      }
    }.bind(this);

    currentController.on('modelPreSave', onModelPreSave);
    this.set('onModelPresave', onModelPreSave);
  },

  /**
   * Method to unsubscribe from controller's 'modelPreSave' event.
   */
  unsubscribeFromModelPresaveEvent: function() {
    var currentController = this.get('currentController');
    var onModelPresave = this.get('onModelPresave');
    if (Ember.isNone(currentController) || Ember.isNone(currentController.off) || Ember.isNone(onModelPresave)) {
      return;
    }

    currentController.off('modelPreSave', onModelPresave);
  }
});
