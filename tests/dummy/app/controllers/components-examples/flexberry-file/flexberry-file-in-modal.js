import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import config from 'dummy/config/environment';

export default EditFormController.extend({
  /**
    Defaul style of modal context.

    @property readonly
    @type String
    @default #example
  */
  _style:'#example',

  /**
    File upload URL for 'flexberry-file' component 'uploadUrl' property.

    @property uploadUrl
    @type String
   */
  uploadUrl: config.APP.components.flexberryFile.uploadUrl,

  /**
    Flag for 'flexberry-file' component 'showPreview' property.

    @property showPreview
    @type Boolean
   */
  showPreview: true,

  /**
    Flag for 'flexberry-file' component 'showUploadButton' property.

    @property showUploadButton
    @type Boolean
   */
  showUploadButton: true,

  /**
    Flag for 'flexberry-file' component 'showDownloadButton' property.

    @property showDownloadButton
    @type Boolean
   */
  showDownloadButton: true,

  /**
    Settings for preview modal dialog.

    @property previewSettings
    @type Object
  */
  previewSettings: {
    detachable: true,
    context: 'body',
  },

  actions: {
    modalWindow(style) {
      if (!Ember.isNone(style)) {
        this.set('_style', style);
      }

      let repeatWindow = Ember.$('#repeat-window').modal({
        closable: false,
        autofocus: false,
        detachable: true,
        allowMultiple: true,
      });

      this.set('repeatWindow', repeatWindow);
      this.get('repeatWindow').modal('show').modal('refresh');
    },

    logOut() {
      this.get('repeatWindow').modal('hide');
    },
  }
});
