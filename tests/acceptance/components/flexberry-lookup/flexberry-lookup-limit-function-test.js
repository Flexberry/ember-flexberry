import Ember from 'ember';
import { Query } from 'ember-flexberry-data';
const { StringPredicate } = Query;

import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup limit function test', (store, assert, app) => {
  visit('components-acceptance-tests/flexberry-lookup/settings-example-limit-function');

  andThen(function() {
    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-limit-function');

    let $limitFunctionButton = Ember.$('.limitFunction');
    let $lookupChouseButton = Ember.$('.ui-change');

    Ember.run(() => {
      $limitFunctionButton.click();
      $lookupChouseButton.click();
    });

    let store = app.__container__.lookup('service:store');
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let limitType = controller.limitType;
    let queryPredicate = new StringPredicate('name').contains(limitType);

    // Create limit for query.
    let query = new Query.Builder(store)
      .from('ember-flexberry-dummy-suggestion-type')
      .selectByProjection('SettingLookupExampleView')
      .where(queryPredicate);

    // Load olv data.
    store.query('ember-flexberry-dummy-suggestion-type', query.build()).then((suggestionTypes) => {

      let suggestionTypesArr = suggestionTypes.toArray();
      let suggestionModelLength = suggestionTypesArr.length;

      let done = assert.async();

      Ember.run(() => {
        setTimeout(function() {
          let $lookupSearch = Ember.$('.content table.object-list-view');
          let $lookupSearchThead = $lookupSearch.children('tbody');
          let $lookupSearchTr = $lookupSearchThead.children('tr');
          let $lookupRows = $lookupSearchTr.children('td');
          let $suggestionTableLength = $lookupSearchTr.length;

          assert.expect(2 + $suggestionTableLength);

          assert.strictEqual(suggestionModelLength >= $suggestionTableLength, true,
            'Сorrect number of values restrictions limiting function');

          // Сomparison data in the model and olv table.
          for (let i = 0; i < $suggestionTableLength; i++) {
            let suggestionType = suggestionTypesArr.objectAt(i);
            let suggestionTypeName = suggestionType.get('name');

            let $cell = $($lookupRows[3 * i + 1]);
            let $cellDiv = $cell.children('div');
            let $cellText = $cellDiv.text().trim();

            assert.strictEqual(suggestionTypeName === $cellText, true, 'Сorrect data at lookup\'s olv');
          }

          done();
        }, 2000);
      });
    });
  });
});
