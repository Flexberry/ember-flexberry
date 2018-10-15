import Ember from 'ember';
import { executeTest, addDataForDestroy } from './execute-folv-test';
import { refreshListByFunction } from 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions';

import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

import { Query } from 'ember-flexberry-data';
const { Builder } = Query;

executeTest('check delete using button on toolbar', (store, assert, app) => {
  assert.expect(6);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';

  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let howAddRec = 2;
  let uuid = '0' + generateUniqueId();

  // Add records for deliting.
  Ember.run(() => {
    let newRecords = Ember.A();

    for (let i = 0; i < howAddRec; i++) {
      newRecords.pushObject(store.createRecord('ember-flexberry-dummy-suggestion-type', { name: uuid }));
    }

    let done2 = assert.async();
    let promises = Ember.A();
    newRecords.forEach(function(item) {
      promises.push(item.save());
    });

    addDataForDestroy(newRecords);

    Ember.RSVP.Promise.all(promises).then(function(resolvedPromises) {
      assert.ok(resolvedPromises, 'All records saved.');

      let builder = new Builder(store).from(modelName).count();
      let done1 = assert.async();
      store.query(modelName, builder.build()).then((result) => {
        visit(path + '?perPage=' + result.meta.count);
        andThen(() => {
          assert.equal(currentPath(), path);
          let olvContainerClass = '.object-list-view-container';
          let trTableClass = 'table.object-list-view tbody tr';

          let $folvContainer = Ember.$(olvContainerClass);
          let $rows = () => { return Ember.$(trTableClass, $folvContainer).toArray(); };

          // Check that the records have been added.
          let recordIsForDeleting = $rows().reduce((sum, current) => {
            let nameRecord = Ember.$.trim(current.children[1].innerText);
            let flag = (nameRecord.indexOf(uuid) >= 0);
            return sum + flag;
          }, 0);

          assert.equal(recordIsForDeleting, howAddRec, howAddRec + ' records added');

          // Мark records.
          let recordIsChecked = $rows().reduce((sum, current) => {
            let nameRecord = Ember.$.trim(current.children[1].innerText);
            let $firstCell = Ember.$('.object-list-view-helper-column-cell', current);
            let checkboxInRow = Ember.$('.flexberry-checkbox', $firstCell);
            let checked = true;
            if (nameRecord.indexOf(uuid) >= 0) {
              checkboxInRow.click();
              checked = (checkboxInRow[0].className.indexOf('checked') >= 0);
            }

            return sum && checked;
          }, true);

          assert.ok(recordIsChecked, 'Each entry begins with \'' + uuid + '\' is checked');

          // Apply filter function.
          let refreshFunction =  function() {
            let deleteButton = Ember.$('.delete-button')[0];
            click(deleteButton);
            let refreshButton = Ember.$('.refresh-button')[0];
            click(refreshButton);
          };

          let done = assert.async();
          let controller = app.__container__.lookup('controller:' + currentRouteName());

          let timeout = 500;
          Ember.run.later((function() {

            // Delete the marked records.
            refreshListByFunction(refreshFunction, controller).then(() => {

              let recordsIsDelete = $rows().every((element) => {
                let nameRecord = Ember.$.trim(element.children[1].innerText);
                return nameRecord.indexOf(uuid) < 0;
              });

              assert.ok(recordsIsDelete, 'Each entry begins with \'' + uuid + '\' is delete with button in toolbar button');

              // Check that the records have been removed into store.
              let builder2 = new Builder(store).from(modelName).where('name', Query.FilterOperator.Eq, uuid).count();
              let done3 = assert.async();
              store.query(modelName, builder2.build()).then((result) => {
                assert.notOk(result.meta.count, 'records \'' + uuid + '\'not found in store');
                done3();
              });
              done();
            });
          }), timeout);
        });
        done1();
      });
      done2();
    });
  });
});
