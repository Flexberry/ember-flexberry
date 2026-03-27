import { executeTest } from 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test';
import { refreshListByFunction  } from 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions';
import Builder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import $ from 'jquery';

executeTest('check limit function', async (store, assert, app) => {
  assert.expect(6);
  const path = 'components-examples/flexberry-objectlistview/limit-function-example?perPage=500';
  const modelName = 'ember-flexberry-dummy-suggestion';
  let result1;
  let result2;
  let count;

  await visit(path);

  let builder1 = new Builder(store).from(modelName).selectByProjection('SuggestionL');
  let result = await store.query(modelName, builder1.build());
  let arr = result.toArray();
  count = arr.length;
  let builder2 = new Builder(store).from(modelName).selectByProjection('SuggestionL').where('address', FilterOperator.Neq, '');
  result = await store.query(modelName, builder2.build());
  arr = result.toArray();
  
  result1 = arr.objectAt(0).get('address');
  result2 = arr.objectAt(1).get('address');

  if (!result1 && !result2) {
    assert.ok(false, 'Laad empty data');
  }

  let controller = app.__container__.lookup('controller:' + currentRouteName());
  controller.set('limitFunction', result1);

  let refreshFunction =  async function() {
    let refreshButton = $('.refresh-button')[0];
    await click(refreshButton);
  };

  assert.equal(controller.model.content.length, count, 'Folv load with current object count');

  /* eslint-disable no-unused-vars */
  let done1 = assert.async();
  await refreshListByFunction(refreshFunction, controller)
  let resultText = $('.oveflow-text')[0];
  assert.notEqual(controller.model.content.length, count, 'Folv load with object current count');
  assert.equal(resultText.innerText, result1, 'Correct result afther apply limitFunction');

  controller.set('limitFunction', result2);

  let done2 = assert.async();
  await refreshListByFunction(refreshFunction, controller);
  resultText = $('.oveflow-text')[0];
  assert.notEqual(controller.model.content.length, count, 'Folv load with current object count');
  assert.equal(resultText.innerText, result2, 'Correct result afther apply limitFunction');

  controller.set('limitFunction', undefined);

  let done3 = assert.async();
  await refreshListByFunction(refreshFunction, controller);
  assert.equal(controller.model.content.length, count, 'Folv load with current object count');
  done3();
  done2();
  done1();
/* eslint-enable no-unused-vars */
});

