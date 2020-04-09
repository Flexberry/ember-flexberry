import { executeTest } from 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test';
import { refreshListByFunction  } from 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions';
import Builder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import $ from 'jquery';

executeTest('check limit function', (store, assert, app) => {
  assert.expect(6);
  let path = 'components-examples/flexberry-objectlistview/limit-function-example?perPage=500';
  let modelName = 'ember-flexberry-dummy-suggestion';
  let result1;
  let result2;
  let count;

  visit(path);
  andThen(function() {
    let builder1 = new Builder(store).from(modelName).selectByProjection('SuggestionL');
    store.query(modelName, builder1.build()).then((result) => {
      let arr = result.toArray();
      count = arr.length;
    }).then(function() {
      let builder2 = new Builder(store).from(modelName).selectByProjection('SuggestionL').where('address', FilterOperator.Neq, '');
      store.query(modelName, builder2.build()).then((result) => {
        let arr = result.toArray();
        result1 = arr.objectAt(0).get('address');
        result2 = arr.objectAt(1).get('address');

        if (!result1 && !result2) {
          assert.ok(false, 'Laad empty data');
        }
      }).then(function() {
        let controller = app.__container__.lookup('controller:' + currentRouteName());
        controller.set('limitFunction', result1);

        let refreshFunction =  function() {
          let refreshButton = $('.refresh-button')[0];
          refreshButton.click();
        };

        assert.equal(controller.model.content.length, count, 'Folv load with current object count');

        /* eslint-disable no-unused-vars */
        let done1 = assert.async();
        refreshListByFunction(refreshFunction, controller).then(($list) => {
          let resultText = $('.oveflow-text')[0];
          assert.notEqual(controller.model.content.length, count, 'Folv load with object current count');
          assert.equal(resultText.innerText, result1, 'Correct result afther apply limitFunction');

          controller.set('limitFunction', result2);

          let done2 = assert.async();
          refreshListByFunction(refreshFunction, controller).then(($list) => {
            let resultText = $('.oveflow-text')[0];
            assert.notEqual(controller.model.content.length, count, 'Folv load with current object count');
            assert.equal(resultText.innerText, result2, 'Correct result afther apply limitFunction');

            controller.set('limitFunction', undefined);

            let done3 = assert.async();
            refreshListByFunction(refreshFunction, controller).then(($list) => {
              assert.equal(controller.model.content.length, count, 'Folv load with current object count');
              done3();
            });
            done2();
          });
          done1();
        });
        /* eslint-enable no-unused-vars */
      });
    });
  });
});
