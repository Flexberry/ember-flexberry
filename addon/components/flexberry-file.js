/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';

/**
  Flexberry file component.

  @class FlexberryFileComponent
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
    Selected file content. It can be used as source for image tag in order to view preview.

    @property _previewImageAsBase64String
    @private
    @type String
    @default null
  */
  _previewImageAsBase64String: null,

  /**
    Component's wrapping <div> CSS-class names.

    @property classNames
    @type String[]
    @default ['flexberry-file']
  */
  classNames: ['flexberry-file'],

  /**
    Classes for buttons.

    @property buttonClass
    @type String
    @default undefined
  */
  buttonClass: undefined,

  /**
    Path to component's settings in application configuration (JSON from ./config/environment.js).

    @property appConfigSettingsPath
    @type String
    @default 'APP.components.flexberryBaseComponent'
  */
  appConfigSettingsPath: 'APP.components.flexberryFile',

  /**
    Name of action. This action will be send outside after click on selected image preview.

    @property viewImageAction
    @type String
    @default 'flexberryFileViewImageAction'
  */
  viewImageAction: 'flexberryFileViewImageAction',

  /**
    File input identifier.

    @property fileInputId
    @type String
    @readonly
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
    Copy of value created at initialization moment or after successful upload.

    @property initialValue
    @type String
  */
  initialValue: null,

  /**
    Deserialized copy of value created at initialization moment or after successful upload.

    @property jsonInitialValue
    @type Object
    @readonly
  */
  jsonInitialValue: Ember.computed('initialValue', function() {
    let initialValue = this.get('initialValue');
    return Ember.typeOf(initialValue) === 'string' && !Ember.isBlank(initialValue) ? JSON.parse(initialValue) : null;
  }),

  /**
    Value of file component (contains serialized file metadata such as fileName, fileSize, etc.).
    It is binded to related model property, so every change to value will automatically change model property.

    @property value
    @type String
  */
  value: null,

  /**
    Deserialized value of file component.

    @property jsonValue
    @type Object
    @readonly
  */
  jsonValue: Ember.computed('value', function() {
    let value = this.get('value');
    return Ember.typeOf(value) === 'string' && !Ember.isBlank(value) ? JSON.parse(value) : null;
  }),

  /**
    File name.
    It is binded to component file name input, so every change to fileName will automatically change file name input value.

    @property fileName
    @type String
    @readonly
  */
  fileName: Ember.computed('jsonValue.fileName', function() {
    let fileName = this.get('jsonValue.fileName');
    if (Ember.isNone(fileName)) {
      return null;
    }

    return fileName;
  }),

  /**
    Flag: indicates whether some file is added now or not.

    @property hasFile
    @type Boolean
    @readonly
  */
  hasFile: Ember.computed('jsonValue', function() {
    return !Ember.isNone(this.get('jsonValue'));
  }),

  /**
    Value change handler.
  */
  valueDidChange: Ember.observer('value', function() {
    this.sendAction('fileChange', {
      uploadData: this.get('uploadData'),
      value: this.get('value')
    });
  }),

  /**
    Data from jQuery fileupload plugin (contains selected file).

    @property uploadData
    @type Object
    @default null
  */
  uploadData: null,

  /**
    Current file selected for upload.

    @property selectedFile
    @type Object
    @readonly
  */
  selectedFile: Ember.computed('uploadData', function() {
    let uploadData = this.get('uploadData');
    return uploadData && uploadData.files && uploadData.files.length > 0 ? uploadData.files[0] : null;
  }),

  /**
    Upload data change handler.
  */
  uploadDataDidChange: Ember.observer('uploadData', function() {
    this.set('_previewImageAsBase64String', null);

    let file = this.get('selectedFile');
    if (!Ember.isNone(file)) {
      this.set('value', JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        fileMimeType: file.type
      }));
    }
  }),

  /**
    Flag: indicates whether file upload is in progress now.

    @property uploadIsInProgress
    @type Boolean
    @default false
  */
  uploadIsInProgress: false,

  /**
    Flag: indicates whether file preview download is in progress now.

    @property previewDownloadIsInProgress
    @type Boolean
    @default false
  */
  previewDownloadIsInProgress: false,

  /**
    Flag: indicates whether add button is visible now.

    @property addButtonIsVisible
    @type Boolean
    @readonly
  */
  addButtonIsVisible: Ember.computed('readonly', function() {
    return !this.get('readonly');
  }),

  /**
    Flag: indicates whether add button is enabled now.

    @property addButtonIsEnabled
    @type Boolean
    @readonly
  */
  addButtonIsEnabled: Ember.computed('uploadIsInProgress', function() {
    let uploadIsInProgress = this.get('uploadIsInProgress');
    return !uploadIsInProgress;
  }),

  /**
    Flag: indicates whether remove button is visible now.

    @property removeButtonIsVisible
    @type Boolean
    @readonly
  */
  removeButtonIsVisible: Ember.computed('readonly', function() {
    return !this.get('readonly');
  }),

  /**
    Flag: indicates whether remove button is enabled now.

    @property removeButtonIsEnabled
    @type Boolean
    @readonly
  */
  removeButtonIsEnabled: Ember.computed('uploadIsInProgress', 'value', function() {
    let uploadIsInProgress = this.get('uploadIsInProgress');
    let jsonValue = this.get('jsonValue');

    return !(uploadIsInProgress || Ember.isNone(jsonValue));
  }),

  /**
    Flag: indicates whether to upload file on 'relatedModel' 'preSave' event.

    @property uploadOnModelPreSave
    @type Boolean
    @default true
  */
  uploadOnModelPreSave: undefined,

  /**
    Flag: indicates whether to show preview element for images or not.

    @property showPreview
    @type Boolean
    @default false
  */
  showPreview: false,

  /**
    Preview options change handler.
  */
  previewOptionsDidChange: Ember.on('init', Ember.observer('showPreview', 'selectedFile', 'jsonValue.previewUrl', function() {
    if (!this.get('showPreview') || !Ember.isBlank(this.get('_previewImageAsBase64String'))) {
      return;
    }

    let file = this.get('selectedFile');
    if (!Ember.isNone(file)) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.set('_previewImageAsBase64String', e.target.result);
        this.set('previewDownloadIsInProgress', false);
      };

      this.set('previewDownloadIsInProgress', true);
      reader.readAsDataURL(file);

      return;
    }

    let previewUrl = this.get('jsonValue.previewUrl');
    if (!Ember.isBlank(previewUrl)) {
      // Download file preview.
      this.set('previewDownloadIsInProgress', true);
      Ember.$.ajax(previewUrl).done((data, textStatus, jqXHR) => {
        this.set('_previewImageAsBase64String', data);
      }).fail((jqXHR, textStatus, errorThrown) => {
        this.showDownloadErrorModalDialog(this.get('jsonValue.fileName'), errorThrown);
      }).always(() => {
        this.set('previewDownloadIsInProgress', false);
      });
    }
  })),

  /**
    Flag: indicates whether to show upload button or not.

    @property showUploadButton
    @type Boolean
    @default false
  */
  showUploadButton: undefined,

  /**
    Flag: indicates whether to show download button or not.

    @property showDownloadButton
    @type Boolean
    @default true
  */
  showDownloadButton: undefined,

  /**
    Flag: indicates whether upload button is visible now.

    @property uploadButtonIsVisible
    @type Boolean
    @readonly
  */
  uploadButtonIsVisible: Ember.computed('readonly', 'showUploadButton', function() {
    return !this.get('readonly') && this.get('showUploadButton');
  }),

  /**
    Flag: indicates whether upload button is enabled now.

    @property uploadButtonIsEnabled
    @type Boolean
    @readonly
  */
  uploadButtonIsEnabled: Ember.computed('uploadIsInProgress', 'uploadData', function() {
    let uploadIsInProgress = this.get('uploadIsInProgress');
    let selectedFile = this.get('selectedFile');

    return !(uploadIsInProgress || Ember.isNone(selectedFile));
  }),

  /**
    Flag: indicates whether download button is visible now.

    @property downloadButtonIsVisible
    @type Boolean
    @readonly
  */
  downloadButtonIsVisible: Ember.computed('showDownloadButton', function() {
    // Download button is always visible (but disabled if download is not available).
    return this.get('showDownloadButton');
  }),

  /**
    Flag: indicates whether download button is enabled now.

    @property downloadButtonIsEnabled
    @type Boolean
    @readonly
  */
  downloadButtonIsEnabled: Ember.computed('uploadIsInProgress', 'initialValue', function() {
    let uploadIsInProgress = this.get('uploadIsInProgress');
    let jsonInitialValue = this.get('jsonInitialValue');

    return !(uploadIsInProgress || Ember.isNone(jsonInitialValue));
  }),

  /**
    Maximum file size in bytes for uploading files.
    It should be greater then 0 and less or equal then APP.components.file.maxUploadFileSize from application config\environment.
    If null or undefined, then APP.components.file.maxUploadFileSize from application config\environment will be used.

    @property maxUploadFileSize
    @type Number
    @default null
  */
  maxUploadFileSize: undefined,

  /**
    Text to be displayed instead of file name, if file has not been selected.

    @property placeholder
    @type String
    @default 't('components.flexberry-file.placeholder')'
  */
  placeholder: t('components.flexberry-file.placeholder'),

  /**
    File upload URL.
    If null or undefined, then APP.components.file.uploadUrl from application config\environment will be used.

    @property uploadUrl
    @type String
    @default null
  */
  uploadUrl: undefined,

  /**
    Flag: indicates whether to show modal dialog on upload errors or not.

    @property showModalDialogOnUploadError
    @type Boolean
    @default false
  */
  showModalDialogOnUploadError: undefined,

  /**
    Caption to be displayed in error modal dialog.
    It will be displayed only if some error occurs.

    @property errorModalDialogCaption
    @type String
    @default 't('components.flexberry-file.error-dialog-caption')'
  */
  errorModalDialogCaption: t('components.flexberry-file.error-dialog-caption'),

  /**
    Content to be displayed in error modal dialog.
    It will be displayed only if some error occurs.

    @property errorModalDialogContent
    @type String
    @default 't('components.flexberry-file.error-dialog-content')'
  */
  errorModalDialogContent: t('components.flexberry-file.error-dialog-content'),

  /**
    Selected jQuery object, containing HTML of error modal dialog.

    @property errorModalDialog
    @type Object
    @default null
  */
  errorModalDialog: null,

  actions: {
    /**
      Handles click on selected image preview and sends action with data outside component
      in order to view selected image at modal window.

      @method actions.viewLoadedImage
      @public
    */
    viewLoadedImage() {
      let fileName = this.get('fileName');
      let previewImageAsBase64String = this.get('_previewImageAsBase64String');
      if (!Ember.isBlank(fileName) && !Ember.isBlank(previewImageAsBase64String)) {
        this.sendAction('viewImageAction', {
          fileSrc: previewImageAsBase64String,
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
      // Add button's label is attached to file input through label's 'for' attribute in component's template,
      // so there is no any necessary logic here, file dialog will be opened by browser automatically.
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
    }
  },

  /**
    Initializes {{#crossLink "FlexberryFileComponent"}}flexberry-file{{/crossLink}} component.
  */
  init() {
    this._super(...arguments);

    // Remember initial value.
    let value = this.get('value');
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
  },

  /**
    Initializes {{#crossLink "FlexberryFileComponent"}}flexberry-file{{/crossLink}} component DOM-related properties.
  */
  didInsertElement() {
    this._super(...arguments);

    // Initialize SemanticUI modal dialog, and remember it in a component property,
    // because after call to errorModalDialog.modal its html will disappear from DOM.
    let errorModalDialog = this.$('.flexberry-file-error-modal-dialog');
    errorModalDialog.modal('setting', 'closable', false);
    this.set('errorModalDialog', errorModalDialog);

    // jQuery fileupload 'add' callback.
    let onFileAdd = (e, uploadData) => {
      let selectedFile = uploadData && uploadData.files && uploadData.files.length > 0 ? uploadData.files[0] : null;
      let maxUploadFileSize = this.get('maxUploadFileSize');

      if (!Ember.isNone(maxUploadFileSize)) {
        if (Ember.typeOf(maxUploadFileSize) === 'number' && maxUploadFileSize >= 0) {
          // Prevent files greater then maxUploadFileSize.
          if (selectedFile.size > maxUploadFileSize) {
            this.showFileSizeErrorModalDialog(selectedFile.name, selectedFile.size, maxUploadFileSize);

            // Break file upload.
            return;
          }
        } else {
          Ember.Logger.error(`Wrong value of flexberry-file \`maxUploadFileSize\` propery: \`${maxUploadFileSize}\`. Allowed value is a number >= 0.`);
        }
      }

      this.set('uploadData', uploadData);
    };

    // Initialize jQuery fileupload plugin (https://github.com/blueimp/jQuery-File-Upload/wiki/API).
    this.$('.flexberry-file-file-input').fileupload({
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
      url: this.get('uploadUrl'),

      // File add handler.
      add: onFileAdd
    });
  },

  /**
    Destroys {{#crossLink "FlexberryFileComponent"}}flexberry-file{{/crossLink}} component.
  */
  willDestroyElement() {
    this._super(...arguments);

    this.$('.flexberry-file-file-input').fileupload('destroy');

    // Unsubscribe from related model's 'preSave'event.
    this._unsubscribeFromRelatedModelPresaveEvent();
  },

  /**
    Removes selected file.

    @method removeFile
  */
  removeFile() {
    this.set('uploadData', null);
    this.set('value', null);
    this.set('_previewImageAsBase64String', null);
  },

  /**
    Uploads selected file.

    @method uploadFile
  */
  uploadFile() {
    let file = this.get('selectedFile');
    if (Ember.isNone(file)) {
      return null;
    }

    return new Ember.RSVP.Promise((resolve, reject) => {
      this.set('uploadIsInProgress', true);

      let uploadData = this.get('uploadData');
      let initialValue = this.get('initialValue');
      if (!Ember.isNone(initialValue)) {
        uploadData.formData = {
          // Metadata about previously uploaded file.
          previousFileDescription: initialValue
        };
      }

      uploadData.submit().done((result, textStatus, jqXhr) => {
        let value = jqXhr.responseText;

        this.set('value', value);
        this.set('initialValue', Ember.copy(value, true));
        this.set('uploadData', null);

        this.sendAction('uploadSuccess', {
          uploadData: uploadData,
          response: jqXhr,
          value: value
        });
        resolve(this.get('jsonValue'));
      }).fail((jqXhr, textStatus, errorThrown) => {
        let errorContent = this.showUploadErrorModalDialog(file.name, errorThrown ? ' (' + errorThrown + ')' : '');
        this.sendAction('uploadFail', {
          uploadData: uploadData,
          response: jqXhr,
          value: this.get('value')
        });
        reject(new Error(errorContent));
      }).always(() => {
        this.set('uploadIsInProgress', false);
      });
    });
  },

  /**
    Method to download previously uploaded file.

    @method downloadFile
  */
  downloadFile() {
    let fileName = this.get('jsonInitialValue.fileName');
    let fileUrl = this.get('jsonInitialValue.fileUrl');
    if (Ember.isBlank(fileUrl)) {
      return null;
    }

    Ember.$.flexberry.downloadFile({
      // For IE encodeURI is necessary.
      // Without encodeURI IE will return 404 for files with cyrillic names in URL.
      url: encodeURI(fileUrl),
      iframeContainer: this.$('.flexberry-file-download-iframes-container'),
      onError: (errorMessage) => {
        this.showDownloadErrorModalDialog(fileName, errorMessage);
      }
    });
  },

  /**
    Shows error modal dialog.

    @method showErrorModalDialog
    @param {String} errorCaption Error caption (window header caption).
    @param {String} errorContent Error content (window body content).
    @returns {String} Error content.
  */
  showErrorModalDialog(errorCaption, errorContent) {
    let errorModalDialog = this.get('errorModalDialog');
    if (errorModalDialog && errorModalDialog.modal) {
      this.set('errorModalDialogCaption', errorCaption);
      this.set('errorModalDialogContent', errorContent);
      errorModalDialog.modal('show');
    }

    return errorContent;
  },

  /**
    Shows file size errors if there were some.

    @method showUploadErrorModalDialog
    @param {String} fileName Added file name.
    @param {String} actualFileSize Actual size of added file.
    @param {String} maxFileSize Max file size allowed.
    @returns {String} Error content.
  */
  showFileSizeErrorModalDialog(fileName, actualFileSize, maxFileSize) {
    let i18n = this.get('i18n');
    let errorCaption = i18n.t('components.flexberry-file.add-file-error-caption');
    let errorContent = i18n.t('components.flexberry-file.file-too-big-error-message', {
      fileName: fileName,
      actualFileSize: actualFileSize,
      maxFileSize: maxFileSize,
    });

    this.showErrorModalDialog(errorCaption, errorContent);

    return errorContent;
  },

  /**
    Shows errors if there were some during file upload.

    @method showUploadErrorModalDialog
    @param {String} fileName File name.
    @param {String} errorMessage Message about error occurred during file upload.
    @returns {String} Error content.
  */
  showUploadErrorModalDialog(fileName, errorMessage) {
    let i18n = this.get('i18n');
    let errorCaption = i18n.t('components.flexberry-file.upload-file-error-caption');
    let errorContent = i18n.t('components.flexberry-file.upload-file-error-message', {
      fileName: fileName,
      errorMessage: errorMessage
    });
    if (this.get('showModalDialogOnUploadError')) {
      this.showErrorModalDialog(errorCaption, errorContent);
    }

    return errorContent;
  },

  /**
    Shows errors if there were some during file download.

    @method showDownloadErrorModalDialog
    @param {String} fileName File name.
    @param {String} errorMessage Message about error occurred during file download.
  */
  showDownloadErrorModalDialog(fileName, errorMessage) {
    let i18n = this.get('i18n');
    let errorCaption = i18n.t('components.flexberry-file.download-file-error-caption');
    let errorContent = i18n.t('components.flexberry-file.download-file-error-message', {
      fileName: fileName,
      errorMessage: errorMessage
    });

    if (this.get('showModalDialogOnDownloadError')) {
      this.showErrorModalDialog(errorCaption, errorContent);
    }

    return errorContent;
  },

  /**
    Handles related model's 'preSave' event.

    @private
    @method _onRelatedModelPreSave
    @param {Object} e Related model's 'preSave' event arguments.
    @param {Object[]} e.promises Related model's 'preSave' operations promises array.
  */
  _onRelatedModelPreSave(e) {
    // Remove uploaded file from server, if related model is deleted, otherwise upload selected file to server.
    let fileOperationPromise = this.get('relatedModel.isDeleted') ? null : this.uploadFile();

    // Push file operation promise to events object's 'promises' array
    // (to keep model waiting until operation will be finished).
    if (!Ember.isNone(fileOperationPromise) && !Ember.isNone(e) && Ember.isArray(e.promises)) {
      e.promises.push(fileOperationPromise);
    }
  },

  /**
    Subscribes on related model's 'preSave' event.

    @private
    @method _subscribeOnRelatedModelPreSaveEvent
  */
  _subscribeOnRelatedModelPreSaveEvent() {
    let uploadOnModelPreSave = this.get('uploadOnModelPreSave');
    if (!uploadOnModelPreSave) {
      return;
    }

    let relatedModelOnPropertyType = Ember.typeOf(this.get('relatedModel.on'));
    if (relatedModelOnPropertyType !== 'function') {
      Ember.Logger.error(`Wrong type of \`relatedModel.on\` propery: actual type is ${relatedModelOnPropertyType}, but function is expected.`);
    }

    let relatedModel = this.get('relatedModel');
    relatedModel.on('preSave', this.get('_onRelatedModelPreSave'));
  },

  /**
    Unsubscribes from related model's 'preSave' event.

    @private
    @method _unsubscribeFromRelatedModelPresaveEvent
  */
  _unsubscribeFromRelatedModelPresaveEvent() {
    let relatedModelOffPropertyType = Ember.typeOf(this.get('relatedModel.off'));
    if (relatedModelOffPropertyType !== 'function') {
      Ember.Logger.error(`Wrong type of \`relatedModel.off\` propery: actual type is ${relatedModelOffPropertyType}, but function is expected.`);
    }

    let relatedModel = this.get('relatedModel');
    relatedModel.off('preSave', this.get('_onRelatedModelPreSave'));
  }
});
