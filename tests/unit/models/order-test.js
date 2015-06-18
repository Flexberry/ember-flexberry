import DS from 'ember-data';
import Ember from 'ember';
import { test, moduleForModel } from 'ember-qunit';

import startApp from '../../helpers/start-app';

var App;

moduleForModel('order', {
  // Specify the other units that are required for this test.
    needs: ["model:employee",
            'service:validations',
            'ember-validations@validator:local/presence',
            'ember-validations@validator:local/length'],
    setup: function(){
      App = startApp();
    },
    teardown: function(){
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
    model.set('employeeID', store.createRecord('employee', { firstName: "Sidorov", lastName: "Sidor" }));
  });
  
  var reportsToEmployee = model.get('employeeID');
  assert.ok(reportsToEmployee);
  assert.equal(reportsToEmployee.get('firstName'), "Sidorov");
  assert.equal(reportsToEmployee.get('lastName'), "Sidor");
});

test('it validates', function (assert) {
  var model = this.subject();
  assert.expect(4);

  Ember.run(function (){
    assert.ok(!model.get('isValid'), 'Empty model is valid. Check validation rules.');

    model.save().then(null, function (errorData) {
      assert.ok(errorData instanceof Ember.Object);
      assert.ok(errorData.anyErrors);
    });

    model.set('orderDate', '1933-10-30T00:00:00Z');
    assert.ok(model.get('isValid'), 'Data was set but model is invalid. Check validation rules.');
  });
});

test('it loads fields', function(assert) {
  var store = App.__container__.lookup('store:main');
  Ember.run(function(){

    Ember.$.mockjax({
      url: "*Orders(99)",
      responseText: {
        "@odata.context": "http://northwindodata.azurewebsites.net/odata/$metadata#Orders(OrderID,OrderDate,EmployeeID)/$entity",
        "OrderID": 99,
        "OrderDate": "1933-10-30T00:00:00Z",
        "EmployeeID": 97
      }
     });

    Ember.$.mockjax({
      url: "*Employees(97)",
      responseText: {
        "@odata.context": "http://northwindodata.azurewebsites.net/odata/$metadata#Employees(EmployeeID,FirstName,LastName,BirthDate,ReportsTo)/$entity",
        "EmployeeID": 97,
        "FirstName": "Sidor",
        "LastName": "Sidorov",
        "BirthDate": "1946-10-30T00:00:00Z",
        "ReportsTo": 96
      }
    });

    store.find('order', 99).then(function(record) {
      assert.ok(record);
      assert.ok(record instanceof DS.Model);

      var orderDate = record.get('orderDate');
      assert.ok(String(orderDate).indexOf("1933") > -1);  

      record.get('employeeID').then(function(masterRecord){
        assert.ok(masterRecord);
        assert.ok(masterRecord instanceof DS.Model);
        assert.equal(masterRecord.get('firstName'), "Sidor"); 
        assert.equal(masterRecord.get('lastName'), "Sidorov");
      });
    });

    // waiting for async operations to finish
    wait();
  });
});
