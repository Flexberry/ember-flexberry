import { observer, computed } from '@ember/object';
import BaseEditFormController from 'ember-flexberry/controllers/edit-form';
import EditFormControllerOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-controller-operations-indication';
import { StringPredicate } from 'ember-flexberry-data/query/predicate';

export default BaseEditFormController.extend(EditFormControllerOperationsIndicationMixin, {
  /**
    Route name for transition after close edit form.

    @property parentRoute
    @type String
    @default 'ember-flexberry-dummy-suggestion-list'
   */
  parentRoute: 'components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-list-groupedit-with-lookup-with-computed-atribute',

  /**
    Name of model.comments edit route.

    @property commentsEditRoute
    @type String
    @default 'ember-flexberry-dummy-comment-edit'
   */
  commentsEditRoute: 'ember-flexberry-dummy-comment-edit',

  checkboxValue: false,

  fieldvalue: 'Vasya',

  lookupReadonly: observer('checkboxValue', function() {
    this.set('lookupDynamicProperties.readonly', this.get('checkboxValue'));
  }),

  lookupLimitFunction: observer('fieldvalue', function() {
    this.set('lookupDynamicProperties.lookupLimitPredicate', new StringPredicate('name').contains(this.get('fieldvalue')));
  }),

  /**
    An object with properties for the component `flexberry-lookup` in the component `flexberry-groupedit`.

    @property lookupDynamicProperties
    @type Object
    @readOnly
  */
  lookupDynamicProperties: computed(function() {
    let lookupLimitPredicate;
    let fieldvalue = this.get('fieldvalue');
    if (fieldvalue) {
      lookupLimitPredicate = new StringPredicate('name').contains(fieldvalue);
    }

    return {
      choose: 'showLookupDialog',
      remove: 'removeLookupValue',
      displayAttributeName: 'name',
      required: true,
      relationName: 'author',
      projection: 'ApplicationUserL',
      autocomplete: true,
      readonly: this.get('checkboxValue'),
      lookupLimitPredicate,
    };
  }).readOnly(),

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
          cellComponent.componentProperties = this.get('lookupDynamicProperties');
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
    }

    return cellComponent;
  }
});
