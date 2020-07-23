import ListFormController from 'ember-flexberry/controllers/list-form';
import ListFormControllerOperationsIndicationMixin from '../mixins/list-form-controller-operations-indication';
import { translationMacro as t } from 'ember-i18n';
import RSVP from 'rsvp';

import { A } from '@ember/array';
import { scheduleOnce } from '@ember/runloop';

export default ListFormController.extend(ListFormControllerOperationsIndicationMixin, {
  /**
    Name of related edit form route.

    @property editFormRoute
    @type String
    @default 'ember-flexberry-dummy-suggestion-edit'
   */
  editFormRoute: 'ember-flexberry-dummy-suggestion-edit',

  exportExcelProjection: 'SuggestionL',

  title: t('forms.application.flexberry-objectlistview-modal-question-caption.delete-at-listform-question-caption'),

  _promises : A(),

  showDeleteModalDialog: function() {
    this.send('showModalDialog', 'modal/delete-record-modal-dialog', {
      controller: 'ember-flexberry-dummy-suggestion-list'
    });
  },

  actions: {
    approveDeleting() {
      const promises = this.get('_promises');
      promises.forEach(p => p.resolve());
      promises.clear();
    },

    denyDeleting() {
      const promises = this.get('_promises');
      promises.forEach(p => p.reject());
      promises.clear();
    },

    /**
      Hook that executes before deleting all records on all pages.
      Need to be overriden in corresponding application controller.
    */
    beforeDeleteAllRecords(modelName, data) {
      data.cancel = false;
    },

    /**
      Show delete modal dialog before deleting.
    */
    beforeDeleteRecord: function() {
      scheduleOnce('afterRender', this, this.showDeleteModalDialog);
      return new RSVP.Promise((resolve, reject) => {
        this.get('_promises').pushObject({ resolve, reject });
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
  },
});
