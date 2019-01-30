import Ember from 'ember';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';
import { executeTest, addDataForDestroy } from './execute-folv-test';

import { Query } from 'ember-flexberry-data';
const { Builder } = Query;

executeTest('multiple transactions', (store, assert, app) => {
  assert.expect(2);
  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let uuid1 = '1' + generateUniqueId();
  let uuid2 = '2' + generateUniqueId();

  Ember.run(() => {
    let done = assert.async()
    let timeout = 10000;
    let newRecord1;
    let newRecord2;

    // Create new records.
    newRecord1 = store.createRecord(modelName, { name: uuid1, patent: newRecord2 });
    newRecord2 = store.createRecord(modelName, { name: uuid2, patent: newRecord1 });

    newRecord1.save().then(() => {
      newRecord2.save().then(() => {

        // Add record to destroy afther test.
        addDataForDestroy(newRecord2);
        addDataForDestroy(newRecord1);

        // Add circular reference to records.
        newRecord2.set('parent', newRecord2);
        newRecord1.set('parent', newRecord1);

        // Save their together.
        newRecord1.save();
        newRecord2.save();

        Ember.run.later((function() {
          // Check created records.
          let builder = new Builder(store, modelName).where('name', Query.FilterOperator.Eq, uuid1);
          store.query(modelName, builder.build()).then((result) => {
            assert.ok(result.content.length, 'record \'' + uuid1 + 'ok');
            let builder = new Builder(store, modelName).where('name', Query.FilterOperator.Eq, uuid2);
            store.query(modelName, builder.build()).then((result) => {
              assert.ok(result.content.length, 'record \'' + uuid2 + 'ok');
              done();
            });
          });
        }), timeout);
      });
    });
  });
});
