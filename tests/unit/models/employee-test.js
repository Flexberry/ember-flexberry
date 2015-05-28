import DS from 'ember-data';
import Ember from 'ember';
import { test, moduleForModel } from 'ember-qunit';

//import startApp from '../../helpers/start-app';

//var App;

moduleForModel('employee', {
  // Specify the other units that are required for this test.
    needs: []//,
    //setup: function(){
    //    App = startApp();
    //},
    //teardown: function(){
    //    Ember.run(App, 'destroy');
    //}
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});

test('it returns fields', function(assert) {
  var model = this.subject({ firstName: "Ivanov", lastName: "Ivan" });
  var store = this.store();
  assert.ok(model);
  assert.ok(model instanceof DS.Model);
  assert.equal(model.get('firstName'), "Ivanov");
  assert.equal(model.get('lastName'), "Ivan");
  
  // set a relationship
  Ember.run(function() {
    model.set('reportsTo', store.createRecord('employee', { firstName: "Sidorov", lastName: "Sidor" }));
  });
  
  var reportsToEmployee = model.get('reportsTo');
  assert.ok(reportsToEmployee);
  assert.equal(reportsToEmployee.get('firstName'), "Sidorov");
  assert.equal(reportsToEmployee.get('lastName'), "Sidor");
});

