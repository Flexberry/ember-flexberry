import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-projections';

var Model = BaseModel.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  birthDate: DS.attr('date'),

  // This property for Lookup component. No inverse relationship here.
  employee1: DS.belongsTo('employee', { inverse: null, async: false }),

  // This property for GroupEdit component.
  orders: DS.hasMany('order', { inverse: 'employee', async: false }),

  // Validation rules.
  validations: {
    firstName: {
      presence: true,
      length: { minimum: 5 }
    },
    lastName: {
      presence: true,
      length: { minimum: 5 }
    },
    birthDate: {
      datetime: true
    }
  }
});

Model.defineProjection('EmployeeE', 'employee', {
  firstName: Proj.attr('First Name'),
  lastName: Proj.attr('Last Name'),
  birthDate: Proj.attr('Birth Date'),
  employee1: Proj.belongsTo('employee', 'Reports To', {
    firstName: Proj.attr('Reports To - First Name'),
    lastName: Proj.attr('Reports To - Last Name', { hidden: true })
  }, { hidden: true }),
  orders: Proj.hasMany('order', 'Orders', {
    shipName: Proj.attr('Ship Name'),
    shipCountry: Proj.attr('Ship Country'),
    orderDate: Proj.attr('Order Date'),
    customer: Proj.belongsTo('customer', 'Customer', {
      contactName: Proj.attr('Contact Name', { hidden: true })
    }, { displayMemberPath: 'contactName' })
  })
});

Model.defineProjection('EmployeeL', 'employee', {
  firstName: Proj.attr('First Name'),
  lastName: Proj.attr('Last Name'),
  employee1: Proj.belongsTo('employee', 'Reports To', {
    firstName: Proj.attr('Reports To - First Name', { hidden: true })
  }, { displayMemberPath: 'firstName' })
});

export default Model;
