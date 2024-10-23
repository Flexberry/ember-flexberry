import $ from 'jquery';
import { executeTest } from 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test';
import { run } from '@ember/runloop';
import { filterCollumn, refreshListByFunction } from 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Builder from 'ember-flexberry-data/query/builder';
import { settled } from '@ember/test-helpers';

executeTest('check filter by enter click', async (store, assert, app) => {
  assert.expect(3);
  const path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
  const modelName = 'ember-flexberry-dummy-suggestion';
  const filtreInsertOperation = 'eq';
  let filtreInsertParametr;

  await visit(path);
 
  assert.equal(currentPath(), path);
  let builder = new Builder(store).from(modelName).selectByProjection('SuggestionL').where('address', FilterOperator.Neq, '').top(1);
  let result = await  store.query(modelName, builder.build());
  let arr = result.toArray();
  filtreInsertParametr = arr.objectAt(0).get('address');

  if (!filtreInsertParametr) {
    assert.ok(false, 'Empty data');
  }
    
  let $filterButtonDiv = $('.buttons.filter-active');
  let $filterButton = $filterButtonDiv.children('button');
  let $objectListView = $('.object-list-view');

  // Activate filtre row.
  await run(async() => {
    $filterButton.click();
    await settled();
  });

  await run(async() => {
    filterCollumn($objectListView, 0, filtreInsertOperation, filtreInsertParametr);
  });

  // Apply filter by enter click function.
  let refreshFunction = async () => {
    let input = $('.ember-text-field')[0];
    await run(async() => {
    input.focus();
    await keyEvent(input, 'keydown', 13);
    });
  };

  // Apply filter.
  let controller = app.__container__.lookup('controller:' + currentRouteName());
  await settled();
  
  await refreshListByFunction(refreshFunction, controller);
  await settled();

  let filtherResult = controller.model.content;
  let successful = true;

  for (let i = 0; i < filtherResult.length; i++) {
    let address = filtherResult[i]._data.address;
    if (address !== filtreInsertParametr) {
      successful = false;
    }
  }

  assert.equal(filtherResult.length >= 1, true, 'Filtered list is empty');
  assert.equal(successful, true, 'Filter successfully worked');
});
