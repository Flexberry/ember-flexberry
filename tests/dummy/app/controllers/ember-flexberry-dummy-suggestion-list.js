import ListFormController from 'ember-flexberry/controllers/list-form';
import ListFormControllerOperationsIndicationMixin from '../mixins/list-form-controller-operations-indication';
import { translationMacro as t } from 'ember-i18n';
import RSVP from 'rsvp';

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

  actions: {
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
      return new RSVP.Promise((resolve, reject) => {
        // Continue deletion when accepting modal dialog.
        this.set('approve', resolve);

        // Stops deletion when a modal dialog is canceled.
        this.set('deny', reject);

        this.send('showModalDialog', 'modal/delete-record-modal-dialog', {
          controller: 'ember-flexberry-dummy-suggestion-list'
        });
      });
    },

    /**
      Close modal dialog and clear actions.
    */
    closeModalDialog() {
      this.set('approve', null);
      this.set('deny', null);

      this.send('removeModalDialog');
    },
  },
});
