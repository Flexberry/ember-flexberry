import DS from 'ember-data';
import ProjectedModel from './projected-model';

var Model = ProjectedModel.extend({
  orderDate: DS.attr('date'),
  employeeID: DS.belongsTo('employee', { inverse: null, async: true })
});

Model.defineProjection('order', 'OrderE', ['orderDate', 'employeeID.firstName']);
Model.defineProjection('order', 'OrderL', ['orderDate']);

export default Model;
