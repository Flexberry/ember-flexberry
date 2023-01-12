import Ember from 'ember';
import { executeTest, addDataForDestroy } from './execute-folv-test';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import { SimplePredicate } from 'ember-flexberry-data/query/predicate';

executeTest('check delete with details', (store, assert, app) => {
  assert.expect(25);
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

  let getRows = function(){
    let olvContainerClass = '.object-list-view-container';
    let trTableClass = 'table.object-list-view tbody tr';

    let $folvContainer = Ember.$(olvContainerClass);
    let $rows = () => { return Ember.$(trTableClass, $folvContainer).toArray(); };
    return $rows;
  }

  let checkRecordsWereAdded = function(searchedRecord) {
    let $rows = getRows();

    // Check that the records have been added.
    let recordIsForDeleting = $rows().reduce((sum, element) => {
      let nameRecord = Ember.$.trim(element.children[2].innerText);
      let flag = nameRecord.indexOf(searchedRecord) >= 0;
      return sum + flag;
    }, 0);

    return recordIsForDeleting;
  };

  let getDeleteButton = function(searchedRecord) {
    let $rows = getRows();
    let $deleteBtnInRow = undefined;
    $rows().forEach(function(element)  {
      let nameRecord = Ember.$.trim(element.children[2].innerText);
      if (nameRecord.indexOf(searchedRecord) >= 0) {
        $deleteBtnInRow = Ember.$('.object-list-view-row-delete-button', element);
      }
    });

    return $deleteBtnInRow;
  };

  let lookAtLocalStore = function(modelName, searchedField, searchedValue) {
    let currentLoadedData = store.peekAll(modelName);
    for (let i = 0; i < currentLoadedData.content.length; i++) {
      if (currentLoadedData.content[i].record.get(searchedField) == searchedValue) {
        return true;
      }
    }

    return false;
  };

  // Add records for deleting.
  Ember.run(() => {
    let done1 = assert.async();
    let createdRecordsPrefix = 'folv-delete-with-details-test' + generateUniqueId();
    initTestData(createdRecordsPrefix).then(() => {
      let builder = new QueryBuilder(store).from(modelName).count();
      let done = assert.async();
      store.query(modelName, builder.build()).then((result) => {
        visit(path + '?perPage=' + result.meta.count);
        andThen(() => {
          assert.equal(currentPath(), path);

          // Check records added.
          assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "0") > 0, true, 1 + ' record added');
          assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "1") > 0, true, 2 + ' record added');
          assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "2") > 0, true, 3 + ' record added');

          let $deleteButton1 = getDeleteButton(createdRecordsPrefix + "0");
          let done2 = assert.async();
          Ember.run(() => {
            // An exception can be thrown to console due to observer on detail's count.
            $deleteButton1.click();
          });
          wait().then(() => {
            assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "0"), 0, 1 + ' record deleted');
            assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "1") > 0, true, 2 + ' still on OLV');
            assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "2") > 0, true, 3 + ' still on OLV');
            
            // Check local storage.
            assert.notOk(lookAtLocalStore(modelName, 'text', createdRecordsPrefix + "0"), "1 suggestion deleted on store");
            assert.ok(lookAtLocalStore(modelName, 'text', createdRecordsPrefix + "1"), "2 suggestion still on store");
            assert.ok(lookAtLocalStore(modelName, 'text', createdRecordsPrefix + "2"), "3 suggestion still on store");

            assert.notOk(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "0"), "1 comment deleted");
            assert.notOk(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "1"), "2 comment deleted");
            assert.ok(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "2"), "3 comment still on store");
            assert.ok(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "3"), "4 comment still on store");

            assert.notOk(lookAtLocalStore(commentVoteModelName, 'comment.text', createdRecordsPrefix + "0"), "Comment vote deleted");
            assert.notOk(lookAtLocalStore(commentVoteModelName, 'comment.text', createdRecordsPrefix + "1"), "Comment vote deleted");

            let builder = new QueryBuilder(store, modelName)
              .where(new SimplePredicate('text', "==", createdRecordsPrefix + "0"));
            let done3 = assert.async();
            store.query(modelName, builder.build())
            .then((data) => {
              assert.equal(data.get('length'), 0, '1 suggestion deleted on backend');

              let $deleteButton2 = getDeleteButton(createdRecordsPrefix + "1");
              let done4 = assert.async();
              Ember.run(() => {
                // An exception can be thrown to console due to observer on detail's count.
                $deleteButton2.click();
              });
              wait().then(() => {
                assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "1"), 0, 2 + ' record deleted');
                assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "2") > 0, true, 3 + ' still on OLV');
                
                // Check local storage.
                assert.notOk(lookAtLocalStore(modelName, 'text', createdRecordsPrefix + "1"), "2 suggestion deleted on store");
                assert.ok(lookAtLocalStore(modelName, 'text', createdRecordsPrefix + "2"), "3 suggestion still on store");

                assert.notOk(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "2"), "3 comment deleted");
                assert.notOk(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "3"), "4 comment deleted");

                let $deleteButton3 = getDeleteButton(createdRecordsPrefix + "2");
                let done5 = assert.async();
                Ember.run(() => {
                  // An exception can be thrown to console due to observer on detail's count.
                  $deleteButton3.click();
                });
                wait().then(() => {
                  assert.equal(checkRecordsWereAdded(createdRecordsPrefix + "2"), 0, 3 + ' record deleted');
                  
                  // Check local storage.
                  assert.notOk(lookAtLocalStore(modelName, 'text', createdRecordsPrefix + "2"), "3 suggestion deleted on store");
                  done5();
                });
                done4();
              });
              done3();
            });
            done2();
          });
        });
        done();
      });
      done1();
    });
  });
});
