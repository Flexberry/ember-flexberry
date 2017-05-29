import Ember from 'ember';
import {executeTest} from './readonly-base-test';

executeTest('test readonly correctly', (store, assert, app) => {
  assert.expect(14);
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

    let $textboxState = $fieldsComponents.children('.flexberry-textbox');
    let $textboxInput = $textboxState.children('input');
    assert.strictEqual(Ember.$.trim($textboxInput.attr('readonly')),
    'readonly', 'Textbox is readonly');

    let $textareaState = $fieldsComponents.children('.flexberry-textarea');
    let $textareaInput = $textareaState.children('textarea');
    assert.strictEqual(Ember.$.trim($textareaInput.attr('readonly')), 'readonly', 'Textarea is readonly');

    let $twoFieldsComponents =  $component.children('.fields');
    let $fields = $twoFieldsComponents.children('div.field');
    let $date = $($fields[1]).children('.flexberry-simpledatetime');
    let $dateInput = $date.children('input.ember-text-field');
    assert.strictEqual(Ember.$.trim($dateInput.attr('readonly')), 'readonly', 'Time is readonly');

    let $enumerationState = $fieldsComponents.children('.flexberry-dropdown');
    assert.strictEqual($enumerationState.hasClass('disabled'), true, 'Enumeration is readonly');

    let $fileState = $fieldsComponents.children('.flexberry-file');
    let $fileDivInput = $fileState.children('div.input');
    let $fileInput = $fileDivInput.children('input.flexberry-file-filename-input');
    assert.strictEqual(Ember.$.trim($fileInput.attr('readonly')), 'readonly', 'Flexberry-file is readonly');

    let $lookupState = $fieldsComponents.children('.flexberry-lookup');
    let $lookupDivInput = $($lookupState[0]).children('div.input');
    let $lookupInput = $lookupDivInput.children('input.lookup-field');
    assert.strictEqual(Ember.$.trim($lookupInput.attr('readonly')), 'readonly', 'Lookup is readonly');

    let $dropdownState = $($lookupState[1]).children('.flexberry-dropdown');
    assert.strictEqual($dropdownState.hasClass('disabled'), true, 'Lookup as dropdown is readonly');

    let $fgeState = $fieldsComponents.children('.ember-view');

    let $fgeButtonState = $($fgeState[7]).children('.groupedit-toolbar');
    let $buttonSatate = $fgeButtonState.children('.ui button');
    let $buttonDisabledState = $fgeButtonState.children('button.disabled');
    assert.strictEqual(Ember.$.trim($buttonSatate.attr('disabled')), 'disabled', 'FGE button is readonly');
    assert.strictEqual(Ember.$.trim($buttonDisabledState.attr('disabled')), 'disabled', 'FGE disabled button is readonly');

    let $groupEditSatate = $fgeState.children('.object-list-view-container');
    let $groupedit = $groupEditSatate.children('.JColResizer');
    assert.strictEqual($groupedit.hasClass('readonly'), true, 'Groupedit is readonly');

    controller.set('readonly', false);
    assert.strictEqual(controller.get('readonly'), false, 'Controller\'s flag \'readonly\' is disabled');

    // assert.strictEqual($checkboxState.hasClass('read-only'), false, 'Checkbox don\'t readonly');
    // assert.strictEqual(Ember.$.trim($textboxInput.attr('readonly')), '', 'Textbox don\'t readonly');
    // assert.strictEqual(Ember.$.trim($textareaInput.attr('readonly')), '', 'Textarea don\'t readonly');
    // assert.strictEqual(Ember.$.trim($dateInput.attr('readonly')), '', 'Time don\'t readonly');
    // assert.strictEqual($enumerationState.hasClass('disabled'), false, 'Enumeration don\'t readonly');
    // assert.strictEqual(Ember.$.trim($fileInput.attr('readonly')), '', 'Flexberry-file don\'t readonly');
    // assert.strictEqual(Ember.$.trim($lookupInput.attr('readonly')), '', 'Lookup don\'t readonly');
    // assert.strictEqual($dropdownState.hasClass('disabled'), false, 'Lookup as dropdown don\'t readonly');
    // assert.strictEqual(Ember.$.trim($buttonSatate.attr('disabled')), '', 'FGE button don\'t readonly');
    // assert.strictEqual(Ember.$.trim($buttonDisabledState.attr('disabled')), '', 'FGE disabled button don\'t readonly');
    // assert.strictEqual($groupedit.hasClass('readonly'), false, 'Groupedit don\'t readonly');
  });
});

