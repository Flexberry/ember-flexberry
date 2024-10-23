import { executeTest } from './execute-folv-test';
import { refreshListByFunction } from './folv-tests-functions';
import Builder from 'ember-flexberry-data/query/builder';
import $ from 'jquery';

// Need to add sort by multiple columns.
executeTest('check sorting by computable field', async (store, assert, app) => {
  assert.expect(6);
  const path = 'components-acceptance-tests/flexberry-objectlistview/computable-field';
  const modelName = 'ember-flexberry-dummy-suggestion';
  let minValue;
  let maxValue;

  await visit(path);
  await click('.ui.clear-sorting-button');

  assert.equal(currentPath(), path);

  let builder = new Builder(store).from(modelName).selectByProjection('SuggestionL').orderBy('commentsCount');
  let result = await store.query(modelName, builder.build());
  let arr = result.toArray();
  minValue = arr.objectAt(0).get('commentsCount');
  maxValue = arr.objectAt(arr.length - 1).get('commentsCount');

  let $olv = $('.object-list-view ');
  let $thead = $('th.dt-head-left', $olv)[9];
  let controller = app.__container__.lookup('controller:' + currentRouteName());

  // Refresh function.
  let refreshFunction =  async function() {
  click($thead);
  };

  await refreshListByFunction(refreshFunction, controller);

  let $cellText = $('div.oveflow-text')[9];
  assert.equal(controller.sort, '+commentsCount', 'sorting symbol added');
  assert.equal($cellText.innerText, minValue, 'sorting symbol added');

  await refreshListByFunction(refreshFunction, controller);
  $cellText = $('div.oveflow-text')[9];
  assert.equal(controller.sort, '-commentsCount', 'sorting symbol added');
  assert.equal($cellText.innerText, maxValue, 'sorting symbol added');

  await refreshListByFunction(refreshFunction, controller);
  assert.equal(controller.sort, null, 'sorting is reset');
});

