import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({


  actions: {
    /**
      Adds detail to the end of the array.

      @method actions.addDetail.
    */
    addSigner() {
      let store = this.get('store');
      let detailModel = this.get('model');
      let newRecord = store.createRecord('ember-flexberry-dummy-suggestion',
      {
        text: "itemsCounterkgkgkgk"
      });
      detailModel.addObject(newRecord);
    },
  },

});
