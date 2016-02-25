import DS from 'ember-data';
import Ember from 'ember';
import { test, moduleForModel } from 'ember-qunit';

import startApp from '../../helpers/start-app';

var App;

moduleForModel('order', {
  // Specify the other units that are required for this test.
  needs: ['model:employee',
          'model:customer',
          'service:validations',
          'ember-validations@validator:local/presence',
          'ember-validations@validator:local/length',
          'validator:local/datetime'],
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    Ember.$.mockjax.clear();
  }
});

test('it exists', function(assert) {
  var model = this.subject();
  assert.ok(!!model);
});

test('it returns fields', function(assert) {
  var model = this.subject();
  var store = this.store();
  assert.ok(model);
  assert.ok(model instanceof DS.Model);

  // set a relationship
  Ember.run(function() {
    var date = '1933-10-30T00:00:00Z';
    model.set('orderDate', date);
    assert.equal(model.get('orderDate'), date);
    model.set('employee', store.createRecord('employee', { firstName: 'Sidorov', lastName: 'Sidor' }));
    model.set('customer', store.createRecord('customer', { contactName: 'Jack' }));
  });

  var reportsToEmployee = model.get('employee');
  assert.ok(reportsToEmployee);
  assert.equal(reportsToEmployee.get('firstName'), 'Sidorov');
  assert.equal(reportsToEmployee.get('lastName'), 'Sidor');

  var relatedCustomer = model.get('customer');
  assert.ok(relatedCustomer);
  assert.equal(relatedCustomer.get('contactName'), 'Jack');
});

test('it validates', function(assert) {
  var model = this.subject();
  assert.expect(4);

  Ember.run(function() {
    assert.ok(!model.get('isValid'), 'Empty model is valid. Check validation rules.');

    model.save().then(null, function(errorData) {
      assert.ok(errorData instanceof Ember.Object);
      assert.ok(errorData.anyErrors);
    });

    model.set('orderDate', '1933-10-30T00:00:00Z');
    assert.ok(model.get('isValid'), 'Data was set but model is invalid. Check validation rules.');
  });
});

test('it loads fields', function(assert) {
  var store = App.__container__.lookup('service:store');
  Ember.run(function() {
    Ember.$.mockjax({
      url: '*Orders(99)',
      responseText: {
        OrderID: 99,
        OrderDate: '1933-10-30T00:00:00Z',
        Employee: {
          EmployeeID: 98,
          FirstName: 'Sidor',
          LastName: 'Sidorov',
          BirthDate: '1946-10-30T00:00:00Z',
          Employee1: null
        },
        Customer: {
          CustomerID: 'ABCDE',
          ContactName: 'Jack'
        }
      }
    });

    store.findRecord('order', 99).then(function(record) {
      assert.ok(record);
      assert.ok(record instanceof DS.Model);

      var orderDate = record.get('orderDate');
      assert.ok(String(orderDate).indexOf('1933') > -1);

      var relatedEmployee = record.get('employee');
      assert.ok(relatedEmployee);
      assert.ok(relatedEmployee instanceof DS.Model);
      assert.equal(relatedEmployee.get('firstName'), 'Sidor');
      assert.equal(relatedEmployee.get('lastName'), 'Sidorov');

      var relatedCustomer = record.get('customer');
      assert.ok(relatedCustomer);
      assert.ok(relatedCustomer instanceof DS.Model);
      assert.equal(relatedCustomer.get('contactName'), 'Jack');
    });

    // waiting for async operations to finish
    wait();
  });
});
