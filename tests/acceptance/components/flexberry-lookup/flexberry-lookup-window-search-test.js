import { settled } from '@ember/test-helpers';
import { executeTest } from './execute-flexberry-lookup-test';
import $ from 'jquery';

executeTest('flexberry-lookup window search test', async (store, assert, app) => {
  assert.expect(3);
  let path = 'components-examples/flexberry-lookup/customizing-window-example';
  
  await visit(path);
  assert.equal(currentPath(), path);

  let $lookupChooseButton = $('button.ui-change');
  await click($lookupChooseButton);

  // Проверка существования поля поиска
  await settled();
  let $windowSearchField = $('div.block-action-input').children('input');
  let $lookupTable = $('.content table.object-list-view');
  let $lookupTableBody = $lookupTable.children('tbody');
  let $lookupTableRow = $lookupTableBody.children('tr');
  let $lookupTableRowText = $lookupTableRow.find('div.oveflow-text').eq(2);

  assert.equal($windowSearchField.length, 1, 'search exists');

  let sampleText = $.trim($lookupTableRowText.text());
  await fillIn($windowSearchField, sampleText);

  let $windowSearchButton = $('button.search-button');
  await click($windowSearchButton);

  // Проверка, что поиск работает
  await settled();
  $lookupTable = $('.content table.object-list-view');
  $lookupTableBody = $lookupTable.children('tbody');
  $lookupTableRow = $lookupTableBody.children('tr');
  let $lookupTableRowTextAfterSearch = $lookupTableRow.find('div.oveflow-text').first();

  assert.equal(sampleText === $.trim($lookupTableRowTextAfterSearch.text()), true, 'search works');
});
