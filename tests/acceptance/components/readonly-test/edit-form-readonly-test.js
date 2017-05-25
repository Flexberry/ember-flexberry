import Ember from 'ember';
import {executeTest} from './readonly-base-test';

executeTest('test readonly correctly', (store, assert, app) => {
  assert.expect(5);
  let path = 'components-acceptance-tests/edit-form-readonly';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path, 'Path for edit-form-readonly-test is correctly');

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    assert.strictEqual(controller.get('readonly'), true, 'Controller\'s flag \'readonly\' is enabled');

    let $component = Ember.$('.flexberry-vertical-form');
    let $fieldsComponents =  $component.children('.field');

    let $checkboxState = $fieldsComponents.children('.flexberry-checkbox');
    assert.strictEqual($checkboxState.hasClass('read-only'), true, 'Checkbox is readonly');

    let $textboxNumberState = $fieldsComponents.children('.flexberry-textbox');
    let $textboxNumberInput = $textboxNumberState.children('input');

    assert.strictEqual(assert.strictEqual(Ember.$.trim($textboxNumberInput.attr('readonly')),
    'readonly', 'Textbox is readonly'));
  });
});

