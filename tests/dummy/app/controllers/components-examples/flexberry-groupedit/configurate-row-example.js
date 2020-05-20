import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({

  /**
    Configurate rows 'flexberry-groupedit' component by address.

    @property configurateRowByFlag
    @type String
  */
  configurateRowByFlag: 1,

  /**
    Current records.

    @property _records
    @type Object[]
    @protected
    @readOnly
  */
  records: [],

  actions: {
    /**
      Configurate rows on the condition.
    */
    configurateRow(rowConfig, record) {
      if (record) {
        this.get('records').push(record);
      }

      if (record.get('flag') === this.get('configurateRowByFlag')) {
        Ember.set(rowConfig, 'canBeDeleted', false);
      }
    },

    /**
      Confirm delete rows.
    */
    confirmDeleteRows(data) {
      return new Ember.RSVP.Promise((resolve) => {
        data.cancelDelete=true;
        resolve();
      });
    }
  },

});
