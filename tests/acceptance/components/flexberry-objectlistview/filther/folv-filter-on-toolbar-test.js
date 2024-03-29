import $ from 'jquery';
import { run } from '@ember/runloop';
import { get, set } from '@ember/object';
import { executeTest } from 'dummy/tests/acceptance/components/flexberry-objectlistview/execute-folv-test';
import Builder from 'ember-flexberry-data/query/builder';
import Condition from 'ember-flexberry-data/query/condition';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import { SimplePredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';
import { refreshListByFunction  } from 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions';

executeTest('check filter on toolbar with filter projection', (store, assert, app) => {
  assert.expect(5);
  let path = 'components-acceptance-tests/flexberry-objectlistview/custom-filter';
  let modelName = 'ember-flexberry-dummy-suggestion';
  let adressEtalone;
  let typeNameEtalone;

  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);
    let sp1 = new SimplePredicate('address', FilterOperator.Neq, '');
    let sp2 = new SimplePredicate('type.name', FilterOperator.Neq, '');
    let cp = new ComplexPredicate(Condition.And, sp1, sp2);

    let builder = new Builder(store).from(modelName).selectByProjection('SuggestionL').where(cp).top(1);
    store.query(modelName, builder.build()).then((result) => {
      let arr = result.toArray();
      adressEtalone = arr.objectAt(0).get('address');
      typeNameEtalone = arr.objectAt(0).get('type.name');

      // TODO: add proper predicate on query that "address != type.name" when it will be availible.
      assert.notEqual(adressEtalone, typeNameEtalone);
    }).then(function() {
      let $filterInput = $('div.olv-search input');
      let $filterApplyButton = $('div.olv-search button.search-button');

      // 1) Filter by address as adressEtalone by common projection and get N records.
      fillIn($filterInput, adressEtalone);

      andThen(function() {
        let refreshFunction =  function() {
          $filterApplyButton.click();
        };

        let controller = app.__container__.lookup('controller:' + currentRouteName());

        // Apply filter.
        let done1 = assert.async();
        refreshListByFunction(refreshFunction, controller).then(($list) => {
          let currentModel = get(controller, 'model');
          let filteredByCommonProjectionCountN = get(currentModel, 'meta.count');
          assert.ok(filteredByCommonProjectionCountN >= 1, `Found ${filteredByCommonProjectionCountN} records by common projection filtered by "${adressEtalone}".`);

          // 2) Filter by type.name as typeNameEtalone by filter projection containing only type.name property and get at least 1 record.
          run(() => {
            set(controller, 'filterProjectionName', 'TestFilterOnToolbarView');
          });

          run(() => {
            fillIn($filterInput, typeNameEtalone);
          });

          let done2 = assert.async();
          refreshListByFunction(refreshFunction, controller).then(($list) => {
            let currentModel = get(controller, 'model');
            let filteredByFilterProjectionCount = get(currentModel, 'meta.count');
            assert.ok(filteredByFilterProjectionCount >= 1, `Found ${filteredByFilterProjectionCount} records by filter projection filtered by "${typeNameEtalone}".`);

            // 3) Filter by address as adressEtalone by filter projection containing only type.name property and get less than N records.
            run(() => {
              fillIn($filterInput, adressEtalone);
            });

            let done3 = assert.async();
            refreshListByFunction(refreshFunction, controller).then(($list) => {
              let currentModel = get(controller, 'model');
              let filteredByFilterProjectionCount2 = get(currentModel, 'meta.count');
              assert.ok(filteredByCommonProjectionCountN > filteredByFilterProjectionCount2, `Found ${filteredByFilterProjectionCount2} records by filter projection filtered by "${adressEtalone}".`);

              run(() => {
                set(controller, 'filterProjectionName', undefined);
              });
              done3();
            });

            done2();
          });

          done1();
        });
      })
    });
  });
});
