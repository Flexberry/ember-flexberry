import DS from 'ember-data';
import ProjectedModel from './projected-model';

var Model = ProjectedModel.extend({
  shipName: DS.attr('string'),
  shipCountry: DS.attr('string'),
  orderDate: DS.attr('date'),
  employee: DS.belongsTo('employee', { inverse: null, async: false }),

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
  'employee.firstName',
  'employee.lastName'
]);

Model.defineProjection('order', 'OrderL', [
  'shipName',
  'shipCountry',
  'orderDate'
]);

export default Model;
