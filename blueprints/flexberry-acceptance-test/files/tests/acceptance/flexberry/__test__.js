import { test } from 'qunit';

import moduleForAcceptance from '<%= testFolderRoot %><% if (testFolderRoot === "../..") {%>/..<%}%>/tests/helpers/module-for-acceptance';

moduleForAcceptance('[AGAT] <%= friendlyTestName %>');

test('testing <%= dasherizedModuleName %>', function(assert) {
  visit('/<%= dasherizedModuleName %>');

  checkOlvConfig('[data-test-component=flexberry-objectlistview]', null, assert, [
    'refreshButton',
    'createNewButton',
    'colsConfigButton',
  ]);

  andThen(() => {
    const listNotEmpty = find('.object-list-view-helper-column').length > 0;

    const controller = this.application.__container__.lookup('controller:' + currentRouteName());
    const newFormRoute = controller.get('editFormRoute') + '.new';
    goToNewForm('[data-test-component=flexberry-objectlistview]', null, assert, newFormRoute);

    click('.close-button');

    if (listNotEmpty) {
      click('[data-test-component=flexberry-objectlistview] td.field:first');
    }
  });
});
