import { run } from '@ember/runloop';
import $ from 'jquery';
import RSVP from 'rsvp';
import DS from 'ember-data';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import startApp from '../../helpers/start-app';

var App;

module('Unit | Controller | edit form', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(() => {
    App = startApp();
  });

  hooks.afterEach(() => {
    run(App, 'destroy');
    $.mockjax.clear();
  });

  test('it exists', function(assert) {
    let controller;
    run(() => {
      controller = this.owner.lookup('controller:edit-form');
    });
    assert.ok(controller);
  });

  test('save hasMany relationships recursively', function(assert) {
    let savedRecords = [];
  
    let TestModel = DS.Model.extend({
      save: function() {
        return new RSVP.Promise((resolve) => {
          savedRecords.push(this);
          resolve(this);
        });
      }
    });
  
    let Model1 = TestModel.extend({
      hasManyModel2: DS.hasMany('model2')
    });
  
    let Model2 = TestModel.extend({
      hasManyModel3: DS.hasMany('model3')
    });
  
    let Model3 = TestModel.extend({
    });
  
    App.register('model:model1', Model1);
    App.register('model:model2', Model2);
    App.register('model:model3', Model3);
  
    let controller;
    let store;
    run(() => {
      controller = this.owner.lookup('controller:edit-form');
      store = App.__container__.lookup('service:store');
    });
  
    run(function() {
      let record = store.createRecord('model1');
      let model21 = store.createRecord('model2');
      let model22 = store.createRecord('model2');
      record.get('hasManyModel2').pushObjects([model21, model22]);
      let model31 = store.createRecord('model3');
      model22.get('hasManyModel3').pushObjects([model31]);
  
      controller.set('model', record);
      controller._saveHasManyRelationships(record).then(() => {
        assert.equal(savedRecords[0], model21);
        assert.equal(savedRecords[1], model22);
        assert.equal(savedRecords[2], model31);
      });
    });
  });
});
