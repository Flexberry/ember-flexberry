// Remove commented out lines, when they will be covered with tests.
/*import Ember from 'ember';*/
import DS from 'ember-data';
import ProjectedModel from './projected-model';

var Model = ProjectedModel.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  birthDate: DS.attr('date'),
  reportsTo: DS.belongsTo('employee', { inverse: null, async: true }),
  /*tmpChildren: DS.hasMany('employee', { inverse: null, async: true }),*/

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
    "@odata.context": "http://northwindodata.azurewebsites.net/odata/$metadata#Employees(EmployeeID,FirstName,LastName,BirthDate,ReportsTo)/$entity",
    "EmployeeID": 3,
    "FirstName": "Janet225 Oo",
    "LastName": "Leverling",
    "BirthDate": "1963-08-30T00:00:00Z",
    "ReportsTo": 2,
    "TmpChildren": [4,5]
  }
});*/

Model.defineProjection('employee', 'EmployeeE', ['firstName', 'lastName', 'birthDate', 'reportsTo.firstName'/*, 'tmpChildren.lastName'*/]);
Model.defineProjection('employee', 'EmployeeL', ['firstName', 'lastName']);

// TODO: defineProjection tests.
// Model.reopenClass({
//   Projections: ModelProjectionsCollection.create({
//     EmployeeE: ModelProjection.create({
//       type: 'employee',
//       name: 'EmployeeE',
//       properties: ['firstName', 'lastName', 'birthDate', 'reportsTo'/*, 'tmpChildren'*/],
//       masters: ModelProjectionsCollection.create({
//         reportsTo: ModelProjection.create({
//           type: 'employee',
//           name: 'EmployeeE.masters.reportsTo',
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
