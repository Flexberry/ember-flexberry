import $ from 'jquery';
import { run } from '@ember/runloop';
import { typeOf, isNone } from '@ember/utils';
import { A } from '@ember/array';
import { module, test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { render, click } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';

module('flexberry-checkbox', function(hooks) {
  setupRenderingTest(hooks);

  test('Component renders properly', async function(assert) {
    
    assert.expect(15);

    await render(hbs`{{flexberry-checkbox caption=caption class=class}}`);

    // Retrieve component, it's inner <input>.
    let $component = this.element.querySelector('.flexberry-checkbox');
    let $checkboxInput = $component.querySelector('input');

    // Check wrapper <div>.
    assert.strictEqual($component.tagName, 'DIV', 'Component\'s wrapper is a <div>');
    assert.strictEqual($component.classList.contains('flexberry-checkbox'), true, 'Component\'s container has \'flexberry-checkbox\' css-class');
    assert.strictEqual($component.classList.contains('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
    assert.strictEqual($component.classList.contains('checkbox'), true, 'Component\'s wrapper has \'checkbox\' css-class');

    // Check <input>.
    assert.strictEqual($checkboxInput !== null, true, 'Component has inner <input>');
    assert.strictEqual($checkboxInput.type, 'checkbox', 'Component\'s inner <input> is of checkbox type');
    assert.strictEqual(
      $checkboxInput.classList.contains('flexberry-checkbox-input'),
      true,
      'Component\'s inner checkbox <input> has flexberry-checkbox-input css-class');
    assert.strictEqual($checkboxInput.classList.contains('hidden'), true, 'Component\'s inner checkbox <input> has \'hidden\' css-class');
    assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked');

    // Check wrapper's additional CSS-classes.
    let additionalCssClasses = 'radio slider toggle';
    this.set('class', additionalCssClasses);

    /* eslint-disable no-unused-vars */
    A(additionalCssClasses.split(' ')).forEach((cssClassName, index) => {
      assert.strictEqual(
        $component.classList.contains(cssClassName),
        true,
      'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */

    this.set('class', '');
    /* eslint-disable no-unused-vars */
    A(additionalCssClasses.split(' ')).forEach((cssClassName, index) => {
      assert.strictEqual(
        $component.classList.contains(cssClassName),
        false,
        'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */
  });
  
  test('Component renders it\'s label properly', async function(assert) {
    assert.expect(5);

    await render(hbs`{{flexberry-checkbox label=label}}`);

    // Retrieve component, it's inner <label>.
    let $component = this.element.querySelector('.flexberry-checkbox');
    let $checkboxLabel = $component.querySelector('label');

    // Check <label>'s text.
    assert.strictEqual($checkboxLabel !== null, true, 'Component has inner <label>');
    assert.strictEqual(
      $checkboxLabel.classList.contains('flexberry-checkbox-label'),
      true,
      'Component\'s inner <label> has flexberry-checkbox-label css-class');
    assert.strictEqual(
      $checkboxLabel.textContent.trim().length === 0,
      true,
      'Component\'s inner <label> is empty by default');

    // Define some label & check <label>'s text again.
    let label = 'This is checkbox';
    this.set('label', label);
    assert.strictEqual(
      $checkboxLabel.textContent.trim() === label,
      true,
      `Component's inner <label> has text defined in component's 'label' property: '${label}'`);

    // Clean up defined label & check <label>'s text again.
    label = null;
    this.set('label', label);
    assert.strictEqual(
      $checkboxLabel.textContent.trim().length === 0,
      true,
      `Component's inner <label> is empty if component's 'label' property is cleaned up`);
  });
  
  test('Changes in checkbox causes changes in binded value', async function(assert) {
    assert.expect(9);

    await render(hbs`{{flexberry-checkbox value=flag}}`);

    // Retrieve component & it's inner <input>.
    let $component = this.element.querySelector('.flexberry-checkbox');
    let $checkboxInput = $component.querySelector('input');

    // Check component's initial state.
    assert.strictEqual($component.classList.contains('checked'), false, 'Component hasn\'t css-class \'checked\' before first click');
    assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked before first click');
    assert.strictEqual(typeof this.flag, 'undefined', 'Component\'s binded value is \'undefined\' before first click');

    // Imitate click on component (change it's state to checked) & check it's state again.
    // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into run function.
     await click($component);
    assert.strictEqual($component.classList.contains('checked'), true, 'Component has css-class \'checked\' after click');
    assert.strictEqual($checkboxInput.checked, true, 'Component\'s inner checkbox <input> is checked after click');
    assert.strictEqual(this.flag, true, 'Component\'s binded value is \'true\' after click');

    // Imitate click on component again (change it's state to unchecked) & check it's state again.
    // Sometimes ember recognizes programmatical imitations of UI-events as asynchrony, so we should wrap them into run function.
    await click($component);
    assert.strictEqual($component.classList.contains('checked'), false, 'Component hasn\'t css-class \'checked\' after second click');
    assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked after second click');
    assert.strictEqual(this.flag, false, 'Component\'s binded value is \'false\' after second click');
  });
  
  test('Changes in in binded value causes changes in checkbox', async function(assert) {
    assert.expect(7);

    await render(hbs`{{flexberry-checkbox value=flag}}`);

    // Retrieve component & it's inner <input>.
    let $component = this.element.querySelector('.flexberry-checkbox');
    let $checkboxInput = $component.querySelector('input');

    // Check component's initial state.
    assert.strictEqual($component.classList.contains('checked'), false, 'Component hasn\'t css-class \'checked\' by default');
    assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked by default');
    assert.strictEqual(typeof this.flag, 'undefined', 'Component\'s binded value is \'undefined\' by default');

    // Change binded value to 'true' & check component's state again (it must be checked).
    this.set('flag', true);
    assert.strictEqual($component.classList.contains('checked'), true, 'Component has css-class \'checked\' after binded value changed to \'true\'');
    assert.strictEqual($checkboxInput.checked, true, 'Component\'s inner checkbox <input> is checked after binded value changed to \'true\'');

    // Change binded value to 'false' & check component's state again (it must be unchecked).
    this.set('flag', false);
    assert.strictEqual($component.classList.contains('checked'), false, 'Component hasn\'t css-class \'checked\' after binded value changed to \'false\'');
    assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked after binded value changed to \'false\'');
  });

  test('Component sends \'onChange\' action', async function(assert) {
    assert.expect(2);

    let onCheckboxChangeEventObject = null;
    this.set('onCheckboxChange', (e) => {
      onCheckboxChangeEventObject = e;
    });

    await render(hbs`{{flexberry-checkbox value=flag onChange=this.onCheckboxChange}}`);

    // Retrieve component.
    let $component = this.element.querySelector('.flexberry-checkbox');

    // Imitate click on component (change its state to checked) & check action's event object.
    await click($component);
    assert.strictEqual(
      onCheckboxChangeEventObject.checked,
      true,
      'Component sends \'onChange\' action with \'checked\' property equals to \'true\' after first click'
    );

    // Imitate click on component again (change its state to unchecked) & check action's event object again.
    await click($component);
    assert.strictEqual(
      onCheckboxChangeEventObject.checked,
      false,
      'Component sends \'onChange\' action with \'checked\' property equals to \'false\' after second click'
    );
  });

  test('Component works properly in readonly mode', async function(assert) {
    assert.expect(11);

    let onCheckboxChangeEventObject = null;
    this.set('onCheckboxChange', (e) => {
      onCheckboxChangeEventObject = e;
    });

    this.set('readonly', false);
    this.set('flag', undefined);

    await render(hbs`{{flexberry-checkbox readonly=this.readonly value=this.flag onChange=this.onCheckboxChange}}`);

    // Retrieve component & its inner <input>.
    let $component = this.element.querySelector('.flexberry-checkbox');
    let $checkboxInput = $component.querySelector('input');

    // Check component's initial state.
    assert.strictEqual($component.classList.contains('read-only'), false, 'Component hasn\'t css-class \'read-only\' by default');

    // Enable readonly mode & check component's state again.
    this.set('readonly', true);
    assert.strictEqual($component.classList.contains('read-only'), true, 'Component has css-class \'read-only\' when readonly mode is enabled');

    // Imitate click on component (try to change its state to checked) & check its state & action's event object.
    await click($component);
    assert.strictEqual(
      onCheckboxChangeEventObject,
      null,
      'Component doesn\'t send \'onChange\' action in readonly mode'
    );
    assert.strictEqual(
      $component.classList.contains('checked'),
      false,
      'Component hasn\'t css-class \'checked\' after click in readonly mode'
    );
    assert.strictEqual(
      $checkboxInput.checked,
      false,
      'Component\'s inner checkbox <input> isn\'t checked after click in readonly mode'
    );
    assert.strictEqual(
      typeof this.get('flag'),
      'undefined',
      'Component\'s binded value is still \'undefined\' after click in readonly mode'
    );

    // Disable readonly mode & check component's state again.
    this.set('readonly', false);
    assert.strictEqual($component.classList.contains('read-only'), false, 'Component hasn\'t css-class \'read-only\' when readonly mode is disabled');

    // Imitate click on component (try to change its state to checked) & check its state & action's event object.
    await click($component);
    assert.strictEqual(
      isNone(onCheckboxChangeEventObject),
      false,
      'Component sends \'onChange\' action when readonly mode is disabled'
    );
    assert.strictEqual(
      $component.classList.contains('checked'),
      true,
      'Component has css-class \'checked\' after first click when readonly mode is disabled'
    );
    assert.strictEqual(
      $checkboxInput.checked,
      true,
      'Component\'s inner checkbox <input> is checked after first click when readonly mode is disabled'
    );
    assert.strictEqual(
      this.get('flag'),
      true,
      'Component\'s binded value is equals to \'true\' after first click when readonly mode is disabled'
    );
  });

  test('Setting up classes in checkbox', async function(assert) {
    assert.expect(6);
  
    let checkClass = 'radio slider toggle';
    this.set('class', checkClass);
    await render(hbs`{{flexberry-checkbox value=flag class=class}}`);
  
    // Retrieve component.
    let $component = this.element.querySelector('.flexberry-checkbox');
  
    // Check component's initial state.
    assert.strictEqual($component.classList.contains('radio'), true, 'Component hasn\'t css-class \'radio\' by default');
    assert.strictEqual($component.classList.contains('slider'), true, 'Component hasn\'t css-class \'slider\' by default');
    assert.strictEqual($component.classList.contains('toggle'), true, 'Component hasn\'t css-class \'toggle\' by default');

    // Change binded value to 'true' & check component's state again (it must be checked).
    this.set('flag', true);

    // Check component's after change state.
    assert.strictEqual($component.classList.contains('radio'), true, 'Component hasn\'t css-class \'radio\' after change');
    assert.strictEqual($component.classList.contains('slider'), true, 'Component hasn\'t css-class \'slider\' after change');
    assert.strictEqual($component.classList.contains('toggle'), true, 'Component hasn\'t css-class \'toggle\' after change');
  });
});
