import $ from 'jquery';
import { executeTest } from 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test';
import { run } from '@ember/runloop';
import { filterCollumn, refreshListByFunction } from 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions';
import Builder from 'ember-flexberry-data/query/builder';
import { settled } from '@ember/test-helpers';

executeTest('check le filter', async (store, assert, app) => {
  assert.expect(3);
  const path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';
  const modelName = 'ember-flexberry-dummy-suggestion';
  const filtreInsertOperation = 'le';
  let filtreInsertParametr;

  await visit(path + '?perPage=500');

  assert.equal(currentPath(), path);
  let builder2 = new Builder(store).from(modelName).selectByProjection('SuggestionL').top(1);
  let result = await store.query(modelName, builder2.build());
  let arr = result.toArray();
   filtreInsertParametr = arr.objectAt(0).get('votes') + 1;

  let $filterButtonDiv = $('.buttons.filter-active');
  let $filterButton = $filterButtonDiv.children('button');
  let $objectListView = $('.object-list-view');

  // Activate filtre row.
  await run(async () => {
    $filterButton.click();
  });
  await settled();

  await run(async () => {
    await filterCollumn($objectListView, 2, filtreInsertOperation, filtreInsertParametr);
  });

  // Apply filter function.
  let refreshFunction = async function () {
    let refreshButton = $('.refresh-button')[0];
    await run(async () => {
      refreshButton.click();
    });
  };
  await settled();

  // Apply filter.
  let controller = app.__container__.lookup('controller:' + currentRouteName());

  await run(async () => {
    await refreshListByFunction(refreshFunction, controller);
  });
  await settled();

  let filtherResult = controller.model.content;
  let successful = true;
  for (let i = 0; i < filtherResult.length; i++) {
    let votes = filtherResult[0]._data.votes;
    if (votes >= filtreInsertParametr) {
      successful = false;
    }
  }

  assert.equal(filtherResult.length >= 1, true, 'Filtered list is empty');
  assert.equal(successful, true, 'Filter successfully worked');
});
