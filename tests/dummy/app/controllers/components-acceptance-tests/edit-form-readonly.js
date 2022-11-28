 import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  /**
    Flag: indicates whether the form is in readonly mode or not.

    @property readonly
    @type Boolean
    @default true
   */
  readonly: true,

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
  getCellComponent: function(attr, bindingPath) {
    let cellComponent = this._super(...arguments);

    if (attr.kind === 'belongsTo' && bindingPath === 'master') {
      cellComponent.componentProperties = {
        projection: 'MasterL',
        displayAttributeName: 'text',
        title: 'Master',
        relationName: 'master',
        choose: 'showLookupDialog',
        remove: 'removeLookupValue'
      };
    }

    if (bindingPath === 'longText') {
      return {
        componentName: 'flexberry-textarea',
        componentProperties: {
        }
      };
    }

    if (bindingPath === 'date') {
      return {
        componentName: 'flexberry-simpledatetime',
        componentProperties: {
          type: 'date'
        }
      };
    }

    if (attr.kind === 'belongsTo' && bindingPath === 'masterDropdown') {
      cellComponent.componentProperties = {
        projection: 'MasterDropdownL',
        displayAttributeName: 'text',
        title: 'Master dropdown',
        relationName: 'masterDropdown',
        choose: 'showLookupDialog',
        remove: 'removeLookupValue'
      };
    }

    return cellComponent;
  }
});
