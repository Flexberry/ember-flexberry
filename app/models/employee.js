import DS from 'ember-data';

var Model = DS.Model.extend({
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    birthDate: DS.attr('date'),
    //employee1: DS.belongsTo('employee', { inverse: 'employees1' }),
    //employees1: DS.hasMany('employee', { inverse: 'employee1' })
    reportsTo: DS.belongsTo('employee', { inverse: null, async: true }),
    //tmpChildren: DS.hasMany('employee', { inverse: null, async: true }),

    _view: DS.attr()
});

Model.reopenClass({
    // TODO: DataObjectView = Ember.Object.extend or mixin?
    Views: {
        EmployeeE: {
            type: 'employee',
            name: 'EmployeeE',
            properties: ['firstName', 'lastName', 'birthDate', 'reportsTo'],
            masters: {
                reportsTo: {
                    type: 'employee',
                    name: '~masterview',
                    properties: ['firstName']
                }
            }
            /*masters: {
                employee1: {
                    type: 'employee',
                    name: '~masterview',
                    properties: ['firstName']
                }
            },
            details: {
                employees1: {
                    type: 'employee',
                    name: '~detailview',
                    properties: ['lastName']
                }
            }*/
        },
        EmployeeL: {
            type: 'employee',
            name: 'EmployeeL',
            properties: ['firstName', 'lastName']
        }
    }
});

export default Model;
