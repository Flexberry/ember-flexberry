import Ember from 'ember';
import DS from 'ember-data';

var Model = DS.Model.extend({
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    birthDate: DS.attr('date'),
    reportsTo: DS.belongsTo('employee', { inverse: null, async: true }),
    tmpChildren: DS.hasMany('employee', { inverse: null, async: true }),

    _view: DS.attr()
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
    // TODO: DataObjectView = Ember.Object.extend or mixin?
    Views: {
        EmployeeE: {
            type: 'employee',
            name: 'EmployeeE',
            properties: ['firstName', 'lastName', 'birthDate', 'reportsTo', 'tmpChildren'],
            masters: {
                reportsTo: {
                    type: 'employee',
                    name: '~masterview',
                    properties: ['firstName']
                }
            },
            details: {
                tmpChildren: {
                    type: 'employee',
                    name: '~detailview',
                    properties: ['lastName']
                }
            }
        },
        EmployeeL: {
            type: 'employee',
            name: 'EmployeeL',
            properties: ['firstName', 'lastName']
        }
    }
});

export default Model;
