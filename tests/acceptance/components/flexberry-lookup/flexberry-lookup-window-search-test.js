import Ember from 'ember';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup window search test', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-examples/flexberry-lookup/customizing-window-example';
  visit(path);

  andThen(function() {
    assert.equal(currentPath(), path);

    let $lookupField = Ember.$('input.lookup-field');
    let $lookupChooseButton = Ember.$('button.ui-change');
    let $lookupClearButton = Ember.$('button.ui-clear');
    let $sampleText;

    $lookupClearButton.click();
    $lookupChooseButton.click();

    Ember.run(() => {
      var done = assert.async();
      setTimeout(function() {
        let $windowSearchField = Ember.$('div.block-action-input').children('input');
        let $lookupTable = Ember.$('.content table.object-list-view');
        let $lookupTableBody = $lookupTable.children('tbody');
        let $lookupTableRow = $lookupTableBody.children('tr');
        let $lookupTableRowText = $lookupTableRow.find('div.oveflow-text').eq(2);

        $sampleText = $.trim($lookupTableRowText.text());
        fillIn($windowSearchField, $sampleText);

        done();
      }, 2000);
    });

    Ember.run(() => {
      var done = assert.async();
      setTimeout(function() {
        let $windowSearchButton = Ember.$('button.search-button');
        $windowSearchButton.click();

        done();
      }, 3000);
    });

    Ember.run(() => {
      var done = assert.async();
      setTimeout(function() {
        let $lookupTable = Ember.$('.content table.object-list-view');
        let $lookupTableBody = $lookupTable.children('tbody');
        let $lookupTableRow = $lookupTableBody.children('tr');
        let $lookupTableRowText = $lookupTableRow.find('div.oveflow-text').first();

        assert.equal($sampleText === $.trim($lookupTableRowText.text()), true);
        $lookupTableRowText.click();

        done();
      }, 4000);
    });

    Ember.run(() => {
      var done = assert.async();
      setTimeout(function() {
        assert.equal($sampleText === $lookupField.val(), true);
        $lookupClearButton.click();

        done();
      }, 5000);
    });
  });
});
