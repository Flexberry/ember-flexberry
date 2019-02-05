import Ember from 'ember';
import { executeTest } from 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test';
import { filterObjectListView, refreshListByFunction  } from 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions';
import { Query } from 'ember-flexberry-data';

executeTest('check filter', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
  let modelName = 'ember-flexberry-dummy-suggestion';
  let filtreInsertOperationArr = ['eq', undefined, 'eq', 'eq', 'eq', 'eq'];
  let filtreInsertValueArr;

  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);
    let builder2 = new Query.Builder(store).from(modelName).selectByProjection('SuggestionL').where('address', Query.FilterOperator.Neq, '').top(1);
    store.query(modelName, builder2.build()).then((result) => {
      let arr = result.toArray();
      filtreInsertValueArr = [arr.objectAt(0).get('address'), null, arr.objectAt(0).get('votes'), arr.objectAt(0).get('moderated'),
      arr.objectAt(0).get('type.name'), arr.objectAt(0).get('author.name')];
    }).then(function() {
      let $filterButtonDiv = Ember.$('.buttons.filter-active');
      let $filterButton = $filterButtonDiv.children('button');
      let $objectListView = Ember.$('.object-list-view');

      // Activate filtre row.
      $filterButton.click();

      filterObjectListView($objectListView, filtreInsertOperationArr, filtreInsertValueArr).then(function() {
        // Apply filter function.
        let refreshFunction =  function() {
          let refreshButton = Ember.$('.refresh-button')[0];
          refreshButton.click();
        };

        // Apply filter.
        let controller = app.__container__.lookup('controller:' + currentRouteName());
        let done1 = assert.async();
        refreshListByFunction(refreshFunction, controller).then(($list) => {
          let filtherResult = controller.model.content;
          assert.equal(filtherResult.length >= 1, true, 'Filtered list is empty');
          done1();
        });
      });
    });
  });
});
