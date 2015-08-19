// Remove commented out lines, when they will be covered with tests.
/*import Ember from 'ember';*/
import DS from 'ember-data';
/*import config from '../config/environment';*/
import ProjectedModel from './projected-model';

var Model = ProjectedModel.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  birthDate: DS.attr('date'),
  employee1: DS.belongsTo('employee', { inverse: null, async: false }),
  orders: DS.hasMany('order', { inverse: null, async: false }),
  /*tmpChildren: DS.hasMany('employee', { inverse: null, async: false }),*/

  // validation rules.
  validations: {
    firstName: {
      presence: true,
      length: { minimum: 5 }
    },
    lastName: {
      presence: true,
      length: { minimum: 5 }
    }
  }
});

/*Ember.$.mockjax({
  url: "*Employees(3)",
  responseText: {
    "EmployeeID": 3,
    "FirstName": "Janet225 Oo",
    "LastName": "Leverling",
    "BirthDate": "1963-08-30T00:00:00Z",
    "Employee1": 2,
    "TmpChildren": [4,5]
  }
});*/

Model.defineProjection('employee', 'EmployeeE', ['firstName', 'lastName', 'birthDate', 'employee1.firstName', 'orders.shipName', 'orders.shipCountry', 'orders.orderDate'/*, 'tmpChildren.lastName'*/]);
Model.defineProjection('employee', 'EmployeeL', ['firstName', 'lastName']);

// TODO: defineProjection tests.
// Model.reopenClass({
//   Projections: ModelProjectionsCollection.create({
//     EmployeeE: ModelProjection.create({
//       type: 'employee',
//       name: 'EmployeeE',
//       properties: ['firstName', 'lastName', 'birthDate', 'employee1'/*, 'tmpChildren'*/],
//       masters: ModelProjectionsCollection.create({
//         employee1: ModelProjection.create({
//           type: 'employee',
//           name: 'EmployeeE.masters.employee1',
//           properties: ['firstName']
//         })
//       })/*,
//       details: ModelProjectionsCollection.create({
//         tmpChildren: ModelProjection.create({
//           type: 'employee',
//           name: 'EmployeeE.details.tmpChildren',
//           properties: ['lastName']
//         })
//       })*/
//     }),
//     EmployeeL: ModelProjection.create({
//       type: 'employee',
//       name: 'EmployeeL',
//       properties: ['firstName', 'lastName']
//     })
//   })
// });

export default Model;
