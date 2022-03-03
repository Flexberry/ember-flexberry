import Ember from 'ember';
import { executeTest, addDataForDestroy } from './execute-folv-test';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

import { Query } from 'ember-flexberry-data';
const { Builder } = Query;

executeTest('check delete with details', (store, assert, app) => {
  assert.expect(5);
  let path = 'components-acceptance-tests/flexberry-objectlistview/delete-with-details';
  let modelName = 'ember-flexberry-dummy-suggestion';
  let commentModelName = 'ember-flexberry-dummy-comment';
  let commentVoteModelName = 'ember-flexberry-dummy-comment-vote';

  let initTestData = function(createdRecordsPrefix) {
    // Add records for deleting. 
    return Ember.RSVP.Promise.all([
      store.createRecord('ember-flexberry-dummy-suggestion-type', { name: createdRecordsPrefix + "0" }).save(),
      store.createRecord('ember-flexberry-dummy-application-user', { 
                                                                    name: createdRecordsPrefix + "1",
                                                                    eMail: "1",
                                                                    phone1: "1"
                                                                   }).save()
    ])
    .then((createdCustomRecords) => 
      Ember.RSVP.Promise.all([
        store.createRecord(modelName, { text: createdRecordsPrefix + "0", type: createdCustomRecords[0], author: createdCustomRecords[1], editor1: createdCustomRecords[1] }).save(),
        store.createRecord(modelName, { text: createdRecordsPrefix + "1", type: createdCustomRecords[0], author: createdCustomRecords[1], editor1: createdCustomRecords[1] }).save(),
        store.createRecord(modelName, { text: createdRecordsPrefix + "2", type: createdCustomRecords[0], author: createdCustomRecords[1], editor1: createdCustomRecords[1] }).save()])
      .then((suggestions) => 
        Ember.RSVP.Promise.all([
          store.createRecord(commentModelName, { text: createdRecordsPrefix + "0", suggestion: suggestions[0], author: createdCustomRecords[1] }).save(),
          store.createRecord(commentModelName, { text: createdRecordsPrefix + "1", suggestion: suggestions[0], author: createdCustomRecords[1] }).save(),
          store.createRecord(commentModelName, { text: createdRecordsPrefix + "2", suggestion: suggestions[1], author: createdCustomRecords[1] }).save(),
          store.createRecord(commentModelName, { text: createdRecordsPrefix + "3", suggestion: suggestions[1], author: createdCustomRecords[1] }).save()])
        .then((comments) => 
          Ember.RSVP.Promise.all([
            store.createRecord(commentVoteModelName, { name: createdRecordsPrefix + "0", comment: comments[0], applicationUser: createdCustomRecords[1] }).save(),
            store.createRecord(commentVoteModelName, { name: createdRecordsPrefix + "1", comment: comments[0], applicationUser: createdCustomRecords[1] }).save(),
            store.createRecord(commentVoteModelName, { name: createdRecordsPrefix + "2", comment: comments[1], applicationUser: createdCustomRecords[1] }).save()])
        )))
    };

  let checkRecordsWereAdded = function(searchedRecord) {
    let olvContainerClass = '.object-list-view-container';
    let trTableClass = 'table.object-list-view tbody tr';

    let $folvContainer = Ember.$(olvContainerClass);
    let $rows = () => { return Ember.$(trTableClass, $folvContainer).toArray(); };

    // Check that the records have been added.
    let recordIsForDeleting = $rows().reduce((sum, element) => {
      let nameRecord = Ember.$.trim(element.children[2].innerText);
      let flag = nameRecord.indexOf(searchedRecord) >= 0;
      return sum + flag;
    }, 0);

    return recordIsForDeleting;
  };

  // Add records for deleting.
  Ember.run(() => {
    let done1 = assert.async();
    let createdRecordsPrefix = 'folv-delete-with-details-test' + generateUniqueId();
    initTestData(createdRecordsPrefix).then(() => {
      let builder = new Builder(store).from(modelName).count();
      let done = assert.async();
      store.query(modelName, builder.build()).then((result) => {
        visit(path + '?perPage=' + result.meta.count);
        andThen(() => {
          assert.equal(currentPath(), path);
          let controller = app.__container__.lookup('controller:' + currentRouteName());
          controller.set('immediateDelete', true);

          assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "0") > 0, true, 1 + ' record added');
          assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "1") > 0, true, 2 + ' record added');
          assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "2") > 0, true, 3 + ' record added');

          /*$rows().forEach(function(element, i, arr)  {
            let nameRecord = Ember.$.trim(element.children[1].innerText);
            if (nameRecord.indexOf(uuid) >= 0) {
              let $deleteBtnInRow = Ember.$('.object-list-view-row-delete-button', element);
              $deleteBtnInRow.click();
            }
          });

          // Check that the records wasn't remove in beforeDeleteRecord.
          let controller = app.__container__.lookup('controller:' + currentRouteName());
          assert.ok(controller.recordWasNotDelete, 'Records wasn\'t remove in beforeDeleteRecord');

          // Check that the records haven't been removed.
          let recordsIsDeleteBtnInRow = $rows().every((element) => {
            let nameRecord = Ember.$.trim(element.children[1].innerText);
            return nameRecord.indexOf(uuid) < 0;
          });

          assert.ok(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' is delete with button in row');

          // Check that the records have been removed into store.
          let builder2 = new Builder(store, modelName).where('name', Query.FilterOperator.Eq, uuid).count();
          let timeout = 500;
          Ember.run.later((function() {
            let done2 = assert.async();
            store.query(modelName, builder2.build()).then((result) => {
              assert.ok(result.meta.count, 'record \'' + uuid + '\'not found in store');
              done2();
            }).finally(() => {
              newRecord.destroyRecord();
            });
          }), timeout);*/
        });
        done();
      });
      done1();
    });
  });
});
