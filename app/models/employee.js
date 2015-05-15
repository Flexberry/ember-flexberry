import Ember from 'ember';
import DS from 'ember-data';
import DataObjectViewsCollection from '../objects/data-object-views-collection';
import DataObjectView from '../objects/data-object-view';
import IdProxy from '../utils/idproxy';

var Model = DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  birthDate: DS.attr('date'),
  reportsTo: DS.belongsTo('employee', { inverse: null, async: true }),
  tmpChildren: DS.hasMany('employee', { inverse: null, async: true }),

  primaryKey: Ember.computed('id', {
    get: function() {
      var id = this.get('id');
      if (id === null) {
        // id isn't setted in newly created records.
        return null;
      }

      if (IdProxy.idIsProxied(id)) {
        return IdProxy.retrieve(id).id;
      } else {
        return id;
      }
    }
  }),

  // TODO: remove this. Use projection instead.
  _view: DS.attr(),

  projectionName: DS.attr('string'),

  // TODO: computed by id: retrieve viewname from id. Remove projectionName.
  projection: Ember.computed('projectionName', {
    get: function() {
      var projName = this.get('projectionName');
      if (!projName) {
        return null;
      }

      var projCollection = this.constructor.Views;
      if (!projCollection) {
        throw new Error(`Unable to get projection '${projName}': ` +
                        `projections are not defined in ${this.constructor}.`);
      }

      var proj = projCollection.get(projName);
      if (!proj) {
        throw new Error(`Projection '${projName}' is not found in ${this.constructor}.`);
      }

      return proj;
    }
  })
});

Ember.$.mockjax({
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
});

Model.reopenClass({
  // TODO: rename Views to Projections.
  Views: DataObjectViewsCollection.create({
    EmployeeE: DataObjectView.create({
      type: 'employee',
      name: 'EmployeeE',
      properties: ['firstName', 'lastName', 'birthDate', 'reportsTo', 'tmpChildren'],
      masters: DataObjectViewsCollection.create({
        reportsTo: DataObjectView.create({
          type: 'employee',
          name: 'EmployeeE.masters.reportsTo',
          properties: ['firstName']
        })
      }),
      details: DataObjectViewsCollection.create({
        tmpChildren: DataObjectView.create({
          type: 'employee',
          name: 'EmployeeE.details.tmpChildren',
          properties: ['lastName']
        })
      })
    }),
    EmployeeL: DataObjectView.create({
      type: 'employee',
      name: 'EmployeeL',
      properties: ['firstName', 'lastName']
    })
  })
});

export default Model;
