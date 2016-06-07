import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

export default Ember.Controller.extend({
  /**
    Text for 'flexberry-textbox' component 'placeholder' property.

    @property placeholder
    @type String
   */
  placeholder: t('components.flexberry-file.placeholder'),

  /**
    Template text for 'flexberry-textbox' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{flexberry-file<br>' +
    '..value=model.file<br>' +
    '..showPreview=showPreview<br>' +
    '..showUploadButton=showUploadButton<br>' +
    '..showDownloadButton=showDownloadButton<br>' +
    '..maxUploadFileSize=maxUploadFileSize<br>' +
    '..placeholder=placeholder<br>' +
    '..uploadUrl=uploadUrl<br>' +
    '..showModalDialogOnUploadError=showModalDialogOnUploadError<br>' +
    '..showModalDialogOnDownloadError=showModalDialogOnDownloadError<br>' +
    '..errorModalDialogTitle=errorModalDialogTitle<br>' +
    '..errorModalDialogContent=errorModalDialogContent<br>' +
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
      settingName: 'showPreview',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'showPreview'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showUploadButton',
      settingType: 'boolean',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'showUploadButton'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showDownloadButton',
      settingType: 'boolean',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'showDownloadButton'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'maxUploadFileSize',
      settingType: 'string',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'maxUploadFileSize'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'placeholder',
      settingType: 'string',
      settingDefaultValue: this.get('i18n').t('components.flexberry-file.placeholder'),
      bindedControllerPropertieName: 'placeholder'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'uploadUrl',
      settingType: 'string',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'uploadUrl'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showModalDialogOnUploadError',
      settingType: 'boolean',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'showModalDialogOnUploadError'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showModalDialogOnDownloadError',
      settingType: 'boolean',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'showModalDialogOnDownloadError'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'errorModalDialogTitle',
      settingType: 'string',
      settingDefaultValue: this.get('i18n').t('components.flexberry-file.error-dialog-title'),
      bindedControllerPropertieName: 'errorModalDialogTitle'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'errorModalDialogContent',
      settingType: 'string',
      settingDefaultValue: this.get('i18n').t('components.flexberry-file.error-dialog-content'),
      bindedControllerPropertieName: 'errorModalDialogContent'
    });

    return componentSettingsMetadata;
  })
});
