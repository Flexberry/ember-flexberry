import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

import { Query } from 'ember-flexberry-data';
const { Builder } = Query;

executeTest('multiple transactions', (store, assert, app) => {
  assert.expect(1);
  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let uuid = '0' + generateUniqueId();
  let id1 = '1';
  let id2 = '2';

  // Add records for deliting.
  Ember.run(() => {
    let newRecord1 = store.createRecord(modelName, { ID:id1, name: uuid });
    newRecord1.save();

    let newRecord2 = store.createRecord(modelName, { ID:id2, name: uuid, parent:id1 });
    newRecord2.save();

    let builder = new Builder(store, modelName).where('name', Query.FilterOperator.Eq, uuid);
    store.query(modelName, builder.build()).then((result) => {
      assert.ok(result.meta.count, 'record \'' + uuid + 'ok');
    });
  });
});
