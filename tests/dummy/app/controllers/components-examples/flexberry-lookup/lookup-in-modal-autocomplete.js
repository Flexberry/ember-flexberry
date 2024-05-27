import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  /**
    Defaul style of modal context.

    @property readonly
    @type String
    @default #example
  */
  _style:'#example',

  modalDialog: false,

  actions: {
    showModal() {
      this.send('showModalDialog', 'modal/lookup-in-modal-autocomplete-dialog', {
        controller: 'components-examples/flexberry-lookup/lookup-in-modal-autocomplete'
      });
    },

    hideModal() {
      this.get('repeatWindow').modal('hide');
    }
  }
});
