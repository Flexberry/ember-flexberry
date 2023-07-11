import $ from 'jquery';
import { executeTest } from 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test';
import { run } from '@ember/runloop';
import { filterCollumn, refreshListByFunction } from 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Builder from 'ember-flexberry-data/query/builder';

executeTest('check neq filter', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
  let modelName = 'ember-flexberry-dummy-suggestion';
  let filtreInsertOperation = 'neq';
  let filtreInsertParametr;

  visit(path + '?perPage=500');
  andThen(function() {
    assert.equal(currentPath(), path);
    let builder2 = new Builder(store).from(modelName).selectByProjection('SuggestionL').where('address', FilterOperator.Neq, '').top(1);
    store.query(modelName, builder2.build()).then((result) => {
      let arr = result.toArray();
      filtreInsertParametr = arr.objectAt(0).get('address');
      if (!filtreInsertParametr) {
        assert.ok(false, 'Empty data');
      }
    }).then(function() {
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
            if (address === filtreInsertParametr) {
              successful = false;
            }
          }

          assert.equal(successful, true, 'Filter successfully worked');
          done1();
        });
      });
    });
  });
});
