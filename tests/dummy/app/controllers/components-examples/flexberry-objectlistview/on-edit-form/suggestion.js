import BaseEditFormController from 'ember-flexberry/controllers/edit-form';
import EditFormControllerOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-controller-operations-indication';

export default BaseEditFormController.extend(EditFormControllerOperationsIndicationMixin, {
  /**
    Route name for transition after close edit form.

    @property parentRoute
    @type String
    @default 'ember-flexberry-dummy-suggestion-list'
   */
  parentRoute: 'components-examples/flexberry-objectlistview/on-edit-form',

  /**
    Name of model.comments edit route.

    @property commentsEditRoute
    @type String
    @default 'ember-flexberry-dummy-comment-edit'
   */
  commentsEditRoute: 'ember-flexberry-dummy-comment-edit',

  /** Добавить комментарий о том, что происходит  */
  listOnEditform: null,

  listLocalizedSuggestionType() {
    let modelName = this.get('ember-flexberry-dummy-localized-suggestion-type');
    let modelProjection = this.get('LocalizedSuggestionTypeE');
    let relation = 'suggestionType.name';
    this.set('listOnEditform', this.getListLocalizedSuggestionType(modelName, modelProjection, relation));
  },

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
            displayAttributeName: 'name',
            required: true,
            relationName: 'author',
            projection: 'ApplicationUserL',
            autocomplete: true,
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

  init() {
    this._super(...arguments);

    this.get('lookupEventsService').on('lookupDialogOnHidden', this, this._setModalIsHidden);
  },

  _setModalIsHidden(componentName) {
    let componentName = 'SuggestionEditType';
    if (this.get('componentName') === componentName) {
      this.get();
    }
  },

  willDestroy() {
    this._super(...arguments);
    this.get('lookupEventsService').off('lookupDialogOnHidden', this, this._setModalIsHidden);
  },

});
