import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({

  /**
    Flag indicates that component have to check on model changes and display it.

    @property searchForContentChange
    @type Boolean
    @default true
  */
  searchForContentChange: true,

  actions: {
    addRecord() {
      let store = this.get('store');
      let model = this.get('model');
      let newRecord = store.createRecord('ember-flexberry-dummy-suggestion',
      {
        text: 'modelRecord'
      });
      model.addObject(newRecord);
    },
  },

});
