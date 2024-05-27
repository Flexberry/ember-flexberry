import EditFormController from 'ember-flexberry/controllers/edit-form';
import config from 'dummy/config/environment';
import { computed } from '@ember/object';

export default EditFormController.extend({
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
    Modal dialog loading params

    @property loadingParams
    @type Object
  */
  loadingParams: computed(function () {
    return {outlet: 'editrecord-modal'}
  }),

  actions: {
    showModal() {
      this.send('showModalDialog', 'modal/flexberry-file-in-modal', { controller: 'components-examples/flexberry-file/flexberry-file-in-modal' }, this.get('loadingParams'));
    },

    closeModalDialog() {
      //close this modal window
      this.send('removeModalDialog', this.get('loadingParams'));
    },
  }
});
