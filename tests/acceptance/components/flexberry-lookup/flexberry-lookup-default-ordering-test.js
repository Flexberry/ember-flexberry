import Ember from 'ember';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup default ordering test', (store, assert, app) => {
  assert.expect(9);
  let path = 'components-examples/flexberry-lookup/default-ordering-example';
  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $lookup = Ember.$('.flexberry-lookup');
    let $lookupChooseButton = Ember.$('.ui-change', $lookup);
    $lookupChooseButton.click();

    function $menuTableGetHeaders(){
      let $menuTable = Ember.$('.content table.object-list-view');
      let $menuTableHead = $menuTable.children('thead');
      let $menuTableRow = $menuTableHead.children('tr');
      return $menuTableRow.children('th');
    }

    //Default sorting
    Ember.run(() => {
      var done = assert.async();
      setTimeout(function() {
        $menuTableGetHeaders().each( function() {
          let $header = $(this).children('div');
          let $headerName = $header.attr('data-olv-header-property-name');
          let $headerOrder = $header.children('.object-list-view-order-icon');
          let $headerOrderTitle = $headerOrder.children('div').attr('title');

          if($headerName === 'name') {
            assert.equal($headerOrder.length !== 0, true, $headerName + ' has sorting ' + $headerOrderTitle);
          }else{
            assert.equal($headerOrder.length !== 0, true, $headerName + ' has sorting ' + $headerOrderTitle);
            $header.click();
          }
        });
        done();
      }, 1000);
    });

    //Changed sorting check
    Ember.run(() => {
      var done = assert.async();
      setTimeout(function() {
        $menuTableGetHeaders().each( function() {
          let $header = $(this).children('div');
          let $headerName = $header.attr('data-olv-header-property-name');
          let $headerOrder = $header.children('.object-list-view-order-icon');
          let $headerOrderTitle = $headerOrder.children('div').attr('title');

          if($headerName === 'name') {
            assert.equal($headerOrder.length === 0, true, $headerName + ' has no sorting');
          }else{
            assert.equal($headerOrder.length !== 0, true, $headerName + ' has sorting ' + $headerOrderTitle);
          }
        });

        let $menuPageButtons = Ember.$('.ui.basic.buttons');
        let $menuNextPageButton = $menuPageButtons.children('.next-page-button');
        $menuNextPageButton.click();

        done();
      }, 2000);
    });

    //Switch page check
    Ember.run(() => {
      var done = assert.async();
      setTimeout(function() {
        $menuTableGetHeaders().each( function() {
          let $header = $(this).children('div');
          let $headerName = $header.attr('data-olv-header-property-name');
          let $headerOrder = $header.children('.object-list-view-order-icon');
          let $headerOrderTitle = $headerOrder.children('div').attr('title');

          if($headerName === 'name') {
            assert.equal($headerOrder.length === 0, true, $headerName + ' has no sorting');
          }else{
            assert.equal($headerOrder.length !== 0, true, $headerName + ' has sorting ' + $headerOrderTitle);
          }
        });

        let $menuCloseButton = Ember.$('.close.icon');
        $menuCloseButton.click();

        done();
      }, 3000);
    });

    Ember.run(() => {
      var done = assert.async();
      setTimeout(function() { 
        $lookupChooseButton.click();
        done();
      }, 4000);
    });

    //Close&open page check
    Ember.run(() => {
      var done = assert.async();
      setTimeout(function() {
        $menuTableGetHeaders().each( function() {
          let $header = $(this).children('div');
          let $headerName = $header.attr('data-olv-header-property-name');
          let $headerOrder = $header.children('.object-list-view-order-icon');
          let $headerOrderTitle = $headerOrder.children('div').attr('title');

          if($headerName === 'name') {
            assert.equal($headerOrder.length === 0, true, $headerName + ' has no sorting');
          }else{
            assert.equal($headerOrder.length !== 0, true, $headerName + ' has sorting ' + $headerOrderTitle);
          }
        });

        let $secondaryMenu = Ember.$('.ui.secondary.menu.no-margin.ember-view');
        let $defaultSortingButton = $secondaryMenu.children('.ui.button');
        $defaultSortingButton.click();

        done();
      }, 5000);
    });
  });
});
