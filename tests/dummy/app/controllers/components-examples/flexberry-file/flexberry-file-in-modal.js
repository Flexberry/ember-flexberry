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

  actions: {
    modalWindow(style) {
      if (!Ember.isNone(style)) {
        this.set('_style', style);
      }

      let repeatWindow = Ember.$('#repeat-window').modal({
        closable: false,
        autofocus: false,
        detachable: false,
        allowMultiple: true,
        context: this.get('_style'),
      });
      this.set('repeatWindow', repeatWindow);
      this.get('repeatWindow').modal('show').modal('refresh');
    },

    modalWindowDouble(style) {
      if (!Ember.isNone(style)) {
        this.set('_style', style);
      }

      let repeatWindow = Ember.$('#repeat-window-double').modal({
        closable: false,
        autofocus: false,
        detachable: false,
        allowMultiple: true,
        context: this.get('_style'),
      });
      this.set('repeatWindowdouble', repeatWindow);
      this.get('repeatWindowdouble').modal('show').modal('refresh');
    },

    logOut() {
      this.get('repeatWindow').modal('hide');
    },

    logOutDouble() {
      this.get('repeatWindowdouble').modal('hide');
    }

  }
});
