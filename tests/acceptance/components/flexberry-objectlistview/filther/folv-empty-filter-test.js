import Ember from 'ember';
import { executeTest, addDataForDestroy } from 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test';
import { filterCollumn, refreshListByFunction } from 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions';

executeTest('check empty filter', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/flexberry-objectlistview/custom-filter';
  let modelName = 'ember-flexberry-dummy-suggestion';
  let filtreInsertOperation = 'empty';
  let filtreInsertParametr = '';
  let user;
  let type;
  let suggestion;
  Ember.run(() => {
    let newRecords = Ember.A();
    user = newRecords.pushObject(store.createRecord('ember-flexberry-dummy-application-user', { name: 'Random name fot empty filther test',
    eMail: 'Random eMail fot empty filther test' }));
    type = newRecords.pushObject(store.createRecord('ember-flexberry-dummy-suggestion-type', { name: 'Random name fot empty filther test' }));

    type.save().then(() => {
      user.save().then(() => {
        Ember.run(() => {
          suggestion = newRecords.pushObject(store.createRecord(modelName, { type: type, author: user, editor1: user }));
          suggestion.save();
          addDataForDestroy(suggestion);
          addDataForDestroy(type);
          addDataForDestroy(user);
        });
      });
    });

    visit(path + '?perPage=500');
    andThen(function() {
      assert.equal(currentPath(), path);
      let $filterButtonDiv = Ember.$('.buttons.filter-active');
      let $filterButton = $filterButtonDiv.children('button');
      let $objectListView = Ember.$('.object-list-view');

      // Activate filtre row.
      $filterButton.click();

      filterCollumn($objectListView, 0, filtreInsertOperation, filtreInsertParametr).then(function() {
        // Apply filter function.
        let refreshFunction =  function() {
          let refreshButton = Ember.$('.refresh-button')[0];
          refreshButton.click();
        };

        // Apply filter.
        let controller = app.__container__.lookup('controller:' + currentRouteName());
        let done1 = assert.async();
        refreshListByFunction(refreshFunction, controller).then(() => {
          let filtherResult = controller.model.content;
          let successful = true;
          for (let i = 0; i < filtherResult.length; i++) {
            let address = filtherResult[i]._data.address;
            if (!Ember.isNone(address)) {
              successful = false;
            }
          }

          assert.equal(filtherResult.length >= 1, true, 'Filtered list is empty');
          assert.equal(successful, true, 'Filter not successfully worked');
        }).finally(() => {
          newRecords[2].destroyRecord().then(() => {
            Ember.run(() => {
              newRecords[0].destroyRecord();
              newRecords[1].destroyRecord();
              done1();
            });
          });
        });
      });
    });
  });
});
