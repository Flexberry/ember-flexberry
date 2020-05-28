/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';
import { getSizeInUnits } from '../utils/file-size-units-converter';

/**
  Flexberry file component.

  Usage sample:
  ```handlebars
  {{flexberry-file value=model.file uploadUrl="http://myApplication/api/File"}}
  ```

  @class FlexberryFileComponent
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
    Available file size units with its captions.

    @property _fileSizeUnits
    @type Object
    @private
  */
  _fileSizeUnits: {
    Bt: t('components.flexberry-file.error-dialog-size-unit-bt'),
    Kb: t('components.flexberry-file.error-dialog-size-unit-kb'),
    Mb: t('components.flexberry-file.error-dialog-size-unit-mb'),
    Gb: t('components.flexberry-file.error-dialog-size-unit-gb')
  },

  /**
    Selected file content. It can be used as source for image tag in order to view preview.

    @property _previewImageAsBase64String
    @type String
    @default null
    @private
  */
  _previewImageAsBase64String: null,

  /**
    File input identifier.

    @property _fileInputId
    @type String
    @readOnly
    @private
  */
  _fileInputId: Ember.computed('elementId', function() {
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

    @property _initialValue
    @type String
    @private
  */
  _initialValue: null,

  /**
    Deserialized copy of value created at initialization moment or after successful upload.

    @property _jsonInitialValue
    @type Object
    @readOnly
    @private
  */
  _jsonInitialValue: Ember.computed('_initialValue', function() {
    let initialValue = this.get('_initialValue');
    return Ember.typeOf(initialValue) === 'string' && !Ember.isBlank(initialValue) ? JSON.parse(initialValue) : null;
  }),

  /**
    Deserialized value of file component.

    @property _jsonValue
    @type Object
    @readOnly
    @private
  */
  _jsonValue: Ember.computed('value', function() {
    let value = this.get('value');
    return Ember.typeOf(value) === 'string' && !Ember.isBlank(value) ? JSON.parse(value) : null;
  }),

  /**
    File name.
    It is binded to component file name input, so every change to fileName will automatically change file name input value.

    @property _fileName
    @type String
    @readOnly
    @private
  */
  _fileName: Ember.computed('_jsonValue.fileName', function() {
    let fileName = this.get('_jsonValue.fileName');
    if (Ember.isNone(fileName)) {
      return null;
    }

    return fileName;
  }),

  /**
    Flag: indicates whether some file is added now or not.

    @property _hasFile
    @type Boolean
    @readOnly
    @private
  */
  _hasFile: Ember.computed('_jsonValue', function() {
    return !Ember.isNone(this.get('_jsonValue'));
  }),

  /**
    Data from jQuery fileupload plugin (contains selected file).

    @property _uploadData
    @type Object
    @default null
    @private
  */
  _uploadData: null,

  /**
    Copy of data from jQuery fileupload plugin (contains selected file).

    @property _uploadDataCopy
    @type Object
    @default null
    @private
  */
  _uploadDataCopy: null,

  /**
    Current file selected for upload.

    @property _selectedFile
    @type Object
    @readOnly
    @private
  */
  _selectedFile: Ember.computed('_uploadData', function() {
    let uploadData = this.get('_uploadData');
    return uploadData && uploadData.files && uploadData.files.length > 0 ? uploadData.files[0] : null;
  }),

  /**
    Flag: indicates whether file upload is in progress now.

    @property _uploadIsInProgress
    @type Boolean
    @default false
    @private
  */
  _uploadIsInProgress: false,

  /**
    Flag: indicates whether file preview download is in progress now.

    @property _previewDownloadIsInProgress
    @type Boolean
    @default false
    @private
  */
  _previewDownloadIsInProgress: false,

  /**
    Flag: indicates whether add button is visible now.

    @property _addButtonIsVisible
    @type Boolean
    @readOnly
    @private
  */
  _addButtonIsVisible: Ember.computed('readonly', function() {
    return !this.get('readonly');
  }),

  /**
    Flag: indicates whether add button is enabled now.

    @property _addButtonIsEnabled
    @type Boolean
    @readOnly
    @private
  */
  _addButtonIsEnabled: Ember.computed('_uploadIsInProgress', function() {
    let uploadIsInProgress = this.get('_uploadIsInProgress');
    return !uploadIsInProgress;
  }),

  /**
    Flag: indicates whether remove button is visible now.

    @property _removeButtonIsVisible
    @type Boolean
    @readOnly
    @private
  */
  _removeButtonIsVisible: Ember.computed('readonly', function() {
    return !this.get('readonly');
  }),

  /**
    Flag: indicates whether remove button is enabled now.

    @property _removeButtonIsEnabled
    @type Boolean
    @readOnly
    @private
  */
  _removeButtonIsEnabled: Ember.computed('_uploadIsInProgress', 'value', function() {
    let uploadIsInProgress = this.get('_uploadIsInProgress');
    let jsonValue = this.get('_jsonValue');

    return !(uploadIsInProgress || Ember.isNone(jsonValue));
  }),

  /**
    Flag: indicates whether upload button is visible now.

    @property _uploadButtonIsVisible
    @type Boolean
    @readOnly
    @private
  */
  _uploadButtonIsVisible: Ember.computed('readonly', 'showUploadButton', function() {
    return !this.get('readonly') && this.get('showUploadButton');
  }),

  /**
    Flag: indicates whether upload button is enabled now.

    @property _uploadButtonIsEnabled
    @type Boolean
    @readOnly
    @private
  */
  _uploadButtonIsEnabled: Ember.computed('_uploadIsInProgress', '_uploadData', function() {
    let uploadIsInProgress = this.get('_uploadIsInProgress');
    let selectedFile = this.get('_selectedFile');

    return !(uploadIsInProgress || Ember.isNone(selectedFile));
  }),

  /**
    Flag: indicates whether download button is visible now.

    @property _downloadButtonIsVisible
    @type Boolean
    @readOnly
    @private
  */
  _downloadButtonIsVisible: Ember.computed('showDownloadButton', function() {
    // Download button is always visible (but disabled if download is not available).
    return this.get('showDownloadButton');
  }),

  /**
    Flag: indicates whether download button is enabled now.

    @property _downloadButtonIsEnabled
    @type Boolean
    @readOnly
    @private
  */
  _downloadButtonIsEnabled: Ember.computed('_uploadIsInProgress', '_initialValue', function() {
    let uploadIsInProgress = this.get('_uploadIsInProgress');
    let jsonInitialValue = this.get('_jsonInitialValue');

    return !(uploadIsInProgress || Ember.isNone(jsonInitialValue));
  }),

  /**
    Caption to be displayed in error modal dialog.
    It will be displayed only if some error occurs.

    @property _errorModalDialogCaption
    @type String
    @default t('components.flexberry-file.error-dialog-caption')
    @private
  */
  _errorModalDialogCaption: t('components.flexberry-file.error-dialog-caption'),

  /**
    Content to be displayed in error modal dialog.
    It will be displayed only if some error occurs.

    @property _errorModalDialogContent
    @type String
    @default t('components.flexberry-file.error-dialog-content')
    @private
  */
  _errorModalDialogContent: t('components.flexberry-file.error-dialog-content'),

  /**
    Caption to be displayed in loaded file table cell.
    It will be displayed only if preview can't be loaded.

    @property _errorPreviewCaption
    @type String
    @default t('components.flexberry-file.error-preview-caption')
    @private
  */
  _errorPreviewCaption: t('components.flexberry-file.error-preview-caption'),

  /**
    Selected jQuery object, containing HTML of error modal dialog.

    @property _errorModalDialog
    @type <a href="http://api.jquery.com/Types/#jQuery">JQueryObject</a>
    @default null
    @private
  */
  _errorModalDialog: null,

  /**
    Component's wrapping <div> CSS-class names.

    @property classNames
    @type String[]
    @default ['flexberry-file']
  */
  classNames: ['flexberry-file'],

  /**
    Component's input additional CSS-class names.
    See [Semantic UI inputs classes](http://semantic-ui.com/elements/input.html).

    @property inputClass
    @type String
    @default ''
    @example
        ```handlebars
        {{flexberry-file
          inputClass="compact"
          value=model.file
        }}
        ```
  */
  inputClass: '',

  /**
    CSS-classes names for component's add, remove, upload, download buttons.
    See [Semantic UI buttons classes](http://semantic-ui.com/elements/button.html).

    @property buttonClass
    @type String
    @default ''
    @example
        ```handlebars
        {{flexberry-file
          buttonClass="red"
          value=model.file
        }}
      ```
  */
  buttonClass: '',

  /**
    Path to component's settings in application configuration (JSON from ./config/environment.js).

    @property appConfigSettingsPath
    @type String
    @default 'APP.components.flexberryFile'
  */
  appConfigSettingsPath: 'APP.components.flexberryFile',

  /**
    Name of the action which will be send outside after click on selected image preview.

    @property viewImageAction
    @type String
    @default 'flexberryFileViewImageAction'
  */
  viewImageAction: 'flexberryFileViewImageAction',

  /**
    Value of file component (contains serialized file metadata such as fileName, fileSize, etc.).
    It is binded to related model property, so every change to value will automatically change model property.

    @property value
    @type String
  */
  value: null,

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
    indicates whether preview img can be loaded when show.

    @property _canLoadPreview
    @type Boolean
    @default true
  */
  _canLoadPreview: true,

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
    Maximum file size in bytes for uploading files.
    It should be greater then 0 and less or equal then APP.components.file.maxUploadFileSize from application config\environment.
    If null or undefined, then APP.components.file.maxUploadFileSize from application config\environment will be used.

    @property maxUploadFileSize
    @type Number
 */
  maxUploadFileSize: undefined,

  /**
    Maximum file size unit. May be 'Bt' 'Kb' 'Mb' or 'Gb'.

    @property maxUploadFileSizeUnit
    @type String
    @default 'Bt'
  */
  maxUploadFileSizeUnit: 'Bt',

  /**
    Text to be displayed instead of file name, if file has not been selected.

    @property placeholder
    @type String
    @default t('components.flexberry-file.placeholder')
  */
  placeholder: t('components.flexberry-file.placeholder'),

  /**
    File upload URL.
    If null or undefined, then APP.components.file.uploadUrl from application config\environment will be used.

    @property uploadUrl
    @type String
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
    Flag: download by clicking download or open file in new window.

    @property openInNewWindowInsteadOfLoading
    @type Boolean
    @default false
  */
  openFileInNewWindowInsteadOfLoading: undefined,

  /**
    Headers to the file upload request.

    @property headers
    @type Object
    @default null
  */
  headers: null,

  /**
    Settings for preview modal dialog.

    @property previewSettings
    @type Object
    @default null
  */
  previewSettings: null,

  /**
    Available file extensions for upload. In MIME type format.

    @property availableMimeTypes
    @type String
    @default ''
  */
  availableMimeTypes: '',

  /**
    External Base64 string
    @property base64Value
    @type String
    @default null
  */
  base64Value: null,

  /**
    Name for base64 file. {base64FileName}.{base64FileExtension}
    @property base64FileName
    @type String
    @default null
  */
  base64FileName: null,

  /**
    Extension for base64 file. {base64FileName}.{base64FileExtension}
    @property base64FileExtension
    @type String
    @default null
  */
  base64FileExtension: null,

  actions: {
    /**
      Handles click on selected image preview and sends action with data outside component
      in order to view selected image at modal window.

      @method actions.viewLoadedImage
      @public
    */
    viewLoadedImage() {
      let fileName = this.get('_fileName');
      let previewImageAsBase64String = this.get('_previewImageAsBase64String');
      if (!Ember.isBlank(fileName) && !Ember.isBlank(previewImageAsBase64String)) {
        let settings = this.get('previewSettings');

        this.sendAction('viewImageAction', {
          fileSrc: previewImageAsBase64String,
          fileName: fileName,
          settings: settings
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
    this.set('_initialValue', Ember.copy(value, true));

    // Initialize properties which defaults could be defined in application configuration.
    this.initProperty({ propertyName: 'uploadUrl', defaultValue: null });
    this.initProperty({ propertyName: 'maxUploadFileSize', defaultValue: null });
    this.initProperty({ propertyName: 'uploadOnModelPreSave', defaultValue: true });
    this.initProperty({ propertyName: 'showUploadButton', defaultValue: false });
    this.initProperty({ propertyName: 'showDownloadButton', defaultValue: true });
    this.initProperty({ propertyName: 'showModalDialogOnUploadError', defaultValue: false });
    this.initProperty({ propertyName: 'showModalDialogOnDownloadError', defaultValue: true });
    this.initProperty({ propertyName: 'openFileInNewWindowInsteadOfLoading', defaultValue: false });
    this.initProperty({ propertyName: 'base64FileName', defaultValue: null });
    this.initProperty({ propertyName: 'base64FileExtension', defaultValue: null });

    // Bind related model's 'preSave' event handler's context & subscribe on related model's 'preSave'event.
    this.set('_onRelatedModelPreSave', this.get('_onRelatedModelPreSave').bind(this));
    this._subscribeOnRelatedModelPreSaveEvent();
  },

  /**
    Hook for base64Value update.
    It runs "change" event on file-input to update file from base64Value if base64FileName and base64FileExtension set.
  */
  didReceiveAttrs() {
    this._super(...arguments);
    if (this.get('base64Value')) {
      Ember.assert(`If you use base64 files, properties "base64FileName" and "base64FileExtension" can't be null or undefined`,
      (this.get('base64FileName') && this.get('base64FileExtension')));
      this.$('.flexberry-file-file-input').change();
    }
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
    this.set('_errorModalDialog', errorModalDialog);

    // jQuery fileupload 'add' callback.
    let onFileAdd = (e, uploadData) => {
      let selectedFile = uploadData && uploadData.files && uploadData.files.length > 0 ? uploadData.files[0] : null;

      const isAvailableTypesSet = Object.keys(this.availableMimeTypes).length > 0;
      const isFileTypeAvailable= this.availableMimeTypes.includes(selectedFile.type);
      const isFileTypeUndefined = selectedFile.type === '';

      if (isAvailableTypesSet && (isFileTypeUndefined || !isFileTypeAvailable)) {
        const fileName = selectedFile.name;
        this.showFileExtensionErrorModalDialog(fileName);
        return;
      }

      let maxUploadFileSize = this.get('maxUploadFileSize');

      if (!Ember.isNone(maxUploadFileSize)) {
        Ember.assert(
          `Wrong value of flexberry-file \`maxUploadFileSize\` propery: \`${maxUploadFileSize}\`.` +
          ` Allowed value is a number >= 0.`, Ember.typeOf(maxUploadFileSize) === 'number' && maxUploadFileSize >= 0);

        let sizeUnit = this.get('maxUploadFileSizeUnit');
        if (!(sizeUnit in this.get('_fileSizeUnits'))) {
          console.log('Flexberry-file error, file max size wrong units assigned');
          sizeUnit = Object.keys(this.get('_fileSizeUnits'))[0];
        }

        let fileSizeInUnits = getSizeInUnits(selectedFile.size, sizeUnit);

        // Prevent files greater then maxUploadFileSize.
        if (fileSizeInUnits > maxUploadFileSize) {
          this.showFileSizeErrorModalDialog(selectedFile.name, fileSizeInUnits, maxUploadFileSize, sizeUnit);

          // Break file upload.
          return;
        }
      }

      uploadData.headers = this.get('headers');
      this.set('_uploadData', uploadData);
    };

    let onFileChange = (e, uploadData) => {
      this.set('_canLoadPreview', true);
      let fileName = `${this.get('base64FileName')}.${this.get('base64FileExtension')}`;
      if (this.get('base64Value')) {
        uploadData.files = [this._dataURLtoFile(this.get('base64Value'), fileName)];
        this.set('base64Value', null);
        onFileAdd(e, uploadData);
      }
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
      add: onFileAdd,

      // File change handler. For base64 implmentation
      change: onFileChange
    });
  },

  /**
    Changes url in jQuery fileupload when uploadUrl changed.
  */
  uploadUrlObserver: Ember.observer('uploadUrl', function() {
    this.$('.flexberry-file-file-input').fileupload(
    'option',
    'url',
    this.get('uploadUrl'));
    if (Ember.isNone(this.get('_uploadData'))) {
      this.set('_uploadData', this.get('_uploadDataCopy'));
    }

    this.set('_initialValue', null);
  }),

  /**
    Method converts base64 string to File

    @method _dataURLtoFile
    @param {String} dataUrl Base64 string
    @param {String} fileName Filename for saving
    @private
   */
  _dataURLtoFile(dataUrl, fileName) {
    try {
      let arr = dataUrl.split(',');
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], fileName, { type: mime });
    }
    catch (error) {
      this.showUploadErrorModalDialog(fileName, error.message);
      return null;
    }
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
    this.set('_uploadData', null);
    this.set('_uploadDataCopy', null);
    this.set('value', null);
    this.set('_previewImageAsBase64String', null);
    this.set('base64Value', null);
  },

  /**
    Uploads selected file.

    @method uploadFile
  */
  uploadFile() {
    let file = this.get('_selectedFile');

    if (Ember.isNone(file)) {
      if (!this.get('_hasFile')) {
        this.set('value', null);
        this.set('_initialValue', null);
      }

      return null;
    }

    return new Ember.RSVP.Promise((resolve, reject) => {
      this.set('_uploadIsInProgress', true);

      let uploadData = this.get('_uploadData');
      let initialValue = this.get('_initialValue');
      if (!Ember.isNone(initialValue)) {
        uploadData.formData = {
          // Metadata about previously uploaded file.
          previousFileDescription: initialValue
        };
      }

      uploadData.submit().done((result, textStatus, jqXhr) => {
        let value = jqXhr.responseText;

        this.set('value', value);
        this.set('_initialValue', Ember.copy(value, true));
        this.set('_uploadDataCopy', this.get('_uploadData'));
        this.set('_uploadData', null);

        this.sendAction('uploadSuccess', {
          uploadData: uploadData,
          response: jqXhr,
          value: value
        });
        resolve(this.get('_jsonValue'));
      }).fail((jqXhr, textStatus, errorThrown) => {
        let errorContent = this.showUploadErrorModalDialog(file.name, errorThrown ? ' (' + errorThrown + ')' : '');
        this.sendAction('uploadFail', {
          uploadData: uploadData,
          response: jqXhr,
          value: this.get('value')
        });
        reject(new Error(errorContent));
      }).always(() => {
        this.set('_uploadIsInProgress', false);
      });
    });
  },

  /**
    Downloads previously uploaded file.

    @method downloadFile
  */
  downloadFile() {
    let fileName = this.get('_jsonInitialValue.fileName');
    let fileUrl = this.get('_jsonInitialValue.fileUrl');
    if (Ember.isBlank(fileUrl)) {
      return null;
    }

    Ember.$.flexberry.downloadFile({
      url: fileUrl,
      headers: this.get('headers'),
      fileName: fileName,
      openFileInNewWindowInsteadOfLoading: this.get('openFileInNewWindowInsteadOfLoading'),
      onSuccess: () => {
        this.sendAction('onDownloadSuccess');
      },
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
    let errorModalDialog = this.get('_errorModalDialog');
    if (errorModalDialog && errorModalDialog.modal) {
      this.set('_errorModalDialogCaption', errorCaption);
      this.set('_errorModalDialogContent', errorContent);
      errorModalDialog.modal('show');
    }

    return errorContent;
  },

  previewError(fileName) {
    this.set('_canLoadPreview', false);
  },

  /**
    Shows file size errors if there were some.

    @method showUploadErrorModalDialog
    @param {String} fileName Added file name.
    @param {String} actualFileSize Actual size of added file.
    @param {String} maxFileSize Max file size allowed.
    @param {String} sizeUnit Max file size unit.
    @returns {String} Error content.
  */
  showFileSizeErrorModalDialog(fileName, actualFileSize, maxFileSize, sizeUnit) {
    let i18n = this.get('i18n');
    let actualFileSizeRoundedString = actualFileSize.toFixed(1);
    let errorCaption = i18n.t('components.flexberry-file.add-file-error-caption');
    let errorContent = i18n.t('components.flexberry-file.file-too-big-error-message', {
      fileName: fileName,
      actualFileSize: actualFileSizeRoundedString,
      maxFileSize: maxFileSize,
      sizeUnit: sizeUnit
    });

    this.showErrorModalDialog(errorCaption, errorContent);

    return errorContent;
  },

  /**
    Shows file extension errors if there were some.

    @method showFileExtensionErrorModalDialog
    @param {String} fileName Added file name.
    @returns {String} Error content.
  */
  showFileExtensionErrorModalDialog(fileName) {
    let i18n = this.get('i18n');
    let errorCaption = i18n.t('components.flexberry-file.add-file-error-caption');
    let errorContent = i18n.t('components.flexberry-file.file-extension-error-message', {
      fileName: fileName,
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

    @method _onRelatedModelPreSave
    @param {Object} e Related model's 'preSave' event arguments.
    @param {Object[]} e.promises Related model's 'preSave' operations promises array.
    @private
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

    @method _subscribeOnRelatedModelPreSaveEvent
    @private
  */
  _subscribeOnRelatedModelPreSaveEvent() {
    let uploadOnModelPreSave = this.get('uploadOnModelPreSave');
    if (!uploadOnModelPreSave) {
      return;
    }

    let relatedModelOnPropertyType = Ember.typeOf(this.get('relatedModel.on'));
    Ember.assert(`Wrong type of \`relatedModel.on\` propery: actual type is ${relatedModelOnPropertyType}, but function is expected.`,
      relatedModelOnPropertyType === 'function');

    let relatedModel = this.get('relatedModel');
    relatedModel.on('preSave', this.get('_onRelatedModelPreSave'));
  },

  /**
    Unsubscribes from related model's 'preSave' event.

    @method _unsubscribeFromRelatedModelPresaveEvent
    @private
  */
  _unsubscribeFromRelatedModelPresaveEvent() {
    let relatedModelOffPropertyType = Ember.typeOf(this.get('relatedModel.off'));
    Ember.assert(`Wrong type of \`relatedModel.off\` propery: actual type is ${relatedModelOffPropertyType}, but function is expected.`,
      relatedModelOffPropertyType === 'function');

    let relatedModel = this.get('relatedModel');
    relatedModel.off('preSave', this.get('_onRelatedModelPreSave'));
  },

  /**
    Value change handler.

    @method _valueDidChange
    @private
  */
  _valueDidChange: Ember.observer('value', function() {
    this.sendAction('fileChange', {
      uploadData: this.get('_uploadData'),
      value: this.get('value')
    });
  }),

  /**
    Upload data change handler.

    @method _uploadDataDidChange
    @private
  */
  _uploadDataDidChange: Ember.observer('_uploadData', function() {
    if (this.get('_uploadData')) {
      this.set('_previewImageAsBase64String', null);
    }

    Ember.run(() => {
      let file = this.get('_selectedFile');
      if (!Ember.isNone(file)) {
        this.set('value', JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          fileMimeType: file.type
        }));
      }
    });
  }),

  /**
    Preview options change handler.

    @method _previewOptionsDidChange
    @private
  */
  _previewOptionsDidChange: Ember.on('init', Ember.observer('showPreview', '_selectedFile', '_jsonValue.previewUrl', function() {
    if (!this.get('showPreview') || !Ember.isBlank(this.get('_previewImageAsBase64String'))) {
      return;
    }

    let file = this.get('_selectedFile');
    if (!Ember.isNone(file)) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.set('_previewImageAsBase64String', e.target.result);
        this.set('_previewDownloadIsInProgress', false);
      };

      this.set('_previewDownloadIsInProgress', true);
      reader.readAsDataURL(file);

      return;
    }

    let previewUrl = this.get('_jsonValue.previewUrl');
    if (!Ember.isBlank(previewUrl)) {
      // Download file preview.
      this.set('_previewDownloadIsInProgress', true);
      Ember.$.ajax(previewUrl).done((data, textStatus, jqXHR) => {
        this.set('_previewImageAsBase64String', data);
      }).fail((jqXHR, textStatus, errorThrown) => {
        this.previewError(this.get('_jsonValue.fileName'));
      }).always(() => {
        this.set('_previewDownloadIsInProgress', false);
      });
    }
  }))
});
