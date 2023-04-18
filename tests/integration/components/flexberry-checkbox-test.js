import $ from 'jquery';
import { run } from '@ember/runloop';
import { typeOf, isNone } from '@ember/utils';
import { get } from '@ember/object';
import { A } from '@ember/array';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-checkbox', 'Integration | Component | flexberry-checkbox', {
  integration: true,
});

test('Component renders properly', function(assert) {
  assert.expect(15);

  this.render(hbs`{{flexberry-checkbox caption=caption class=class}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $checkboxInput = $component.children('input');
  let isCheckboxDisplayed = $checkboxInput.css('display') !== 'none';


  // Check wrapper <div>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual($component.hasClass('flexberry-checkbox'), true, 'Component\'s container has \'flexberry-checkbox\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($component.hasClass('checkbox'), true, 'Component\'s wrapper has \'checkbox\' css-class');

  // Check <input>.
  assert.strictEqual($checkboxInput.length === 1, true, 'Component has inner <input>');
  assert.strictEqual($checkboxInput.attr('type'), 'checkbox', 'Component\'s inner <input> is of checkbox type');
  assert.strictEqual(
    $checkboxInput.hasClass('flexberry-checkbox-input'),
    true,
    'Component\'s inner checkbox <input> has flexberry-checkbox-input css-class');
  assert.strictEqual(isCheckboxDisplayed, true, 'Component can\'t be focused');
  assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked');

  // Check wrapper's additional CSS-classes.
  let additioanlCssClasses = 'radio slider toggle';
  this.set('class', additioanlCssClasses);

  /* eslint-disable no-unused-vars */
  A(additioanlCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    true,
    'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
  });
  /* eslint-enable no-unused-vars */

  this.set('class', '');
  /* eslint-disable no-unused-vars */
  A(additioanlCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    false,
    'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
  });
  /* eslint-enable no-unused-vars */
});

test('Component renders it\'s label properly', function(assert) {
  assert.expect(5);

  this.render(hbs`{{flexberry-checkbox label=label}}`);

  // Retrieve component, it's inner <label>.
  let $component = this.$().children();
  let $checkboxLabel = $component.children('label');

  // Check <label>'s text.
  assert.strictEqual($checkboxLabel.length === 1, true, 'Component has inner <label>');
  assert.strictEqual(
    $checkboxLabel.hasClass('flexberry-checkbox-label'),
    true,
    'Component\'s inner <label> has flexberry-checkbox-label css-class');
  assert.strictEqual(
    $.trim($checkboxLabel.text()).length === 0,
    true,
    'Component\'s inner <label> is empty by default');

  // Define some label & check <label>'s text again.
  let label = 'This is checkbox';
  this.set('label', label);
  assert.strictEqual(
    $.trim($checkboxLabel.text()) === label,
    true,
    `Component's inner <label> has text defined in component's 'label' property: '${label}'`);

  // Clean up defined label & check <label>'s text again.
  label = null;
  this.set('label', label);
  assert.strictEqual(
    $.trim($checkboxLabel.text()).length === 0,
    true,
    `Component's inner <label> is empty if component's 'label' property is cleaned up`);
});

test('Changes in checkbox causes changes in binded value', function(assert) {
  assert.expect(9);

  this.render(hbs`{{flexberry-checkbox value=flag}}`);

  // Retrieve component & it's inner <input>.
  let $component = this.$().children();
  let $checkboxInput = $component.children('input');

  // Check component's initial state.
  assert.strictEqual($component.hasClass('checked'), false, 'Component hasn\'t css-class \'checked\' before first click');
  assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked before first click');
  assert.strictEqual(typeOf(this.get('flag')), 'undefined', 'Component\'s binded value is \'undefined\' before first click');

  // Imitate click on component (change it's state to checked) & check it's state again.
  // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into run function.
  run(() => {
    $component.click();
    assert.strictEqual($component.hasClass('checked'), true, 'Component has css-class \'checked\' after click');
    assert.strictEqual($checkboxInput.prop('checked'), true, 'Component\'s inner checkbox <input> is checked after click');
    assert.strictEqual(this.get('flag'), true, 'Component\'s binded value is \'true\' after click');
  });

  // Imitate click on component again (change it's state to unchecked) & check it's state again.
  // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into run function.
  run(() => {
    $component.click();
    assert.strictEqual($component.hasClass('checked'), false, 'Component hasn\'t css-class \'checked\' after second click');
    assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked after second click');
    assert.strictEqual(this.get('flag'), false, 'Component\'s binded value is \'false\' after second click');
  });
});

test('Changes in in binded value causes changes in checkbox', function(assert) {
  assert.expect(7);

  this.render(hbs`{{flexberry-checkbox value=flag}}`);

  // Retrieve component & it's inner <input>.
  let $component = this.$().children();
  let $checkboxInput = $component.children('input');

  // Check component's initial state.
  assert.strictEqual($component.hasClass('checked'), false, 'Component hasn\'t css-class \'checked\' by default');
  assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked by default');
  assert.strictEqual(typeOf(this.get('flag')), 'undefined', 'Component\'s binded value is \'undefined\' by default');

  // Change binded value to 'true' & check component's state again (it must be checked).
  this.set('flag', true);
  assert.strictEqual($component.hasClass('checked'), true, 'Component has css-class \'checked\' after binded value changed to \'true\'');
  assert.strictEqual($checkboxInput.prop('checked'), true, 'Component\'s inner checkbox <input> is checked after binded value changed to \'true\'');

  // Change binded value to 'false' & check component's state again (it must be unchecked).
  this.set('flag', false);
  assert.strictEqual($component.hasClass('checked'), false, 'Component hasn\'t css-class \'checked\' after binded value changed to \'false\'');
  assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked after binded value changed to \'false\'');
});

test('Component sends \'onChange\' action', function(assert) {
  assert.expect(2);

  let onCheckboxChangeEventObject = null;
  this.set('actions.onCheckboxChange', (e) => {
    onCheckboxChangeEventObject = e;
  });

  this.render(hbs`{{flexberry-checkbox value=flag onChange=(action \"onCheckboxChange\")}}`);

  // Retrieve component.
  let $component = this.$().children();

  // Imitate click on component (change it's state to checked) & check action's event object.
  // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into run function.
  run(() => {
    $component.click();
    assert.strictEqual(
      get(onCheckboxChangeEventObject, 'checked'),
      true,
      'Component sends \'onChange\' action with \'checked\' property equals to \'true\' after first click');
  });

  // Imitate click on component again (change it's state to unchecked) & check action's event object again.
  // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into run function.
  run(() => {
    $component.click();
    assert.strictEqual(
      get(onCheckboxChangeEventObject, 'checked'),
      false,
      'Component sends \'onChange\' action with \'checked\' property equals to \'false\' after second click');
  });
});

test('Component works properly in readonly mode', function(assert) {
  assert.expect(11);

  let onCheckboxChangeEventObject = null;
  this.set('actions.onCheckboxChange', (e) => {
    onCheckboxChangeEventObject = e;
  });

  this.render(hbs`{{flexberry-checkbox readonly=readonly value=flag onChange=(action \"onCheckboxChange\")}}`);

  // Retrieve component & it's inner <input>.
  let $component = this.$().children();
  let $checkboxInput = $component.children('input');

  // Check component's initial state.
  assert.strictEqual($component.hasClass('read-only'), false, 'Component hasn\'t css-class \'read-only\' by default');

  // Enable readonly mode & check component's state again.
  this.set('readonly', true);
  assert.strictEqual($component.hasClass('read-only'), true, 'Component has css-class \'read-only\' when readonly mode is enabled');

  // Imitate click on component (try to change it's state to checked) & check it's state & action's event object.
  // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into run function.
  run(() => {
    $component.click();
    assert.strictEqual(
      onCheckboxChangeEventObject,
      null,
      'Component doesn\'t send \'onChange\' action in readonly mode');
    assert.strictEqual(
      $component.hasClass('checked'),
      false,
      'Component hasn\'t css-class \'checked\' after click in readonly mode');
    assert.strictEqual(
      $checkboxInput.prop('checked'),
      false,
      'Component\'s inner checkbox <input> isn\'t checked after click in readonly mode');
    assert.strictEqual(
      typeOf(this.get('flag')),
      'undefined',
      'Component\'s binded value is still \'undefined\' after click in readonly mode');
  });

  // Disable readonly mode & check component's state again.
  this.set('readonly', false);
  assert.strictEqual($component.hasClass('read-only'), false, 'Component hasn\'t css-class \'read-only\' when readonly mode is disabled');

  // Imitate click on component (try to change it's state to checked) & check it's state & action's event object.
  // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into run function.
  run(() => {
    $component.click();
    assert.strictEqual(
      isNone(onCheckboxChangeEventObject),
      false,
      'Component sends \'onChange\' action when readonly mode is disabled');
    assert.strictEqual(
      $component.hasClass('checked'),
      true,
      'Component has css-class \'checked\' after first click when readonly mode is disabled');
    assert.strictEqual(
      $checkboxInput.prop('checked'),
      true,
      'Component\'s inner checkbox <input> is checked after first click when readonly mode is disabled');
    assert.strictEqual(
      this.get('flag'),
      true,
      'Component\'s binded value is equals to \'true\' after first click when readonly mode is disabled');
  });
});

test('Setting up classes in checkbox', function(assert) {
  assert.expect(6);

  let checkClass = 'radio slider toggle';
  this.set('class', checkClass);
  this.render(hbs`{{flexberry-checkbox value=flag class=class}}`);

  // Retrieve component.
  let $component = this.$().children();

  // Check component's initial state.
  assert.strictEqual($component.hasClass('radio'), true, 'Component hasn\'t css-class \'radio\' by default');
  assert.strictEqual($component.hasClass('slider'), true, 'Component hasn\'t css-class \'slider\' by default');
  assert.strictEqual($component.hasClass('toggle'), true, 'Component hasn\'t css-class \'toggle\' by default');

  // Change binded value to 'true' & check component's state again (it must be checked).
  this.set('flag', true);

  // Check component's afther change state.
  assert.strictEqual($component.hasClass('radio'), true, 'Component hasn\'t css-class \'radio\' afther change');
  assert.strictEqual($component.hasClass('slider'), true, 'Component hasn\'t css-class \'slider\' afther change');
  assert.strictEqual($component.hasClass('toggle'), true, 'Component hasn\'t css-class \'toggle\' afther change');
});
