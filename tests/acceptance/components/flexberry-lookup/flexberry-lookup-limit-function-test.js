import $ from 'jquery';
import { run } from '@ember/runloop';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import { StringPredicate } from 'ember-flexberry-data/query/predicate';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup limit function test', async (store, assert, app) => {
  await visit('components-acceptance-tests/flexberry-lookup/settings-example-limit-function');

  assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-limit-function');

  let $limitFunctionButton = $('.limitFunction');
  let $lookupChooseButton = $('.ui-change');

  run(() => {
    click($limitFunctionButton);
    click($lookupChooseButton);
  });

  let controller = app.__container__.lookup('controller:' + currentRouteName());
  let limitType = controller.limitType;
  let queryPredicate = new StringPredicate('name').contains(limitType);

  // Create limit for query.
  let query = new QueryBuilder(store)
    .from('ember-flexberry-dummy-suggestion-type')
    .selectByProjection('SettingLookupExampleView')
    .where(queryPredicate);

  // Load olv data.
  let suggestionTypes = await store.query('ember-flexberry-dummy-suggestion-type', query.build());
  let suggestionTypesArr = suggestionTypes.toArray();
  let suggestionModelLength = suggestionTypesArr.length;

  let $lookupSearch = $('.content table.object-list-view');
  let $lookupSearchTr = $lookupSearch.children('tbody').children('tr');
  let $suggestionTableLength = $lookupSearchTr.length;

  assert.expect(2 + $suggestionTableLength);

  assert.strictEqual(suggestionModelLength >= $suggestionTableLength, true,
    'Correct number of values restrictions limiting function');

  // Comparison data in the model and olv table.
  for (let i = 0; i < $suggestionTableLength; i++) {
    let suggestionType = suggestionTypesArr.objectAt(i);
    let suggestionTypeName = suggestionType.get('name');

    let $cell = $($lookupSearchTr[i]).children('td').eq(1); // Assuming name is in the second column
    let $cellText = $cell.children('div').text().trim();

    assert.strictEqual(suggestionTypeName, $cellText, 'Correct data at lookup\'s olv');
  }
});
