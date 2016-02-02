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
  var model = this.subject({ firstName: 'Ivanov', lastName: 'Ivan' });
  var store = this.store();
  assert.ok(model);
  assert.ok(model instanceof DS.Model);
  assert.equal(model.get('firstName'), 'Ivanov');
  assert.equal(model.get('lastName'), 'Ivan');

  // set a relationship
  Ember.run(function() {
    model.set('employee1', store.createRecord('employee', { firstName: 'Sidorov', lastName: 'Sidor' }));
  });

  var reportsToEmployee = model.get('employee1');
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
    model.set('birthDate', '1933-10-30T00:00:00Z');
    assert.ok(model.get('isValid'), 'Data was set but model is invalid. Check validation rules.');
  });
});

test('it loads fields', function(assert) {
  var store = App.__container__.lookup('service:store');
  Ember.run(function() {
    Ember.$.mockjax({
      url: '*Employees(99)',
      responseText: {
        EmployeeID: 99,
        FirstName: 'Ivan',
        LastName: 'Ivanov',
        BirthDate: '1933-10-30T00:00:00Z',
        Employee1: {
          EmployeeID: 98,
          FirstName: 'Sidor',
          LastName: 'Sidorov',
          BirthDate: '1946-10-30T00:00:00Z',
          Employee1: null
        }
      }
    });

    store.findRecord('employee', 99).then(function(record) {
      assert.ok(record);
      assert.ok(record instanceof DS.Model);
      assert.equal(record.get('firstName'), 'Ivan');
      assert.equal(record.get('lastName'), 'Ivanov');

      let masterRecord = record.get('employee1');
      assert.ok(masterRecord);
      assert.ok(masterRecord instanceof DS.Model);
      assert.equal(masterRecord.get('firstName'), 'Sidor');
      assert.equal(masterRecord.get('lastName'), 'Sidorov');
    });

    // waiting for async operations to finish
    wait();
  });
});

test('makeDirty for loaded unchanged model makes model dirty', function(assert) {
  assert.expect(3);

  var store = App.__container__.lookup('service:store');
  Ember.run(() => {
    Ember.$.mockjax({
      url: '*Employees(99)',
      responseText: {
        EmployeeID: 99,
        FirstName: 'Ivan',
        LastName: 'Ivanov',
        BirthDate: '1933-10-30T00:00:00Z',
        Employee1: {
          EmployeeID: 98,
          FirstName: 'Sidor',
          LastName: 'Sidorov',
          BirthDate: '1946-10-30T00:00:00Z',
          Employee1: null
        }
      }
    });

    store.findRecord('employee', 99).then(function(record) {
      assert.ok(record instanceof DS.Model);
      assert.equal(record.get('dirtyType'), undefined);

      record.makeDirty();
      assert.equal(record.get('dirtyType'), 'updated');
    });

    wait();
  });
});

test('makeDirty for created model does nothing', function(assert) {
  assert.expect(2);

  var record = this.subject();
  assert.equal(record.get('dirtyType'), 'created');
  record.makeDirty();
  assert.equal(record.get('dirtyType'), 'created');
});
