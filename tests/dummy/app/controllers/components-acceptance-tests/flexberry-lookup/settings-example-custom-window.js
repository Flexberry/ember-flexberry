import EditFormController from 'ember-flexberry/controllers/edit-form';
import Ember from 'ember';

export default EditFormController.extend({
  filterProjectionName: undefined,
  projectionName: 'ApplicationUserL',

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
      let updateLookupValue = this.get('actions.updateLookupValue').bind(this);
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
            lookupWindowCustomProperties: Ember.get(this, 'actions.getLookupFolvPropertiesForAuthor'),
            updateLookupValue: updateLookupValue
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
            lookupWindowCustomProperties: Ember.get(this, 'actions.getLookupFolvPropertiesForGroupEdit'),
            updateLookupValue: updateLookupValue
          };
          break;

      }
    }

    return cellComponent;
  },

  actions: {
    /**
      This method returns custom properties for lookup window.
      @method getLookupFolvProperties

      @return {Object} Set of options for lookup window.
     */
    getLookupFolvProperties: function() {
      return {
        filterButton: true,
        filterProjectionName: Ember.get(this, 'filterProjectionName')
      };
    },

    /**
      This method returns custom properties for lookup window.
      @method getLookupFolvPropertiesForAuthor

      @return {Object} Set of options for lookup window.
     */
    getLookupFolvPropertiesForAuthor: function() {
      return {
        filterButton: true
      };
    },

    /**
      This method returns custom properties for lookup window.
      @method getLookupFolvProperties

      @return {Object} Set of options for lookup window.
     */
    getLookupFolvPropertiesForGroupEdit: function() {
      return {
        filterButton: true,
        filterProjectionName: 'TestLookupCustomWindow'
      };
    }
  }
});
