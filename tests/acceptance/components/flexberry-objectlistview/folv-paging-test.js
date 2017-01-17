import Ember from 'ember';
import { executeTest, loadingList } from './execute-folv-test';

executeTest('check paging', (store, assert) => {
  assert.expect(11);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);
    let $folvPerPageButton = Ember.$('.flexberry-dropdown.compact');
    let $menu = Ember.$('.menu', $folvPerPageButton);
    let trTableBody = function(){ return $(Ember.$("table.object-list-view tbody tr")).length.toString(); };
    let activeItem = function(){ return $(Ember.$(".item.active.selected", $menu)).attr("data-value"); };

    // check paging.
    let $basicButtons = Ember.$('.ui.button','.ui.basic.buttons');
    assert.equal($($basicButtons[0]).hasClass('disabled'), true, 'button prev is disabled');
    assert.equal($($basicButtons[1]).hasClass('active'), true, 'page 1 is active');

    let done1 = assert.async();
    loadingList($basicButtons[2], '.object-list-view-container','table.object-list-view tbody tr').then(($list) => {
      assert.ok($list);
      let $basicButtons = Ember.$('.ui.button','.ui.basic.buttons');
      assert.equal($($basicButtons[1]).hasClass('active'), false, 'page 1 is not active');
      assert.equal($($basicButtons[2]).hasClass('active'), true, 'page 2 is active');
    }).catch((reason) => {
      throw new Error(reason);
    }).finally(() => {
      done1();
    });

    // The list should be more than 5 items.
    assert.equal(activeItem(), trTableBody(), "equal perPage and visible element count");
    $folvPerPageButton.click();
    let timeout = 3000;
    Ember.run.later((function() {
      let menuIsVisible = $menu.hasClass("visible");
      assert.strictEqual(menuIsVisible, true, "menu is visible");
      let $choosedIthem = Ember.$(".item", $menu);
      let done = assert.async();
      loadingList($choosedIthem[1], '.object-list-view-container','table.object-list-view tbody tr').then(($list) => {
        assert.ok($list);
        assert.equal(activeItem(), $($choosedIthem[1]).attr("data-value"), "equal");
        // The list should be more than 10 items
        assert.equal(activeItem(), trTableBody(), "equal perPage and visible element count");
      }).catch((reason) => {
        throw new Error(reason);
      }).finally(() => {
        done();
      });
    }), timeout);

  });
});
