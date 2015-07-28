import DS from 'ember-data';
import Ember from 'ember';
import { test, moduleForModel } from 'ember-qunit';

import startApp from '../../helpers/start-app';

var App;

moduleForModel('employee', {
  // Specify the other units that are required for this test.
  needs: ['model:order',
          'service:validations',
          'ember-validations@validator:local/presence',
          'ember-validations@validator:local/length'],
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
  var model = this.subject({ firstName: 'Ivanov', lastName: 'Ivan' });
  var store = this.store();
  assert.ok(model);
  assert.ok(model instanceof DS.Model);
  assert.equal(model.get('firstName'), 'Ivanov');
  assert.equal(model.get('lastName'), 'Ivan');

  // set a relationship
  Ember.run(function() {
    model.set('reportsTo', store.createRecord('employee', { firstName: 'Sidorov', lastName: 'Sidor' }));
  });

  var reportsToEmployee = model.get('reportsTo');
  assert.ok(reportsToEmployee);
  assert.equal(reportsToEmployee.get('firstName'), 'Sidorov');
  assert.equal(reportsToEmployee.get('lastName'), 'Sidor');
});

test('it validates', function(assert) {
  var model = this.subject({ lastName: 'asd' });
  assert.expect(4);

  Ember.run(function() {
    model.set('firstName', 'Qwerty');
    assert.ok(!model.get('isValid'), 'Empty model is valid. Check validation rules.');

    model.save().then(null, function(errorData) {
      assert.ok(errorData instanceof Ember.Object);
      assert.ok(errorData.anyErrors);
    });

    model.set('lastName', 'Qwerty');
    assert.ok(model.get('isValid'), 'Data was set but model is invalid. Check validation rules.');
  });
});

test('it loads fields', function(assert) {
  var store = App.__container__.lookup('store:main');
  Ember.run(function() {
    Ember.$.mockjax({
      url: '*Employees(99)',
      responseText: {
        EmployeeID: 99,
        FirstName: 'Ivan',
        LastName: 'Ivanov',
        BirthDate: '1933-10-30T00:00:00Z',
        ReportsTo: 98
      }
    });

    Ember.$.mockjax({
      url: '*Employees(98)',
      responseText: {
        EmployeeID: 98,
        FirstName: 'Sidor',
        LastName: 'Sidorov',
        BirthDate: '1946-10-30T00:00:00Z',
        ReportsTo: 97
      }
    });

    store.find('employee', 99).then(function(record) {
      assert.ok(record);
      assert.ok(record instanceof DS.Model);
      assert.equal(record.get('firstName'), 'Ivan');
      assert.equal(record.get('lastName'), 'Ivanov');

      record.get('reportsTo').then(function(masterRecord) {
        assert.ok(masterRecord);
        assert.ok(masterRecord instanceof DS.Model);
        assert.equal(masterRecord.get('firstName'), 'Sidor');
        assert.equal(masterRecord.get('lastName'), 'Sidorov');
      });
    });

    // waiting for async operations to finish
    wait();
  });
});
