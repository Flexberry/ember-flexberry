import DS from 'ember-data';
import ProjectedModel from './projected-model';

var Model = ProjectedModel.extend({
  shipName: DS.attr('string'),
  shipCountry: DS.attr('string'),
  orderDate: DS.attr('date'),
  employeeID: DS.belongsTo('employee', { inverse: null, async: false }),

  // validation rules.
  validations: {
    orderDate: {
      presence: true
    }
  }
});

Model.defineProjection('order', 'OrderE', [
  'shipName',
  'shipCountry',
  'orderDate',
  'employeeID.firstName',
  'employeeID.lastName'
]);

Model.defineProjection('order', 'OrderL', [
  'shipName',
  'shipCountry',
  'orderDate'
]);

export default Model;
