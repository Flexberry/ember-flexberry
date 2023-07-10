import Ember from 'ember';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import { SimplePredicate } from 'ember-flexberry-data/query/predicate';

import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';

let app;
let store;
const path = 'components-acceptance-tests/flexberry-groupedit/delete-with-details';
const modelName = 'ember-flexberry-dummy-suggestion';
const commentModelName = 'ember-flexberry-dummy-comment';
const commentVoteModelName = 'ember-flexberry-dummy-comment-vote';

module('Acceptance | flexberry-groupedit | delete with details', {
    beforeEach() {

      // Start application.
      app = startApp();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      let applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
      store = app.__container__.lookup('service:store');
    },

    afterEach() {
      Ember.run(app, 'destroy');
    }
  });

test('delete with details', (assert) => {
  let mainSuggestionRecord;
  let mainSuggestionTypeRecord;
  let mainApplicationUserRecord;
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
    .then((createdCustomRecords) => {
      mainSuggestionTypeRecord = createdCustomRecords[0];
      mainApplicationUserRecord = createdCustomRecords[1];

      return Ember.RSVP.Promise.all([
        store.createRecord(modelName, { text: createdRecordsPrefix + "0", type: createdCustomRecords[0], author: createdCustomRecords[1], editor1: createdCustomRecords[1] }).save()])
      .then((suggestions) => {
        mainSuggestionRecord = suggestions[0];
        return Ember.RSVP.Promise.all([
          store.createRecord(commentModelName, { text: createdRecordsPrefix + "0", suggestion: suggestions[0], author: createdCustomRecords[1] }).save(),
          store.createRecord(commentModelName, { text: createdRecordsPrefix + "1", suggestion: suggestions[0], author: createdCustomRecords[1] }).save(),
          store.createRecord(commentModelName, { text: createdRecordsPrefix + "2", suggestion: suggestions[0], author: createdCustomRecords[1] }).save()])
        .then((comments) =>
          Ember.RSVP.Promise.all([
            store.createRecord(commentVoteModelName, { name: createdRecordsPrefix + "0", comment: comments[0], applicationUser: createdCustomRecords[1] }).save(),
            store.createRecord(commentVoteModelName, { name: createdRecordsPrefix + "1", comment: comments[0], applicationUser: createdCustomRecords[1] }).save(),
            store.createRecord(commentVoteModelName, { name: createdRecordsPrefix + "2", comment: comments[1], applicationUser: createdCustomRecords[1] }).save()])
        )}) });
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
      let nameRecord = Ember.$.trim(element.children[1].children[0].children[0].value);
      let flag = nameRecord.indexOf(searchedRecord) >= 0;
      return sum + flag;
    }, 0);

    return recordIsForDeleting;
  };

  let getDeleteButton = function(searchedRecord) {
    let $rows = getRows();
    let $deleteBtnInRow = undefined;
    $rows().forEach(function(element)  {
      let nameRecord = Ember.$.trim(element.children[1].children[0].children[0].value);
      if (nameRecord.indexOf(searchedRecord) >= 0) {
        $deleteBtnInRow = Ember.$('.object-list-view-row-delete-button', element);
      }
    });

    return $deleteBtnInRow;
  };

  let lookAtLocalStore = function(modelName, searchedField, searchedValue) {
    let currentLoadedData = store.peekAll(modelName);
    for (let i = 0; i < currentLoadedData.content.length; i++) {
      let record = currentLoadedData.objectAt(i);
      if (record.get(searchedField) == searchedValue) {
        return !record.isDeleted;
      }
    }

    return false;
  };

  Ember.run(() => {
    let done1 = assert.async();
    let createdRecordsPrefix = 'fge-delete-with-details-test' + generateUniqueId();
    initTestData(createdRecordsPrefix).then(() => {
      visit(path +'?createdRecordsPrefix=' + createdRecordsPrefix);
      andThen(() => {
        assert.equal(currentPath(), path, createdRecordsPrefix);

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

          assert.notOk(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "0"), "1 comment deleted");
          assert.ok(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "1"), "2 comment still on store");
          assert.ok(lookAtLocalStore(commentModelName, 'text', createdRecordsPrefix + "2"), "3 comment still on store");

          assert.notOk(lookAtLocalStore(commentVoteModelName, 'comment.text', createdRecordsPrefix + "0"), "Comment votes for 1 deleted");
          assert.ok(lookAtLocalStore(commentVoteModelName, 'comment.text', createdRecordsPrefix + "1"), "Comment votes for 2 still on store");

          let builder = new QueryBuilder(store, commentModelName)
            .where(new SimplePredicate('text', "==", createdRecordsPrefix + "0"));
          let done3 = assert.async();
          store.query(commentModelName, builder.build())
          .then((data) => {
            assert.equal(data.get('length'), 1, '1 comment is not deleted on backend');

            let builder = new QueryBuilder(store, commentVoteModelName)
              .where(new SimplePredicate('comment.text', "==", createdRecordsPrefix + "0"));
            let done4 = assert.async();
            store.query(commentVoteModelName, builder.build())
            .then((data) => {
              assert.equal(data.get('length'), 2, 'Comment votes for comment 1 not deleted on backend');
              let done5 = assert.async();

              // An exception can be thrown to console due to observer on detail's count.
              mainSuggestionRecord.rollbackAll();
              mainSuggestionRecord.destroyRecord().then(() => {
                return Ember.RSVP.Promise.all([
                  mainSuggestionTypeRecord.destroyRecord(),
                  mainApplicationUserRecord.destroyRecord()])
              }).then(() => done5());

              done4();
            });
            done3();
          });
          done2();
        });
        done1();
      });
    });
  });
});
