import Ember from 'ember';
import { test, moduleFor } from 'ember-qunit';

import startApp from '../../helpers/start-app';

var App;

moduleFor('object:model-projections-collection', {
  // Specify the other units that are required for this test.
  needs: [],
  setup: function(){
    App = startApp();
  },
  teardown: function(){
    Ember.run(App, 'destroy');
  }
});

test('it exists', function(assert) {
  var collection = this.subject();
  assert.ok(!!collection);
});

test('add() works', function(assert){
  var collection = this.subject();
  var testValue = 'testValue';
  collection.add('newKey', testValue);
  assert.equal(collection.get('newKey'), testValue);
});
