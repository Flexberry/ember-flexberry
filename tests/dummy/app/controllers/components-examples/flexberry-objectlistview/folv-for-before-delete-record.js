import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({
  actions: {
    beforeDeleteRecord(record, data) {
      return;
    }
  }
});
