import Ember from 'ember';
import { executeTest, addDataForDestroy } from './execute-folv-test';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

import { Query } from 'ember-flexberry-data';
const { Builder } = Query;

executeTest('multiple transactions', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-cancel';
  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let howAddRec = 1;
  let uuid = '0' + generateUniqueId();

  // Add records for deliting.
  Ember.run(() => {
    let newRecord = store.createRecord(modelName, { name: uuid });
    let done1 = assert.async();

    newRecord.save().then(() => {
      addDataForDestroy(newRecord);
      let builder = new Builder(store).from(modelName).count();
      let done = assert.async();
      store.query(modelName, builder.build()).then((result) => {
        visit(path + '?perPage=' + result.meta.count);
        andThen(() => {
          assert.equal(currentPath(), path);

          let olvContainerClass = '.object-list-view-container';
          let trTableClass = 'table.object-list-view tbody tr';

          let $folvContainer = Ember.$(olvContainerClass);
          let $rows = () => { return Ember.$(trTableClass, $folvContainer).toArray(); };

          // Check that the records have been added.
          let recordIsForDeleting = $rows().reduce((sum, element) => {
            let nameRecord = Ember.$.trim(element.children[1].innerText);
            let flag = nameRecord.indexOf(uuid) >= 0;
            return sum + flag;
          }, 0);

          assert.equal(recordIsForDeleting > 0, true, howAddRec + ' record added');
        });
        done();
      });
      done1();
    });
  });
});
