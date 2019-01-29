import Ember from 'ember';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';
import { executeTest, addDataForDestroy } from './execute-folv-test';

import { Query } from 'ember-flexberry-data';
const { Builder } = Query;

executeTest('multiple transactions', (store, assert, app) => {
  assert.expect(1);
  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let uuid1 = '1' + generateUniqueId();
  let uuid2 = '2' + generateUniqueId();

  // Add records for deliting.
  Ember.run(() => {
    let done = assert.async()
    let newRecord1;
    let newRecord2;

    newRecord1 = store.createRecord(modelName, { name: uuid1});
    newRecord2 = store.createRecord(modelName, { name: uuid2});

    newRecord1.save().then(() => {
      newRecord2.save().then(() => {
        addDataForDestroy(newRecord2);
        addDataForDestroy(newRecord1);
        let timeout = 10000;
        Ember.run.later((function() {
          newRecord2.set('parent', newRecord2);
          newRecord1.set('parent', newRecord1);

          newRecord1.save();
          newRecord2.save();

          Ember.run.later((function() {
            let builder = new Builder(store, modelName).where('name', Query.FilterOperator.Eq, uuid1);
            store.query(modelName, builder.build()).then((result) => {
              assert.ok(result.content.length, 'record \'' + uuid1 + 'ok');
              newRecord2.set('parent', null);
              newRecord2.save().then(() => {
                done();
              });
            });
          }), timeout);
        }), timeout);
      });
    });
  });
});
