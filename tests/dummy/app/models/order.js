import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-projections';

var Model = BaseModel.extend({
  shipName: DS.attr('string'),
  shipCountry: DS.attr('string'),
  orderDate: DS.attr('date'),

  // Inversed relationship for employee.orders. It's not a property for Lookup component.
  employee: DS.belongsTo('employee', { inverse: 'orders', async: false }),

  customer: DS.belongsTo('customer', { inverse: null, async: false }),

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
  }, { hidden: true }),
  customer: Proj.belongsTo('customer', 'Customer', {
    contactName: Proj.attr('Contact Name', { hidden: true })
  }, { displayMemberPath: 'contactName' })
});

Model.defineProjection('OrderL', 'order', {
  shipName: Proj.attr('Ship Name'),
  shipCountry: Proj.attr('Ship Country'),
  orderDate: Proj.attr('Order Date')
});

export default Model;
