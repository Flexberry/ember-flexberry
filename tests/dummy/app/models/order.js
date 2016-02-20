import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-projections';

var Model = BaseModel.extend({
  shipVia: DS.attr('number', { defaultValue: 0, isOrderAttribute: true }),
  shipName: DS.attr('string'),
  shipCountry: DS.attr('string'),
  orderDate: DS.attr('date'),
  employee: DS.belongsTo('employee', { inverse: null, async: false }),

  // Validation rules.
  validations: {
    orderDate: {
      datetime: { allowBlank: false, messages: { blank: 'order date can\'t be blank', invalid: 'please input valid date' } }
    }
  }
});

Model.defineProjection('OrderE', 'order', {
  shipName: Proj.attr('Ship Name'),
  shipCountry: Proj.attr('Ship Country'),
  orderDate: Proj.attr('Order Date'),
  employee: Proj.belongsTo('employee', 'Employee', {
    firstName: Proj.attr('Employee First Name'),
    lastName: Proj.attr('Employee Last Name')
  }, { hidden: true })
});

Model.defineProjection('OrderL', 'order', {
  shipName: Proj.attr('Ship Name'),
  shipCountry: Proj.attr('Ship Country'),
  orderDate: Proj.attr('Order Date')
});

export default Model;
