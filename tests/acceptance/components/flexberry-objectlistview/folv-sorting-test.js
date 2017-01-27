import Ember from 'ember';
import { executeTest, loadingList, checkSortingList } from './execute-folv-test';

var olvContainerClass = '.object-list-view-container';
var trTableClass = 'table.object-list-view tbody tr';

// Need to add sort by multiple columns.
executeTest('check sorting', (store, assert, app) => {
  assert.expect(11);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {

    // Check page path.
    assert.equal(currentPath(), path);
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let projectionName = Ember.get(controller, 'modelProjection');

    let $olv = Ember.$('.object-list-view ');
    let getTh = (item) => { return Ember.$('th.dt-head-left', $olv)[item]; };

    Ember.run(() => {
      let done = assert.async();

      // Check sortihg in the first column. Sorting is not append.
      checkSortingList(store, assert,  projectionName, $olv, null).then((isTrue) => {
        assert.ok(isTrue, 'sorting is not applied');

        // Check sortihg icon in the first column. Sorting icon is not added.
        assert.equal(getTh(0).children[0].children.length, 1, 'no sorting icon in the first column');

        loadingList(getTh(0), olvContainerClass, trTableClass).then(($list) => {
          let ord = () => { return Ember.$(getTh(0).children[0].children[1].children[0]); };

          assert.ok($list);
          assert.equal(ord().attr('title'), 'Order ascending', 'title is Order ascending');
          assert.equal(Ember.$.trim(ord().text()), String.fromCharCode('9650') + '1', 'sorting symbol added');

          let done1 = assert.async();
          checkSortingList(store, assert,  projectionName, $olv, 'address asc').then((isTrue) => {
            assert.ok(isTrue, 'sorting applied');
            let done2 = assert.async();
            loadingList(getTh(0), olvContainerClass, trTableClass).then(($list) => {

              assert.ok($list);
              assert.equal(ord().attr('title'), 'Order descending', 'title is Order descending');
              assert.equal(Ember.$.trim(ord().text()), String.fromCharCode('9660') + '1', 'sorting symbol changed');

              let done3 = assert.async();
              checkSortingList(store, assert,  projectionName, $olv, 'address desc').then((isTrue) => {
                assert.ok(isTrue, 'sorting applied');
                done3();
              });
            }).finally(() => {
              done2();
            });
            done1();
          });
        }).finally(() => {
          done();
        });
      });
    });
  });
});
