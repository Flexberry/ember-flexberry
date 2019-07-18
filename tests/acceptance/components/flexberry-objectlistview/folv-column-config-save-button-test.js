import Ember from 'ember';
import { executeTest } from './execute-folv-test';

executeTest('check column config save button test', (store, assert, app) => {
  assert.expect(3);
  let path = 'ember-flexberry-dummy-suggestion-list';
  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path);

    let $configButton = Ember.$('button.config-button');
    click($configButton);

    andThen(() => {
      let $field = Ember.$('div.ui.action.input');
      let $fieldInput = $field.children('input');

      assert.equal($field.children('.cols-config-save.disabled').length === 1, true, 'button disabled');
      fillIn($fieldInput, 'aaayyyeee leemaauuuu');
    });

    andThen(() => {
      let $field = Ember.$('div.ui.action.input');
      assert.equal($field.children('.cols-config-save.disabled').length === 0, true, 'button active');
    });
  });
});
