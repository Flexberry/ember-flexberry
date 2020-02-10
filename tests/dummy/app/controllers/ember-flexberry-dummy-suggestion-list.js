import ListFormController from 'ember-flexberry/controllers/list-form';
import ListFormControllerOperationsIndicationMixin from '../mixins/list-form-controller-operations-indication';
import { translationMacro as t } from 'ember-i18n';

export default ListFormController.extend(ListFormControllerOperationsIndicationMixin, {
  /**
    Name of related edit form route.

    @property editFormRoutes
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

    beforeDeleteRecord: function() {
      return new Promise((resolve, reject) => {
        // Сохраняем функции для резолва или реджекта промиса
        // Сохраняем до рендера шаблона, что бы во время рендера они уже были
        this.set('approve', resolve);
        this.set('deny', reject);

        // Рендерим шаблон
        this.send('showModalDialog', 'modal-dilogs/delete-record-modal-dialog', {
          controller: 'ember-flexberry-dummy-suggestion-list'
        });
      });
    },

    closeModalDialog() {
      // Очищаем сохраненные функции
      this.set('approve', null);
      this.set('deny', null);

      // Очищаем оутлет куда рендерился шаблон
      this.send('removeModalDialog');
    },
  },
});
