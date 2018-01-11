import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({

  /**
    Parameter for use in the test beforeDeleteRecord.

    @property recordWasNotDelete
    @type bool
    @default false
   */
  recordWasNotDelete: false,

  actions: {
    beforeDeleteRecord(record, data) {
      this.set('recordWasNotDelete', !record.get('isDeleted'));
      return;
    }
  }
});
