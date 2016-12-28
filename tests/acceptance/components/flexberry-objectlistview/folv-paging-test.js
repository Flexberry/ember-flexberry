import Ember from 'ember';
import moduleForAcceptance from './execute-folv-test';

moduleForAcceptance('check paging', (store, assert) => {

  assert.expect(9);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);
    let $folvPerPageButton = Ember.$('.flexberry-dropdown.compact');
    let $menu = Ember.$('.menu', $folvPerPageButton);
    let trTableBody = function(){ return $(Ember.$('tr', 'tbody', '.object-list-view-container')).length.toString(); };
    let activeItem = function(){ return $(Ember.$(".item.active.selected", $menu)).attr("data-value"); };

    // The list should be more than 5 items.
    assert.equal(activeItem(), trTableBody(), "equal perPage and visible element count");
    $folvPerPageButton.click();
    let timeout = 3000;
    Ember.run.later((function() {
      let menuIsVisible = $menu.hasClass("visible");

      assert.strictEqual(menuIsVisible, true, "menu is visible");
      if ( menuIsVisible ){
        let $choosedIthem = Ember.$(".item", $menu);
        $choosedIthem[1].click();

        assert.equal(activeItem(), $($choosedIthem[1]).attr("data-value"), "equal");
        Ember.run.later((function() {
          // The list should be more than 10 items
          assert.equal(activeItem(), trTableBody(), "equal perPage and visible element count");
        }), timeout);
      }
    }), timeout);

    // check paging.
    let $basicButtons = Ember.$('.ui.button','.ui.basic.buttons');
    assert.equal($($basicButtons[0]).hasClass('disabled'), true, 'button prev is disabled');
    assert.equal($($basicButtons[1]).hasClass('active'), true, 'page 1 is active');
    $basicButtons[2].click();

    Ember.run.later((function() {
      let $basicButtons = Ember.$('.ui.button','.ui.basic.buttons');
      assert.equal($($basicButtons[1]).hasClass('active'), false, 'page 1 is not active');
      assert.equal($($basicButtons[2]).hasClass('active'), true, 'page 2 is active');
    }), timeout);
  });
});
