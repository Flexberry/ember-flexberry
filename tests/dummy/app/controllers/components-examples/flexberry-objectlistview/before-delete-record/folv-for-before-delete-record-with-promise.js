import ListFormController from 'ember-flexberry/controllers/list-form';
import RSVP from 'rsvp';

export default ListFormController.extend({

  /**
    Parameter for use in the test beforeDeleteRecord.

    @property recordWasNotDelete
    @type bool
    @default false
   */
  recordWasNotDelete: false,

  actions: {
    /* eslint-disable no-unused-vars */
    beforeDeleteRecord(record, data) {
      return new RSVP.Promise((resolve) => {
        this.set('recordWasNotDelete', !record.get('isDeleted'));
        resolve();
      });
    }
    /* eslint-enable no-unused-vars */
}
});
