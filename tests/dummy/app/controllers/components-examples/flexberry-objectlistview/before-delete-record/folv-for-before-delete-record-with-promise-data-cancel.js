import Ember from 'ember';
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
      return new Ember.RSVP.Promise((resolve) => {
        this.set('recordWasNotDelete', !record.get('isDeleted'));
        data.cancel = true;
        resolve();
      });
    }
  }
});
