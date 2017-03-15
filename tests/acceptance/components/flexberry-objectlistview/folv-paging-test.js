import Ember from 'ember';
import { executeTest, loadingList } from './execute-folv-test';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

import { Query } from 'ember-flexberry-data';
const { Builder } = Query;

executeTest('check paging', (store, assert) => {
  assert.expect(12);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let uuid = generateUniqueId();

  // Add records for paging.
  Ember.run(() => {

    let builder = new Builder(store).from(modelName).count();
    let done = assert.async();
    store.query(modelName, builder.build()).then((result) => {
      let howAddRec = 12 - result.meta.count;
      let newRecords = Ember.A();

      for (let i = 0; i < howAddRec; i++) {
        newRecords.pushObject(store.createRecord(modelName, { name: uuid }));
      }

      let done1 = assert.async();
      let promises = Ember.A();
      newRecords.forEach(function(item) {
        promises.push(item.save());
      });

      Ember.RSVP.Promise.all(promises).then(function(resolvedPromises) {
        assert.ok(resolvedPromises, 'All records saved.');

        visit(path);
        andThen(function() {
          assert.equal(currentPath(), path);
          let $folvPerPageButton = Ember.$('.flexberry-dropdown.compact');
          let $menu = Ember.$('.menu', $folvPerPageButton);
          let trTableBody = () => { return $(Ember.$('table.object-list-view tbody tr')).length.toString(); };

          let activeItem =  () => { return $(Ember.$('.item.active.selected', $menu)).attr('data-value'); };

          // check paging.
          let $basicButtons = Ember.$('.ui.button', '.ui.basic.buttons');
          assert.equal($($basicButtons[0]).hasClass('disabled'), true, 'button prev is disabled');
          assert.equal($($basicButtons[1]).hasClass('active'), true, 'page 1 is active');

          let done2 = assert.async();
          loadingList($basicButtons[2], '.object-list-view-container', 'table.object-list-view tbody tr').then(($list) => {
            assert.ok($list);
            let $basicButtons = Ember.$('.ui.button', '.ui.basic.buttons');
            assert.equal($($basicButtons[1]).hasClass('active'), false, 'page 1 is not active');
            assert.equal($($basicButtons[2]).hasClass('active'), true, 'page 2 is active');
          }).catch((reason) => {
            throw new Error(reason);
          }).finally(() => {
            done2();
          });

          // The list should be more than 5 items.
          assert.equal(activeItem(), trTableBody(), 'equal perPage and visible element count');
          $folvPerPageButton.click();
          let timeout = 500;
          Ember.run.later((() => {
            let menuIsVisible = $menu.hasClass('visible');
            assert.strictEqual(menuIsVisible, true, 'menu is visible');
            let $choosedIthem = Ember.$('.item', $menu);
            let done3 = assert.async();
            loadingList($choosedIthem[1], '.object-list-view-container', 'table.object-list-view tbody tr').then(($list) => {
              assert.ok($list);
              assert.equal(activeItem(), $($choosedIthem[1]).attr('data-value'), 'equal');

              // The list should be more than 10 items
              assert.equal(activeItem(), trTableBody(), 'equal perPage and visible element count');
            }).catch((reason) => {
              throw new Error(reason);
            }).finally(() => {
              done3();
            });
          }), timeout);
        });
        done1();
      });
      done();
    });

    let builder1 = new Builder(store, modelName).where('name', Query.FilterOperator.Eq, uuid);
    let done4 = assert.async();
    store.query(modelName, builder1.build()).then((results) => {
      results.content.forEach(function(item) {
        item.deleteRecord();
        item.save();
      });
      done4();
    });
  });
});
