import { executeTest } from './execute-folv-test';
import { refreshListByFunction } from './folv-tests-functions';
import Builder from 'ember-flexberry-data/query/builder';
import $ from 'jquery';

// Need to add sort by multiple columns.
executeTest('check sorting by computable field', (store, assert, app) => {
  assert.expect(6);
  let path = 'components-acceptance-tests/flexberry-objectlistview/computable-field';
  let modelName = 'ember-flexberry-dummy-suggestion';
  let minValue;
  let maxValue;

  visit(path);
  click('.ui.clear-sorting-button');
  andThen(() => {
    assert.equal(currentPath(), path);
    let builder = new Builder(store).from(modelName).selectByProjection('SuggestionL').orderBy('commentsCount');
    store.query(modelName, builder.build()).then((result) => {
      let arr = result.toArray();
      minValue = arr.objectAt(0).get('commentsCount');
      maxValue = arr.objectAt(arr.length - 1).get('commentsCount');
    }).then(function() {

      let $olv = $('.object-list-view ');
      let $thead = $('th.dt-head-left', $olv)[9];
      let controller = app.__container__.lookup('controller:' + currentRouteName());

      // Refresh function.
      let refreshFunction =  function() {
        $thead.click();
      };

      let done1 = assert.async();
      refreshListByFunction(refreshFunction, controller).then(() => {
        let $cellText = $('div.oveflow-text')[9];
        assert.equal(controller.sort, '+commentsCount', 'sorting symbol added');
        assert.equal($cellText.innerText, minValue, 'sorting symbol added');
        let done2 = assert.async();
        refreshListByFunction(refreshFunction, controller).then(() => {
          let $cellText = $('div.oveflow-text')[9];
          assert.equal(controller.sort, '-commentsCount', 'sorting symbol added');
          assert.equal($cellText.innerText, maxValue, 'sorting symbol added');
          let done3 = assert.async();
          refreshListByFunction(refreshFunction, controller).then(() => {
            assert.equal(controller.sort, null, 'sorting is reset');
            done3();
          });
          done2();
        });
        done1();
      });
    });
  });
});
