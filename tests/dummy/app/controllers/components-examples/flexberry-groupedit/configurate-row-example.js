import { set } from '@ember/object';
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
  records: undefined,

  init() {
    this._super(...arguments);
    this.set('records', []);
  },

  actions: {
    /**
      Configurate rows on the condition.
    */
    configurateRow(rowConfig, record) {
      if (record) {
        this.get('records').push(record);
      }

      set(rowConfig, 'canBeDeleted', record.get('flag') !== this.get('configurateRowByFlag'));
    },
  },

});
