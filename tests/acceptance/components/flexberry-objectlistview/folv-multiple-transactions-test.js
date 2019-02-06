import Ember from 'ember';
import { executeTest, addDataForDestroy } from './execute-folv-test';

import { Query } from 'ember-flexberry-data';
const { Builder } = Query;

executeTest('multiple transactions', (store, assert, app) => {
  assert.expect(1);
  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let testName = 'Multiple transactions test record ';

  Ember.run(() => {
    let done = assert.async();
    let recordCount = 100;
    let timeout = 50 * recordCount;
    let newRecords = Ember.A();

    // Create new records.
    for (let i = 0 ; i < recordCount; i++) {
        newRecords.pushObject(store.createRecord(modelName, { name: testName + i}));
        addDataForDestroy(newRecords[i]);
    }

    for (let i = 0 ; i < recordCount; i++) {
      newRecords[i].save();
    }

    Ember.run.later((function() {

      newRecords[0].set('parent', newRecords[recordCount - 1]);
      for (let i = 1; i < recordCount; i++) {
        newRecords[i].set('parent', newRecords[i - 1]);
      }

      for(let i = 0; i < recordCount; i++) {
        newRecords[i].save();
      }

      Ember.run.later((function() {
        // Check created records.
        let builder = new Builder(store, modelName).where('name', Query.FilterOperator.Eq, testName + 0);
        store.query(modelName, builder.build()).then((result) => {
          assert.ok(result.content.length, 'record \'' + testName + 0 + ' ok');

          Ember.run.later((function() {
            for (let i = 0; i < recordCount; i++) {
              newRecords[i].set('parent', null);
            }

            for(let i = 0; i < recordCount; i++) {
              newRecords[i].save();
            }

            Ember.run.later((function() {
              done();
            }), timeout);
          }), timeout);
        });
      }), timeout);
    }), timeout);
  });
});
