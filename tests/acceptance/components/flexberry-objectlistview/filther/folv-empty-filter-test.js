import { run } from '@ember/runloop';
import { A } from '@ember/array';
import $ from 'jquery';
import { executeTest } from 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test';
import { filterCollumn, refreshListByFunction } from 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions';
import Builder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';

executeTest('check empty filter', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/flexberry-objectlistview/custom-filter';
  let modelName = 'ember-flexberry-dummy-suggestion';
  let filtreInsertOperation = 'empty';
  let filtreInsertParametr = '';
  run(() => {
    let builder = new Builder(store).from(modelName).where('address', FilterOperator.Eq, '');
    store.query(modelName, builder.build()).then((result) => {
      let arr = result.toArray();

      // Add an object with an empty address, if it is not present.
      if (arr.length === 0) {
        let newRecords = A();
        let user = newRecords.pushObject(store.createRecord('ember-flexberry-dummy-application-user', { name: 'Random name fot empty filther test',
        eMail: 'Random eMail fot empty filther test' }));
        let type = newRecords.pushObject(store.createRecord('ember-flexberry-dummy-suggestion-type', { name: 'Random name fot empty filther test' }));

        newRecords.forEach(function(item) {
          item.save();
        });

        let done = assert.async();
        window.setTimeout(() => {
          run(() => {
            newRecords = A();
            newRecords.pushObject(store.createRecord(modelName, { type: type, author: user, editor1: user }));
            newRecords.forEach(function(item) {
              item.save();
            });
          });
          done();
        }, 1000);
      }
    });

    visit(path + '?perPage=500');
    andThen(function() {
      assert.equal(currentPath(), path);
      let $filterButtonDiv = $('.buttons.filter-active');
      let $filterButton = $filterButtonDiv.children('button');
      let $objectListView = $('.object-list-view');

      // Activate filtre row.
      run(() => {
        $filterButton.click();
      });

      filterCollumn($objectListView, 0, filtreInsertOperation, filtreInsertParametr).then(function() {
        // Apply filter function.
        let refreshFunction =  function() {
          let refreshButton = $('.refresh-button')[0];
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
            if (address === undefined) {
              successful = false;
            }
          }

          assert.equal(filtherResult.length >= 1, true, 'Filtered list is not empty');
          assert.equal(successful, true, 'Filter successfully worked');
          done1();
        });
      });
    });
  });
});
