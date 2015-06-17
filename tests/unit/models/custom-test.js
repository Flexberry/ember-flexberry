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
        reportsTo: DS.belongsTo('custom', { inverse: null, async: true }),
        tmpChildren: DS.hasMany('custom', { inverse: null, async: true })
    });

    // Create serializer for custom model.
    CustomSerializer = ApplicationSerializer.extend({
        primaryKey: 'CustomID'
    });

    // Register custom structures.
    App.register('model:custom', CustomModel);
    App.register('serializer:custom', CustomSerializer);

    Ember.run(function() {
        Ember.$.mockjax({
            url: "*Customs(99)",
            responseText: {
                "@odata.context": App.activeHost.odata + "/$metadata#Customs(firstName,ReportsTo)/$entity",
                "CustomID": 99,
                "FirstName": "TestCustomModel",
                "ReportsTo": 98,
                "TmpChildren": [1,2]
            }
        });

        Ember.$.mockjax({
            url: "*Customs(98)",
            responseText: {
                "@odata.context": App.activeHost.odata + "/$metadata#Customs(firstName,ReportsTo)/$entity",
                "CustomID": 98,
                "FirstName": "TestCustomModelMaster",
                "ReportsTo": 97
            }
        });

        Ember.$.mockjax({
            url: "*Customs(1)",
            responseText: {
                "@odata.context": App.activeHost.odata + "/$metadata#Customs(firstName,ReportsTo)/$entity",
                "CustomID": 1,
                "FirstName": "TestCustomModelDetail1",
                "ReportsTo": 100
            }
        });

        Ember.$.mockjax({
            url: "*Customs(2)",
            responseText: {
                "@odata.context": App.activeHost.odata + "/$metadata#Customs(firstName,ReportsTo)/$entity",
                "CustomID": 2,
                "FirstName": "TestCustomModelDetail2",
                "ReportsTo": 200
            }
        });


        var store = App.__container__.lookup('store:main');
        var record = null;
        store.find('custom', 99).then(function(record) {
            assert.ok(record);
            assert.ok(record instanceof DS.Model);
            assert.equal(record.get('firstName'), "TestCustomModel");
            record.get('reportsTo').then(function(masterData) {
                assert.ok(masterData);
                assert.ok(masterData instanceof DS.Model);
                assert.equal(masterData.get('firstName'), "TestCustomModelMaster");
            });
            record.get('tmpChildren').then(function(detailData) {
                assert.ok(detailData);

                var firstDetail = detailData.objectAt(0);
                assert.ok(firstDetail instanceof DS.Model);
                assert.equal(firstDetail.get('firstName'), "TestCustomModelDetail1");

                var secondDetail = detailData.objectAt(1);
                assert.ok(firstDetail instanceof DS.Model);
                assert.equal(secondDetail.get('firstName'), "TestCustomModelDetail2");
            });
        });

        andThen(function(){});
    });
});
