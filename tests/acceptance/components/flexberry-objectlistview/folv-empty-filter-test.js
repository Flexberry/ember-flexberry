import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { filterCollumn } from './folv-tests-functions';
import { Query } from 'ember-flexberry-data';

executeTest('check empty filter', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-examples/flexberry-objectlistview/custom-filter';
  let modelName = 'ember-flexberry-dummy-suggestion';
  let filtreInsertOperation = 'empty';
  let filtreInsertParametr = '';

  visit(path + '?perPage=500');
  andThen(function() {
    let $filterButtonDiv = Ember.$('.buttons.filter-active');
    let $filterButton = $filterButtonDiv.children('button');
    let $objectListView = Ember.$('.object-list-view');

    // Activate filtre row.
    $filterButton.click();

    filterCollumn($objectListView, 0, filtreInsertOperation, filtreInsertParametr);

    let done = assert.async();
    window.setTimeout(() => {
      // Apply filter.
      let refreshButton = Ember.$('.refresh-button')[0];
      refreshButton.click();

      let done1 = assert.async();
      window.setTimeout(() => {
        let controller = app.__container__.lookup('controller:' + currentRouteName());
        let filtherResult = controller.model.content;
        let $neqParametr = true;
        for (let i = 0; i < filtherResult.length; i++) {
          let address = filtherResult[i]._data.address;
          if (address === undefined) {
            $neqParametr = false;
          }
        }

        assert.equal(filtherResult.length >= 1, true, 'Filtered list is not empty (If failed, add suggestion with empty address)');
        assert.equal($neqParametr, true, 'Filter successfully worked');
        done1();
      }, 1000);
      done();
    }, 1000);
  });
});
