import ProjectionQuery from '../../../utils/projection-query';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';
import DS from 'ember-data';
import ModelProjectionsCollection from '../../../objects/model-projections-collection';
import ModelProjection from '../../../objects/model-projection';

var App;

module('Test detail load for custom class', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
    Ember.$.mockjax.clear();
  }
});

test('query for embedded relationships', function(assert) {
  var projection = ModelProjection.create({
    type: 'employee',
    name: 'EmployeeE',
    properties: ['firstName', 'lastName', 'birthDate', 'employee1', 'order', 'tmpChildren'],
    masters: ModelProjectionsCollection.create({
      employee1: ModelProjection.create({
        type: 'employee',
        name: 'EmployeeE.masters.employee1',
        properties: ['firstName']
      }),
      order: ModelProjection.create({
        type: 'order',
        name: 'EmployeeE.masters.order',
        properties: ['orderDate']
      })
    }),
    details: ModelProjectionsCollection.create({
      tmpChildren: ModelProjection.create({
        type: 'employee',
        name: 'EmployeeE.details.tmpChildren',
        properties: ['lastName']
      })
    })
  });

  var store = App.__container__.lookup('service:store');
  var query = ProjectionQuery.get(projection, store);
  assert.equal(query.$select, 'EmployeeID,FirstName,LastName,BirthDate,Employee1,Order,TmpChildren');
  assert.strictEqual(query.$expand, 'Employee1($select=EmployeeID,FirstName),Order($select=OrderID,OrderDate),TmpChildren($select=EmployeeID,LastName)');
});
