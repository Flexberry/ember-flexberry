import Ember from 'ember';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup window search test', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-examples/flexberry-lookup/customizing-window-example';
  visit(path);

  andThen(function() {
    assert.equal(currentPath(), path);

    let $lookupChooseButton = Ember.$('button.ui-change');
    let $sampleText;

    click($lookupChooseButton);

    //Search exists
    andThen(() => {
      let $windowSearchField = Ember.$('div.block-action-input').children('input');
      let $lookupTable = Ember.$('.content table.object-list-view');
      let $lookupTableBody = $lookupTable.children('tbody');
      let $lookupTableRow = $lookupTableBody.children('tr');
      let $lookupTableRowText = $lookupTableRow.find('div.oveflow-text').eq(2);

      assert.equal($windowSearchField.length === 1, true, 'search exists');

      $sampleText = $.trim($lookupTableRowText.text());
      fillIn($windowSearchField, $sampleText);

      let $windowSearchButton = Ember.$('button.search-button');
      click($windowSearchButton);
      //Search works
      andThen(() => {
        let $lookupTable = Ember.$('.content table.object-list-view');
        let $lookupTableBody = $lookupTable.children('tbody');
        let $lookupTableRow = $lookupTableBody.children('tr');
        let $lookupTableRowText = $lookupTableRow.find('div.oveflow-text').first();

        assert.equal($sampleText === $.trim($lookupTableRowText.text()), true, 'search works');
      });
    });
  });
});
