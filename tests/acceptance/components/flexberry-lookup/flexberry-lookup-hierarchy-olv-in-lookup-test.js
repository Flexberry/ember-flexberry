import Ember from 'ember';
import { executeTest } from './execute-flexberry-lookup-test';

function elementCheck(name) {
  let $elem = Ember.$(name);
  if ($elem.length === 0) { return false; }else { return true; }
}

executeTest('flexberry-lookup hierarchy olv test', (store, assert, app) => {
  assert.expect(16);
  let path = 'components-examples/flexberry-lookup/hierarchy-olv-in-lookup-example';
  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $lookupChooseButtons = Ember.$('.ui-change');

    //First lookup
    click($lookupChooseButtons[0]);

    andThen(() => {
      assert.equal(elementCheck('button.hierarchical-button'), true, 'has hierarchical-button');
      assert.equal(elementCheck('button.hierarchy-expand'), true, 'has hierarchy-expand');
      assert.equal(elementCheck('div.nav-bar'), false, 'no nav-bar');

      let $menuTable = Ember.$('.content table.object-list-view');
      let $menuTableBody = $menuTable.children('tbody');
      let $menuTableRowCount = $menuTableBody.children('tr').length;

      let $expandButton = Ember.$('button.hierarchy-expand').eq(0);
      click($expandButton);

      andThen(() => {
        assert.equal($menuTableRowCount < $menuTableBody.children('tr').length, true, 'hierarchy expanded');
  
        let $nextTableRow = $expandButton.parents('tr').next('tr');
        let $nextTableRowTd = $nextTableRow.children('td').next();
  
        assert.equal($nextTableRowTd.css('padding-left'), '20px', 'expanded text has padding-left: 20px');
  
        click($lookupChooseButtons[1]);
      });
    });

    //Second lookup
    andThen(() => {
      assert.equal(elementCheck('button.hierarchical-button'), true, 'has hierarchical-button');
      assert.equal(elementCheck('button.hierarchy-expand'), false, 'no hierarchy-expand');
      assert.equal(elementCheck('div.nav-bar'), true, 'has nav-bar');

      let $hierarchicalButton = Ember.$('button.hierarchical-button');
      click($hierarchicalButton);

      andThen(() => {
        assert.equal(elementCheck('button.hierarchy-expand'), true, 'has hierarchy-expand');
        assert.equal(elementCheck('div.nav-bar'), false, 'no nav-bar');
  
        let $menuTable = Ember.$('.content table.object-list-view');
        let $menuTableBody = $menuTable.children('tbody');
        let $menuTableRowCount = $menuTableBody.children('tr').length;
  
        let $expandButton = Ember.$('button.hierarchy-expand');
        click($expandButton[0]);
  
        andThen(() => {
          assert.equal($menuTableRowCount < $menuTableBody.children('tr').length, true, 'hierarchy expanded');
    
          let $nextTableRow = $expandButton.parents('tr').next('tr');
          let $nextTableRowTd = $nextTableRow.children('td').next();
    
          assert.equal($nextTableRowTd.css('padding-left'), '20px', 'expanded text has padding-left: 20px');

          click($lookupChooseButtons[2]);
        });
      });
    });

    //Third lookup
    andThen(() => {
      assert.equal(elementCheck('button.hierarchical-button'), false, 'no hierarchical-button');
      assert.equal(elementCheck('button.hierarchy-expand'), false, 'no hierarchy-expand');
      assert.equal(elementCheck('div.nav-bar'), true, 'has nav-bar');
    });
  });
});
