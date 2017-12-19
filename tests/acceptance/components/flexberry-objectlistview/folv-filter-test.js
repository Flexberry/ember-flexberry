import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { filterObjectListView } from './folv-tests-functions';
import { Query } from 'ember-flexberry-data';

executeTest('check filter', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
  let modelName = 'ember-flexberry-dummy-suggestion';
  let filtreInsertOperationArr = ['eq', '', 'eq', 'eq', 'eq', 'eq'];
  let filtreInsertValueArr;

  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);
    let builder2 = new Query.Builder(store).from(modelName).top(1);
    store.query(modelName, builder2.build()).then((result) => {
      let arr = result.toArray();
      filtreInsertValueArr = [arr.objectAt(0).get('address'), '', arr.objectAt(0).get('votes'), arr.objectAt(0).get('moderated'), arr.objectAt(0).get('type.name'), arr.objectAt(0).get('author.name')];
    }).then(function() {
      let $filterButtonDiv = Ember.$('.buttons.filter-active');
      let $filterButton = $filterButtonDiv.children('button');
      let $objectListView = Ember.$('.object-list-view');

      // Activate filtre row.
      $filterButton.click();

      filterObjectListView($objectListView, filtreInsertOperationArr, filtreInsertValueArr);

      let done = assert.async();
      window.setTimeout(() => {
        // Apply filter.
        let refreshButton = Ember.$('.refresh-button')[0];
        refreshButton.click();

        let done1 = assert.async();
        window.setTimeout(() => {
          //let controller = app.__container__.lookup('controller:' + currentRouteName());
          let rows = $objectListView.find('tr');
          assert.equal(rows.length >= 4, true, 'Filter successfully worked');
          done1();
        }, 1000);
        done();
      }, 1000);
    });
  });
});
