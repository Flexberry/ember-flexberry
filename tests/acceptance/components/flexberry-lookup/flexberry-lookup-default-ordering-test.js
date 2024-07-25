import { settled } from '@ember/test-helpers';
import { executeTest } from './execute-flexberry-lookup-test';
import Ember from 'ember';

executeTest('flexberry-lookup default ordering test', async (store, assert, app) => {
  assert.expect(9);
  const path = 'components-examples/flexberry-lookup/default-ordering-example';
  await visit(path);

  function checkHeaderOrder(defaultSorting = false) {
    const $menuTableHeaders = Ember.$('.content table.object-list-view thead tr th');
    $menuTableHeaders.each(function() {
      const $header = $(this).children('div');
      const $headerName = $header.attr('data-olv-header-property-name');
      const $headerOrder = $header.children('.object-list-view-order-icon');
      const $headerOrderTitle = $headerOrder.children('div').attr('title');

      const columnIsName = $headerName === 'name';

      if (columnIsName && !defaultSorting) {
        assert.equal($headerOrder.length === 0, true, `${$headerName} has no sorting`);
        return;
      }

      assert.equal($headerOrder.length !== 0, true, `${$headerName} has sorting ${$headerOrderTitle}`);

      if (!columnIsName && defaultSorting) {
        click($header);
      }
    });
  }

  await settled();
  assert.equal(currentPath(), path);

  const $lookupChooseButton = Ember.$('.flexberry-lookup .ui-change')[0];

  // Default sorting
  await click($lookupChooseButton);
  await settled();
  checkHeaderOrder(true);

  // Changed sorting check
  await settled();
  checkHeaderOrder();
  const $menuNextPageButton = Ember.$('.ui.basic.buttons').children('.next-page-button');
  await click($menuNextPageButton);

  // Switch page check
  await settled();
  checkHeaderOrder();
  const $menuCloseButton = Ember.$('.close.icon');
  await click($menuCloseButton);

  await settled();
  await click($lookupChooseButton);

  // Close & open page check
  await settled();
  checkHeaderOrder();
  const $defaultSortingButton = Ember.$('.ui.button.default-sort');
  await click($defaultSortingButton);
});
