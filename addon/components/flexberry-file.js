/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';

/**
 * Flexberry file component.
 *
 * @class FlexberryFile
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  /**
   * Selected file content. It can be used as source for image tag in order to view preview.
   *
   * @property _selectedFileSrc
   * @private
   * @type String
   * @default ''
   */
  _selectedFileSrc: '',

  /**
   * Class names for component wrapping <div>.
   */
  classNames: ['flexberry-file'],

  /**
   * Classes for buttons.
   *
   * @property buttonClass
   * @type String
   * @default undefined
   */
  buttonClass: undefined,

  /**
   * Path to component's settings in application configuration (JSON from ./config/environment.js).
   *
   * @property appConfigSettingsPath
   * @type String
   * @default 'APP.components.flexberryBaseComponent'
   */
  appConfigSettingsPath: 'APP.components.flexberryFile',

  /**
   * Name of action. This action will be send outside after click on selected image preview.
   *
   * @property viewImageAction
   * @type String
   * @default 'flexberryFileViewImageAction'
   */
  viewImageAction: 'flexberryFileViewImageAction',

  /**
    File input identifier.

    @property fileInputId
    @type String
   */
  fileInputId: Ember.computed('elementId', function() {
    let fileInputId = 'flexberry-file-file-input-';
    let elementId = this.get('elementId');
    if (Ember.isBlank(elementId)) {
      fileInputId += Ember.uuid();
    } else {
      fileInputId += elementId;
    }

    return fileInputId;
  }),

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
        fileSize: file.size,
        fileMimeType: file.type
      };

      this.set('value', JSON.stringify(jsonValue));
      if (this.get('showPreview')) {
        let _this = this;
        var reader = new FileReader();
        reader.onload = function (e) {
          let selectedFileSrc = e.target.result;
          _this._updateSelectedFileSrc(_this, selectedFileSrc);
        };

        reader.readAsDataURL(file);
      }
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
   * Flag: indicates whether to upload file on 'relatedModel' 'preSave' event.
   */
  uploadOnModelPreSave: undefined,

  /**
   * Flag: indicates whether to show preview element for images or not.
   *
   * @property showPreview
   * @type Boolean
   * @default false
   */
  showPreview: false,

  /**
   * Flag: indicates whether to show upload button or not.
   */
  showUploadButton: undefined,

  /**
   * Flag: indicates whether to show download button or not.
   */
  showDownloadButton: undefined,

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
   * Flag: indicates whether download button is visible now.
   */
  downloadButtonIsVisible: Ember.computed('showDownloadButton', function() {
    // Download button is always visible (but disabled if download is not available).
    return this.get('showDownloadButton');
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
   * Maximum file size in bytes for uploading files.
   * It should be greater then 0 and less or equal then APP.components.file.maxUploadFileSize from application config\environment.
   * If null or undefined, then APP.components.file.maxUploadFileSize from application config\environment will be used.
   */
  maxUploadFileSize: undefined,

  /**
   * Text to be displayed instead of file name, if file has not been selected.
   *
   * @property placeholder
   * @type String
   * @default 't('components.flexberry-file.placeholder')'
   */
  placeholder: t('components.flexberry-file.placeholder'),

  /**
   * File upload URL.
   * If null or undefined, then APP.components.file.uploadUrl from application config\environment will be used.
   */
  uploadUrl: undefined,

  /**
   * Flag: indicates whether to show modal dialog on upload errors or not.
   */
  showModalDialogOnUploadError: undefined,

  /**
   * Flag: indicates whether to show modal dialog on download errors or not.
   */
  showModalDialogOnDownloadError: undefined,

  /**
   * Caption to be displayed in error modal dialog.
   * It will be displayed only if some error occur.
   *
   * @property errorModalDialogCaption
   * @type String
   * @default 't('components.flexberry-file.error-dialog-caption')'
   */
  errorModalDialogCaption: t('components.flexberry-file.error-dialog-caption'),

  /**
   * Content to be displayed in error modal dialog.
   * It will be displayed only if some error occur.
   *
   * @property errorModalDialogContent
   * @type String
   * @default 't('components.flexberry-file.error-dialog-content')'
   */
  errorModalDialogContent: t('components.flexberry-file.error-dialog-content'),

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

  actions: {
    /**
      Handles click on selected image preview and sends action with data outside component
      in order to view selected image at modal window.

      @method actions.viewLoadedImage
      @public
     */
    viewLoadedImage() {
      var fileName = this.get('fileName');
      var selectedFileSrc = this.get('_selectedFileSrc');
      if (!Ember.isNone(fileName) && !Ember.isNone(selectedFileSrc)) {
        this.sendAction('viewImageAction', {
          fileSrc: selectedFileSrc,
          fileName: fileName
        });
      }
    },

    /**
      Handles click on add button.

      @method actions.addButtonClick
      @public
     */
    addButtonClick() {

    },

    /**
      Handles click on remove button.

      @method actions.removeButtonClick
      @public
     */
    removeButtonClick() {
      this.removeFile();
    },

    /**
      Handles click on upload button.

      @method actions.uploadButtonClick
      @public
     */
    uploadButtonClick() {
      this.uploadFile();
    },

    /**
      Handles click on download button.

      @method actions.downloadButtonClick
      @public
     */
    downloadButtonClick() {
      this.downloadFile();
    },
  },

  /**
   * Initializes file-control component.
   */
  init: function() {
    this._super(...arguments);

    // Remember initial value.
    var value = this.get('value');
    this.set('initialValue', Ember.copy(value, true));

    // Initialize properties which defaults could be defined in application configuration.
    this.initProperty({ propertyName: 'uploadUrl', defaultValue: null });
    this.initProperty({ propertyName: 'maxUploadFileSize', defaultValue: null });
    this.initProperty({ propertyName: 'uploadOnModelPreSave', defaultValue: true });
    this.initProperty({ propertyName: 'showUploadButton', defaultValue: false });
    this.initProperty({ propertyName: 'showDownloadButton', defaultValue: true });
    this.initProperty({ propertyName: 'showModalDialogOnUploadError', defaultValue: false });
    this.initProperty({ propertyName: 'showModalDialogOnDownloadError', defaultValue: true });

    // Bind related model's 'preSave' event handler's context & subscribe on related model's 'preSave'event.
    this.set('_onRelatedModelPreSave', this.get('_onRelatedModelPreSave').bind(this));
    this._subscribeOnRelatedModelPreSaveEvent();

    var previewUrl = this.get('jsonInitialValue.previewUrl');
    if (!Ember.isBlank(previewUrl) && this.get('showPreview')) {
      // Download file preview.
      this.set('downloadIsInProgress', true);

      Ember.$.ajax(previewUrl).done((data, textStatus, jqXHR) => {
        this._updateSelectedFileSrc(this, data);
      }).fail((jqXHR, textStatus, errorThrown) => {
        this._showModalDialogOnDownloadErrorFunction(this, errorThrown);
      }).always(() => {
        this.set('downloadIsInProgress', false);
      });
    }
  },

  /**
   * Initializes file-control component.
   */
  didInsertElement: function() {
    this._super(...arguments);

    var _this = this;
    var i18n = _this.get('i18n');

    /*var removeFileButton = _this.$('.flexberry-file-remove-button');
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
    });*/

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
        var errorCaption = i18n.t('components.flexberry-file.add-file-error-caption');
        var errorContent = i18n.t(
          'components.flexberry-file.file-too-big-message',
          {
            fileName: selectedFile.name,
            maxSize: maxUploadFileSize,
            actualSize: selectedFile.size });
        _this.showErrorModalDialog.call(_this, errorCaption, errorContent);

        return;
      }

      _this.set('uploadData', uploadData);
    };

    // Initialize jQuery fileupload plugin (https://github.com/blueimp/jQuery-File-Upload/wiki/API).
    _this.$('.flexberry-file-file-input').fileupload({
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
  },

  /**
   * Destroys file-control component.
   */
  willDestroyElement: function() {
    this._super(...arguments);

    var fileInput = this.$('.flexberry-file-file-input');
    fileInput.fileupload('destroy');

    // Unsubscribe from related model's 'preSave'event.
    this._unsubscribeFromRelatedModelPresaveEvent();
  },

  /**
   * Method to remove selected file.
   */
  removeFile: function() {
    this.set('uploadData', null);
    this.set('value', null);
    this._updateSelectedFileSrc(this, '');
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
    var i18n = _this.get('i18n');

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
        var errorMessage = errorThrown ? ' (' + errorThrown + ')' : '';
        var errorCaption = i18n.t('components.flexberry-file.upload-file-error-caption');
        var errorContent = i18n.t('components.flexberry-file.upload-file-error-message', {
          fileName: fileName,
          errorMessage: errorMessage
        });

        var showModalDialogOnUploadError = _this.get('showModalDialogOnUploadError');
        if (showModalDialogOnUploadError) {
          _this.showErrorModalDialog.call(_this, errorCaption, errorContent);
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
    var fileUrl = this.get('jsonInitialValue.fileUrl');
    if (Ember.isBlank(fileUrl)) {
      return null;
    }

    return new Ember.RSVP.Promise((resolve, reject) => {
      this.set('downloadIsInProgress', true);

      // Use jQuery fileDownload plugin (https://github.com/johnculviner/jquery.fileDownload).
      // Warning! It uses iframe to send file download request, so there is no way to set request authorization header.
      Ember.$.fileDownload(fileUrl, {
        successCallback: (url) => {
          this.sendAction('downloadSuccess', {
            downloadData: jsonInitialValue,
            response: 'success',
            value: this.get('value')
          });
          resolve(jsonInitialValue);
          this.set('downloadIsInProgress', false);
        },
        failCallback: (errorMessage, url) => {
          this._showModalDialogOnDownloadErrorFunction(this, errorMessage);
          this.sendAction('downloadFail', {
            downloadData: jsonInitialValue,
            response: errorMessage,
            value: this.get('value')
          });
          reject(new Error(errorMessage));
          this.set('downloadIsInProgress', false);
        }
      });
    });
  },

  /**
   * Method to show error modal dialog.
   * @param {String} errorCaption Error caption (window header caption).
   * @param {String} errorContent Error content (error description).
   */
  showErrorModalDialog: function(errorCaption, errorContent) {
    var errorModalDialog = this.get('errorModalDialog');
    if (errorModalDialog && errorModalDialog.modal) {
      this.set('errorModalDialogCaption', errorCaption);
      this.set('errorModalDialogContent', errorContent);
      errorModalDialog.modal('show');
    }
  },

  /**
   * Related model's 'preSave' event handler.
   */
  _onRelatedModelPreSave: function(e) {
    // Remove uploaded file from server, if related model is deleted, otherwise upload selected file to server.
    var fileOperationPromise = this.get('relatedModel.isDeleted') ? null : this.uploadFile();

    // Push file operation promise to events object's 'promises' array
    // (to keep model waiting until operation will be finished).
    if (!Ember.isNone(fileOperationPromise) && !Ember.isNone(e) && Ember.isArray(e.promises)) {
      e.promises.push(fileOperationPromise);
    }
  },

  /**
   * Method to subscribe on related model's 'preSave' event.
   */
  _subscribeOnRelatedModelPreSaveEvent: function() {
    var uploadOnModelPreSave = this.get('uploadOnModelPreSave');
    if (!uploadOnModelPreSave) {
      return;
    }

    var relatedModelOnPropertyType = Ember.typeOf(this.get('relatedModel.on'));
    if (relatedModelOnPropertyType !== 'function') {
      Ember.Logger.error(`Wrong type of \`relatedModel.on\` propery: actual type is ${relatedModelOnPropertyType}, but function is expected.`);
    }

    var relatedModel = this.get('relatedModel');
    relatedModel.on('preSave', this.get('_onRelatedModelPreSave'));
  },

  /**
   * Method to unsubscribe from related model's 'preSave' event.
   */
  _unsubscribeFromRelatedModelPresaveEvent: function() {
    var relatedModelOffPropertyType = Ember.typeOf(this.get('relatedModel.off'));
    if (relatedModelOffPropertyType !== 'function') {
      Ember.Logger.error(`Wrong type of \`relatedModel.off\` propery: actual type is ${relatedModelOffPropertyType}, but function is expected.`);
    }

    var relatedModel = this.get('relatedModel');
    relatedModel.off('preSave', this.get('_onRelatedModelPreSave'));
  },

  /**
    * This method shows error when there was an error during file download.
    *
    * @method _showModalDialogOnDownloadErrorFunction
    * @private
    *
    * @param {DS.Component} currentContext Current execution context.
    * @param {String} errorMessage Error message about error occured during file download.
    */
  _showModalDialogOnDownloadErrorFunction: function(currentContext, errorMessage) {
    var showModalDialogOnDownloadError = currentContext.get('showModalDialogOnDownloadError');
    if (showModalDialogOnDownloadError) {
      var i18n = currentContext.get('i18n');
      var jsonInitialValue = currentContext.get('jsonInitialValue');
      var fileName = ' \'' + jsonInitialValue.fileName + '\'';
      var errorCaption = i18n.t('components.flexberry-file.download-file-error-caption');
      var errorContent = i18n.t('components.flexberry-file.download-file-error-message', {
        fileName: fileName,
        errorMessage: errorMessage
      });
      currentContext.showErrorModalDialog.call(currentContext, errorCaption, errorContent);
    }
  },

  /**
   * It sets selected file content as source for image tag in order to view preview.
   *
   * @method _updateSelectedFileSrc
   * @private
   *
   * @param {DS.Component} currentContext Current context to execute operations.
   * @param {String} selectedFileSrc Selected file content to set as source for image tag in order to view preview.
   */
  _updateSelectedFileSrc: function(currentContext, selectedFileSrc) {
    currentContext.$('.flexberry-file-image-preview').attr('src', selectedFileSrc);
    currentContext.set('_selectedFileSrc', selectedFileSrc);
  }
});
