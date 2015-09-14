import DS from 'ember-data';
import ProjectedModel from './projected-model';
import Proj from '../utils/projection-attributes';

var Model = ProjectedModel.extend({
  shipName: DS.attr('string'),
  shipCountry: DS.attr('string'),
  orderDate: DS.attr('date'),
  employee: DS.belongsTo('employee', { inverse: null, async: false }),

  // Validation rules.
  validations: {
    orderDate: {
      presence: true
    }
  }
});

Model.defineProjection('OrderE', 'order', {
  shipName: Proj.attr('Ship Name'),
  shipCountry: Proj.attr('Ship Country'),
  orderDate: Proj.attr('Order Date'),
  employee: Proj.belongsTo('employee', {
    firstName: Proj.attr('Employee First Name'),
    lastName: Proj.attr('Employee Last Name')
  })
});

Model.defineProjection('OrderL', 'order', {
  shipName: Proj.attr('Ship Name'),
  shipCountry: Proj.attr('Ship Country'),
  orderDate: Proj.attr('Order Date')
});

export default Model;
