import BaseEditFormController from 'ember-flexberry/controllers/edit-form';
import EditFormControllerOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-controller-operations-indication';
import { translationMacro as t } from 'ember-i18n';

export default BaseEditFormController.extend(EditFormControllerOperationsIndicationMixin, {
  /**
    Route name for transition after close edit form.

    @property parentRoute
    @type String
    @default 'ember-flexberry-dummy-suggestion-list'
   */
  parentRoute: 'ember-flexberry-dummy-suggestion-list',

  /**
    Name of model.comments edit route.

    @property commentsEditRoute
    @type String
    @default 'ember-flexberry-dummy-comment-edit'
   */
  commentsEditRoute: 'ember-flexberry-dummy-comment-edit',

  title: t('forms.application.flexberry-objectlistview-modal-question-caption.delete-at-editform-question-caption'),
  /**
    Method to get type and attributes of a component,
    which will be embeded in object-list-view cell.

    @method getCellComponent.
    @param {Object} attr Attribute of projection property related to current table cell.
    @param {String} bindingPath Path to model property related to current table cell.
    @param {DS.Model} modelClass Model class of data record related to current table row.
    @return {Object} Object containing name & properties of component, which will be used to render current table cell.
    { componentName: 'my-component',  componentProperties: { ... } }.
   */
  getCellComponent(attr, bindingPath, model) {
    let cellComponent = this._super(...arguments);
    if (attr.kind === 'belongsTo') {
      switch (`${model.modelName}+${bindingPath}`) {
        case 'ember-flexberry-dummy-vote+author':
          cellComponent.componentProperties = {
            choose: 'showLookupDialog',
            remove: 'removeLookupValue',
            preview: 'previewLookupValue',
            displayAttributeName: 'name',
            required: true,
            relationName: 'author',
            projection: 'ApplicationUserL',
            autocomplete: true,
            showPreviewButton: true,
            previewFormRoute: 'ember-flexberry-dummy-application-user-edit'
          };
          break;

        case 'ember-flexberry-dummy-comment+author':
          cellComponent.componentProperties = {
            choose: 'showLookupDialog',
            remove: 'removeLookupValue',
            displayAttributeName: 'name',
            required: true,
            relationName: 'author',
            projection: 'ApplicationUserL',
            autocomplete: true,
          };
          break;

      }
    } else if (attr.kind === 'attr') {
      switch (`${model.modelName}+${bindingPath}`) {
        case 'ember-flexberry-dummy-vote+author.eMail':
          cellComponent.componentProperties = {
            readonly: true,
          };
      }
    }

    return cellComponent;
  },

  actions: {
    delete(skipTransition) {  
      // Сохраняем функции для резолва или реджекта промиса
      // Сохраняем до рендера шаблона, что бы во время рендера они уже были
      this.set('approve', ()=>{this.delete(skipTransition)});
      this.set('deny',()=>{});

      // Рендерим шаблон
      this.send('showModalDialog', 'modal-dilogs/delete-record-modal-dialog', {
        controller: 'ember-flexberry-dummy-suggestion-edit'
      });
    },
    
    closeModalDialog() {
      // Очищаем сохраненные функции
      this.set('approve', null);
      this.set('deny', null);

      // Очищаем оутлет куда рендерился шаблон
      this.send('removeModalDialog');
    }
  }
});
