import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import {  filterObjectListView } from './folv-tests-functions';

executeTest('check filter', (store, assert) => {
  assert.expect(1);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';

  // Add records for paging.
  Ember.run(() => {
    visit(path);
    andThen(function() {
      assert.equal(currentPath(), path);

      let $filterButtonDiv = Ember.$('.buttons.filter-active');
      let $filterButton = $filterButtonDiv.children('button');
      let objectListView = Ember.$('.object-list-view');

      // Activate filtre row.
      $filterButton.click();

      let filtreInsertOperationArr = ['eq', '', 'eq', 'eq', 'eq', 'eq'];
      let filtreInsertValueArr = ['dfg', '', '3', 'false', '123222', 'Иван'];

      filterObjectListView(objectListView, filtreInsertOperationArr, filtreInsertValueArr);

      let done = assert.async();

      window.setTimeout(() => {
        // Apply filter.
        let refreshButton = Ember.$('.refresh-button')[0];
        refreshButton.click();

        let done1 = assert.async();
        window.setTimeout(() => {
          done1();
        }, 100000);
        done();
      }, 1000);
    });
  });
});
