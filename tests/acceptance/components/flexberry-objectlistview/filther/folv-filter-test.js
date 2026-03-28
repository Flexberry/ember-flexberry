import $ from 'jquery';
import { executeTest } from 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test';
import { run } from '@ember/runloop';
import { filterObjectListView, refreshListByFunction  } from 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Builder from 'ember-flexberry-data/query/builder';
import {settled} from '@ember/test-helpers';

executeTest('check filter', async (store, assert, app) => {
  assert.expect(2);
  const path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
  const modelName = 'ember-flexberry-dummy-suggestion';
  const filtreInsertOperationArr = ['eq', undefined, 'eq', 'eq', 'eq', 'eq'];
  let filtreInsertValueArr;

  await visit(path);

  assert.equal(currentPath(), path);
  let builder2 = new Builder(store).from(modelName).selectByProjection('SuggestionL').where('address', FilterOperator.Neq, '').top(1);
  let result = await store.query(modelName, builder2.build());
  let arr = result.toArray();
  filtreInsertValueArr = [arr.objectAt(0).get('address'), undefined, arr.objectAt(0).get('votes'),
  arr.objectAt(0).get('moderated').toString(), arr.objectAt(0).get('type.name'), arr.objectAt(0).get('author.name')];
    
  let $filterButtonDiv = $('.buttons.filter-active');
  let $filterButton = $filterButtonDiv.children('button');
  let $objectListView = $('.object-list-view');

  // Activate filtre row.
  await run(async() => {
    $filterButton.click();
  });
      
  await settled();

  await run(async() =>{
  await filterObjectListView($objectListView, filtreInsertOperationArr, filtreInsertValueArr);
  });
  await settled();

  // Apply filter function.
  let refreshFunction = async function() {
    await run(async() => {
    let refreshButton = $('.refresh-button')[0];
    refreshButton.click();
  });
};

  // Apply filter.
  let controller = app.__container__.lookup('controller:' + currentRouteName());
  /* eslint-disable no-unused-vars */
  await run(async () => {
    await refreshListByFunction(refreshFunction, controller);
  });
  await settled();
    let filtherResult = controller.model.content;
    assert.equal(filtherResult.length >= 1, true, 'Filtered list is not empty');
});
  /* eslint-enable no-unused-vars */
