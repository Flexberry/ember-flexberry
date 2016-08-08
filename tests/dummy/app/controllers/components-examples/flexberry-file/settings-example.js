import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import { translationMacro as t } from 'ember-i18n';

export default EditFormController.extend({
  /**
    Text for 'flexberry-file' component 'placeholder' property.

    @property placeholder
    @type String
   */
  placeholder: t('components.flexberry-file.placeholder'),
  /**
    Handles changes in placeholder.

    @method _placeholderChanged
    @private
   */
  _placeholderChanged: Ember.observer('placeholder', function() {
    if (this.get('placeholder') === this.get('i18n').t('components.flexberry-file.placeholder').toString()) {
      this.set('placeholder', t('components.flexberry-file.placeholder'));
    }
  }),
  /**
    Flag: indicates whether 'flexberry-file' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
   */
  readonly: false,

  /**
    File upload URL for 'flexberry-file' component 'uploadUrl' property.

    @property uploadUrl
    @type String
   */
  uploadUrl: null,

  /**
    Max upload file size (in bytes) for 'flexberry-file' component 'maxUploadFileSize' property.

    @property maxUploadFileSize
    @type Number
   */
  maxUploadFileSize: null,

  /**
    Flag for 'flexberry-file' component 'showPreview' property.

    @property showPreview
    @type Boolean
   */
  showPreview: false,

  /**
    Flag for 'flexberry-file' component 'showUploadButton' property.

    @property showUploadButton
    @type Boolean
   */
  showUploadButton: false,

  /**
    Flag for 'flexberry-file' component 'showDownloadButton' property.

    @property showDownloadButton
    @type Boolean
   */
  showDownloadButton: true,

  /**
    Flag for 'flexberry-file' component 'showModalDialogOnUploadError' property.

    @property showModalDialogOnUploadError
    @type Boolean
   */
  showModalDialogOnUploadError: false,

  /**
    Flag for 'flexberry-file' component 'showModalDialogOnDownloadError' property.

    @property showModalDialogOnDownloadError
    @type Boolean
   */
  showModalDialogOnDownloadError: true,

  /**
    Template text for 'flexberry-textbox' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{flexberry-file<br>' +
    '  value=model.file<br>' +
    '  placeholder=placeholder<br>' +
    '  readonly=readonly<br>' +
    '  uploadUrl=uploadUrl<br>' +
    '  maxUploadFileSize=maxUploadFileSize<br>' +
    '  showPreview=showPreview<br>' +
    '  showUploadButton=showUploadButton<br>' +
    '  showDownloadButton=showDownloadButton<br>' +
    '  showModalDialogOnUploadError=showModalDialogOnUploadError<br>' +
    '  showModalDialogOnDownloadError=showModalDialogOnDownloadError<br>' +
    '}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: Ember.computed('i18n.locale', function() {
    var componentSettingsMetadata = Ember.A();
    componentSettingsMetadata.pushObject({
      settingName: 'value',
      settingType: 'string',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'model.file'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'placeholder',
      settingType: 'string',
      settingDefaultValue: this.get('i18n').t('components.flexberry-file.placeholder'),
      bindedControllerPropertieName: 'placeholder'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'readonly',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'readonly'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'uploadUrl',
      settingType: 'string',
      settingDefaultValue: null,
      bindedControllerPropertieName: 'uploadUrl'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'maxUploadFileSize',
      settingType: 'number',
      settingDefaultValue: null,
      bindedControllerPropertieName: 'maxUploadFileSize'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showPreview',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'showPreview'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showUploadButton',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'showUploadButton'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showDownloadButton',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'showDownloadButton'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showModalDialogOnUploadError',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'showModalDialogOnUploadError'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showModalDialogOnDownloadError',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'showModalDialogOnDownloadError'
    });

    return componentSettingsMetadata;
  })
});
