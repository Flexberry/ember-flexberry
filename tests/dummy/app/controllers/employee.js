import Ember from 'ember';
import EditFormController from './edit-form';

export default EditFormController.extend({
  // Caption of this particular edit form.
  title: 'Employee',

  /**
   * Route edit order for group edit
   *
   * @property routeForEditOrder
   * @type String
   * @default 'order'
   */
  routeForEditOrder: 'order',

  getCellComponent: function(attr, bindingPath, model) {
    var cellComponent = this._super(...arguments);

    if (attr.kind === 'belongsTo' && attr.modelName === 'customer') {
      cellComponent.componentProperties = {
        choose: 'showLookupDialog',
        remove: 'removeLookupValue',
        relationName: 'customer',
        projection: 'CustomerL',
        title: 'Customer'
      };
    }

    return cellComponent;
  },

  /**
   * Current function to limit accessible values of model employee1.
   *
   * @property lookupLimitFunction
   * @type String
   * @default undefined
   */
  lookupLimitFunction: Ember.computed('model.employee1', function() {
    let currentLookupValue = this.get('model.employee1');
    if (currentLookupValue) {
      let currentLookupText = this.get('model.employee1.firstName');
      return 'FirstName ge \'' + currentLookupText + '\'';
    }

    return undefined;
  })
});
