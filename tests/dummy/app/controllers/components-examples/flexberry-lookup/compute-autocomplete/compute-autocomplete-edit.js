import BaseEditFormController from 'ember-flexberry/controllers/edit-form';
import EditFormControllerOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-controller-operations-indication';

export default BaseEditFormController.extend(EditFormControllerOperationsIndicationMixin, {
  /**
    Route name for transition after close edit form.

    @property parentRoute
    @type String
    @default 'ember-flexberry-dummy-application-user-list'
   */
  parentRoute: 'compute-autocomplete-list',

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
  getCellComponent: function(attr, bindingPath, model) {
    var cellComponent = this._super(...arguments);

    if (attr.kind === 'belongsTo') {
      if (model.modelName === 'ember-flexberry-dummy-localized-suggestion-type' && bindingPath === 'localization') {
        cellComponent.componentProperties = {
          projection: 'LocalizationL',
          displayAttributeName: 'name',
          title: 'Localization',
          relationName: 'localization',
          choose: 'showLookupDialog',
          remove: 'removeLookupValue'
        };
      }
    }

    return cellComponent;
  }
});
