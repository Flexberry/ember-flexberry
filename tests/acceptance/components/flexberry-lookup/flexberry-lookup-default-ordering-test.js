import Ember from 'ember';
import { executeTest } from './execute-flexberry-lookup-test';

function $menuTableGetHeaders() {
  let $menuTable = Ember.$('.content table.object-list-view');
  let $menuTableHead = $menuTable.children('thead');
  let $menuTableRow = $menuTableHead.children('tr');
  return $menuTableRow.children('th');
}

executeTest('flexberry-lookup default ordering test', (store, assert, app) => {
  assert.expect(9);
  let path = 'components-examples/flexberry-lookup/default-ordering-example';
  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $lookup = Ember.$('.flexberry-lookup');
    let $lookupChooseButton = Ember.$('.ui-change', $lookup);

    //Default sorting
    click($lookupChooseButton);
    andThen(() => {
      $menuTableGetHeaders().each(function() {
        let $header = $(this).children('div');
        let $headerName = $header.attr('data-olv-header-property-name');
        let $headerOrder = $header.children('.object-list-view-order-icon');
        let $headerOrderTitle = $headerOrder.children('div').attr('title');

        if ($headerName === 'name') {
          assert.equal($headerOrder.length !== 0, true, $headerName + ' has sorting ' + $headerOrderTitle);
        }else {
          assert.equal($headerOrder.length !== 0, true, $headerName + ' has sorting ' + $headerOrderTitle);
          click($header);
        }
      });
    });

    //Changed sorting check
    andThen(() => {
      $menuTableGetHeaders().each(function() {
        let $header = $(this).children('div');
        let $headerName = $header.attr('data-olv-header-property-name');
        let $headerOrder = $header.children('.object-list-view-order-icon');
        let $headerOrderTitle = $headerOrder.children('div').attr('title');

        if ($headerName === 'name') {
          assert.equal($headerOrder.length === 0, true, $headerName + ' has no sorting');
        }else {
          assert.equal($headerOrder.length !== 0, true, $headerName + ' has sorting ' + $headerOrderTitle);
        }
      });

      let $menuPageButtons = Ember.$('.ui.basic.buttons');
      let $menuNextPageButton = $menuPageButtons.children('.next-page-button');
      click($menuNextPageButton);
    });

    //Switch page check
    andThen(() => {
      $menuTableGetHeaders().each(function() {
        let $header = $(this).children('div');
        let $headerName = $header.attr('data-olv-header-property-name');
        let $headerOrder = $header.children('.object-list-view-order-icon');
        let $headerOrderTitle = $headerOrder.children('div').attr('title');

        if ($headerName === 'name') {
          assert.equal($headerOrder.length === 0, true, $headerName + ' has no sorting');
        }else {
          assert.equal($headerOrder.length !== 0, true, $headerName + ' has sorting ' + $headerOrderTitle);
        }
      });

      let $menuCloseButton = Ember.$('.close.icon');
      click($menuCloseButton);
    });

    andThen(() => {
      click($lookupChooseButton);
    });

    //Close&open page check
    andThen(() => {
      $menuTableGetHeaders().each(function() {
        let $header = $(this).children('div');
        let $headerName = $header.attr('data-olv-header-property-name');
        let $headerOrder = $header.children('.object-list-view-order-icon');
        let $headerOrderTitle = $headerOrder.children('div').attr('title');

        if ($headerName === 'name') {
          assert.equal($headerOrder.length === 0, true, $headerName + ' has no sorting');
        }else {
          assert.equal($headerOrder.length !== 0, true, $headerName + ' has sorting ' + $headerOrderTitle);
        }
      });

      let $secondaryMenu = Ember.$('.ui.secondary.menu.no-margin.ember-view');
      let $defaultSortingButton = $secondaryMenu.children('.ui.button');
      click($defaultSortingButton);
    });
  });
});
