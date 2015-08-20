import DS from 'ember-data';
import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import ApplicationSerializer from 'prototype-ember-cli-application/serializers/application';

var CustomModel;
var CustomSerializer;
var App;

module('Test detail load for custom class', {
  //// Specify the other units that are required for this test.
  //  needs: ['model:projected-model'],
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
    Ember.$.mockjax.clear();
  }
});

test('it loads details', function(assert) {
  // Create custom model.
  CustomModel = DS.Model.extend({
    firstName: DS.attr('string'),
    employee1: DS.belongsTo('custom', { inverse: null, async: false }),
    tmpChildren: DS.hasMany('custom', { inverse: null, async: false })
  });

  // Create serializer for custom model.
  CustomSerializer = ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
      employee1: { serialize: 'id', deserialize: 'records' },
      tmpChildren: { serialize: 'ids', deserialize: 'records' }
    },

    primaryKey: 'CustomID'
  });

  // Register custom structures.
  App.register('model:custom', CustomModel);
  App.register('serializer:custom', CustomSerializer);

  Ember.run(function() {
    Ember.$.mockjax({
      url: '*Customs(99)',
      responseText: {
        CustomID: 99,
        FirstName: 'TestCustomModel',
        Employee1: {
          CustomID: 1,
          FirstName: 'TestCustomModelMaster'
        },
        TmpChildren: [{
            CustomID: 2,
            FirstName: 'TestCustomModelDetail1'
          }, {
            CustomID: 3,
            FirstName: 'TestCustomModelDetail2'
          }
        ]
      }
    });

    var store = App.__container__.lookup('service:store');
    store.findRecord('custom', 99).then(function(record) {
      assert.ok(record);
      assert.ok(record instanceof DS.Model);
      assert.equal(record.get('firstName'), 'TestCustomModel');

      let masterData = record.get('employee1');
      assert.ok(masterData);
      assert.ok(masterData instanceof DS.Model);
      assert.equal(masterData.get('firstName'), 'TestCustomModelMaster');

      let detailData = record.get('tmpChildren');
      assert.ok(detailData);

      var firstDetail = detailData.objectAt(0);
      assert.ok(firstDetail instanceof DS.Model);
      assert.equal(firstDetail.get('firstName'), 'TestCustomModelDetail1');

      var secondDetail = detailData.objectAt(1);
      assert.ok(firstDetail instanceof DS.Model);
      assert.equal(secondDetail.get('firstName'), 'TestCustomModelDetail2');
    });

    // waiting for async operations to finish
    wait();
  });
});
