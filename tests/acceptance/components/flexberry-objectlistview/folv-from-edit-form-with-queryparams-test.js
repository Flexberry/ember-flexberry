import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { openEditFormByFunction } from './folv-tests-functions';

executeTest('check return from editForm with queryParam', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-list?perPage=5';
  visit(path);
  andThen(() => {

    // Open editFirn function.
    let openEditFormFunction =  function() {
      let editButtonInRow = Ember.$('.object-list-view-row-edit-button')[0];
      editButtonInRow.click();
    };

    // Open editform.
    let done1 = assert.async();
    openEditFormByFunction(openEditFormFunction).then(() => {
      assert.ok(true, 'edit form open');

      let returnToEditFormButton = Ember.$('.return-to-list-form')[0];
      returnToEditFormButton.click();

      let timeout = 1000;
      let done2 = assert.async();
      Ember.run.later((function() {
        let controller = app.__container__.lookup('controller:' + currentRouteName());
        assert.equal(controller.model.content.length, 1, 'QueryParams applied successfully');
        done2();
      }), timeout);

      done1();
    });
  });
});
