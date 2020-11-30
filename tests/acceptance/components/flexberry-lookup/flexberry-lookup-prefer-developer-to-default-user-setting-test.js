/* eslint-disable ember/use-ember-get-and-set */
/* eslint-disable ember/no-test-import-export */
/* eslint-disable no-undef */
/* eslint-disable ember/no-test-and-then */
import Ember from 'ember';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup prefer developer to default user setting test', (store, assert) => {
  assert.expect(2);

  visit('components-examples/flexberry-lookup/user-settings-example');

  andThen(function () {
    assert.equal(currentURL(), 'components-examples/flexberry-lookup/user-settings-example');

    // eslint-disable-next-line ember/no-jquery
    let $lookupButtouChoose = Ember.$('.ui-change');

    // Click choose button.
    Ember.run(() => {
      $lookupButtouChoose.click();
    });

    Ember.run(() => {
      var done = assert.async();
      setTimeout(function () {

        // eslint-disable-next-line ember/no-jquery
        let $lookupSearch = Ember.$('.content table.object-list-view');
        let $lookupSearchThead = $lookupSearch.children('thead');
        let $lookupSearchTr = $lookupSearchThead.children('tr');
        let $lookupHeaders = $lookupSearchTr.children('th');

        // Check count at table header.
        assert.strictEqual($lookupHeaders.length === 1, true, 'Component render olv with developer user setting');

        done();
      }, 1000);
    });
  });
}, (app) => {
  const suggestionTypeDefaultUserSetting =
  `{
    "colsOrder": [
      {
        "propName": "name"
      },
      {
        "propName": "moderated"
      }
    ]
  }`;
  app.register('user-setting:ember-flexberry-dummy-suggestion-type', suggestionTypeDefaultUserSetting, { instantiate: false });
  const controller = app.__container__.lookup('controller:components-acceptance-tests/flexberry-lookup/settings-example-projection');
  controller.set('notUseUserSettings', true);

  const route = app.__container__.lookup('route:components-acceptance-tests/flexberry-lookup/settings-example-projection');
  route.set('developerUserSettings', {
    SuggestionTypeObjectlistView: {
      DEFAULT: {
        colsOrder: [
          {
            propName: 'name'
          }
        ]
      }
    }
  });
});
