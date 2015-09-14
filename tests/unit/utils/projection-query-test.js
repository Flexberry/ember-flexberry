import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';
import DS from 'ember-data';

import ProjectionQuery from '../../../utils/projection-query';
import Proj from '../../../utils/projection-attributes';
import Projection from '../../../utils/projection';

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
  var projection = Projection.create('employee', {
    firstName: Proj.attr('First Name'),
    lastName: Proj.attr('Last Name'),
    birthDate: Proj.attr('Birth Date'),
    employee1: Proj.belongsTo('employee', {
      firstName: Proj.attr('Reports To - First Name')
    }),
    order: Proj.belongsTo('order', {
      orderDate: Proj.attr('Order Date')
    }),
    tmpChildren: Proj.hasMany('employee', {
      lastName: Proj.attr('Tmp Children - Last Name')
    })
  });

  var store = App.__container__.lookup('service:store');
  var query = ProjectionQuery.get(projection, store);
  assert.equal(query.$select, 'EmployeeID,FirstName,LastName,BirthDate,Employee1,Order,TmpChildren');
  assert.strictEqual(query.$expand, 'Employee1($select=EmployeeID,FirstName),Order($select=OrderID,OrderDate),TmpChildren($select=EmployeeID,LastName)');
});
