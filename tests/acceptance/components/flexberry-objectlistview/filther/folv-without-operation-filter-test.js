import Ember from 'ember';
import { executeTest } from 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test';
import { filterCollumn, refreshListByFunction } from 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions';
import { Query } from 'ember-flexberry-data';

executeTest('check without operation filter', (store, assert, app) => {
  assert.expect(4);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
  let modelName = 'ember-flexberry-dummy-suggestion';
  let filtreInsertOperation = '';
  let filtreInsertParametr;

  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);
    let builder2 = new Query.Builder(store).from(modelName).where('address', Query.FilterOperator.Neq, '').top(1);
    store.query(modelName, builder2.build()).then((result) => {
      let arr = result.toArray();
      filtreInsertParametr = arr.objectAt(0).get('address');
      filtreInsertParametr = filtreInsertParametr.slice(1, filtreInsertParametr.length);
    }).then(function() {
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
            if (address.lastIndexOf(filtreInsertParametr) === -1) {
              successful = false;
            }
          }

          let dropdown = Ember.$('.flexberry-dropdown')[0];
          assert.equal(dropdown.innerText, 'like', 'Filter select like operation if it is not specified');
          assert.equal(filtherResult.length >= 1, true, 'Filtered list is not empty');
          assert.equal(successful, true, 'Filter successfully worked');
          done1();
        });
      });
    });
  });
});
