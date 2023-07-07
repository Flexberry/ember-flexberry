import Ember from 'ember';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup default ordering test', (store, assert, app) => {
  assert.expect(9);
  const path = 'components-examples/flexberry-lookup/default-ordering-example';
  visit(path);

  function checkHeaderOrder(defaultSorting = false) {
    const $menuTableHeaders = Ember.$('.content table.object-list-view thead tr th');
    $menuTableHeaders.each(function() {
      const $header = $(this).children('div');
      const $headerName = $header.attr('data-olv-header-property-name');
      const $headerOrder = $header.children('.object-list-view-order-icon');
      const $headerOrderTitle = $headerOrder.children('div').attr('title');

      const columnIsName = $headerName === 'name';

      if (columnIsName && !defaultSorting) {
        assert.equal($headerOrder.length === 0, true, $headerName + ' has no sorting');
        return;
      };

      assert.equal($headerOrder.length !== 0, true, $headerName + ' has sorting ' + $headerOrderTitle);

      if (!columnIsName && defaultSorting) {
        click($header);
      }
    });
  }

  andThen(() => {
    assert.equal(currentPath(), path);

    const $lookupChooseButton = Ember.$('.flexberry-lookup .ui-change');

    //Default sorting
    click($lookupChooseButton);
    andThen(() => {
      checkHeaderOrder(true);
    });

    //Changed sorting check
    andThen(() => {
      checkHeaderOrder();
      const $menuNextPageButton = Ember.$('.ui.basic.buttons').children('.next-page-button');
      click($menuNextPageButton);
    });

    //Switch page check
    andThen(() => {
      checkHeaderOrder();
      const $menuCloseButton = Ember.$('.close.icon');
      click($menuCloseButton);
    });

    andThen(() => {
      click($lookupChooseButton);
    });

    //Close&open page check
    andThen(() => {
      checkHeaderOrder();
      const $defaultSortingButton = Ember.$('.ui.button.default-sort');
      click($defaultSortingButton);
    });
  });
});
