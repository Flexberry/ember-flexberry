import { set } from '@ember/object';
import { Promise } from 'rsvp';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import { translationMacro as t } from 'ember-i18n';

export default EditFormController.extend({

  title: t('forms.application.delete-rows-modal-dialog.delete-rows-caption'),

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

    /**
      Confirm delete rows.

      @param {Object} data Row data.
    */
    confirmDeleteRows() {
      return new Promise((resolve, reject) => {
        this.set('approveDeleting', resolve);
        this.set('denyDeleting', reject);

        this.send('showModalDialog', 'delete-rows-modal-dialog', {
          controller: 'components-examples/flexberry-groupedit/configurate-row-example'
        });
      });
    },

    /**
      Close modal dialog and clear actions.
    */
    closeModalDialog() {
      this.set('approveDeleting', null);
      this.set('denyDeleting', null);

      this.send('removeModalDialog');
    },
  }
});
