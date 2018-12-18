import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

import { Query } from 'ember-flexberry-data';
const { Builder } = Query;

executeTest('multiple transactions', (store, assert, app) => {
  assert.expect(1);
  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let uuid1 = '1' + generateUniqueId();
  let uuid2 = '2' + generateUniqueId();

  // Add records for deliting.
  Ember.run(() => {
    let newRecord1 = store.createRecord(modelName, { name: uuid1, newRecord2 });

    let newRecord2 = store.createRecord(modelName, { name: uuid2, parent:newRecord1 });

    newRecord1.save();
    newRecord2.save();

    let builder = new Builder(store, modelName).where('name', Query.FilterOperator.Eq, uuid1);
    store.query(modelName, builder.build()).then((result) => {
      assert.ok(result.meta.count, 'record \'' + uuid1 + 'ok');
    });
  });
});
