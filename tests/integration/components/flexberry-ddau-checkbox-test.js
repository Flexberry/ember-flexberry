import Ember from 'ember';
import $ from 'jquery';
import { A } from '@ember/array';
import FlexberryDdauCheckboxComponent from 'ember-flexberry/components/flexberry-ddau-checkbox';
import FlexberryDdauCheckboxActionsHandlerMixin from 'ember-flexberry/mixins/flexberry-ddau-checkbox-actions-handler';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | flexberry-ddau-checkbox', function(hooks) {
  setupRenderingTest(hooks);

  test('Component renders properly', async function(assert) {
    assert.expect(17);

    await render(hbs`{{flexberry-ddau-checkbox caption=caption class=class}}`);

    // Retrieve component, it's inner <input> & <label>.
    let $component = this.element.children[0];
    let $checkboxInput = $component.querySelector('input');
    let $checkboxCaption = $component.querySelector('label');

    let flexberryClassNames = FlexberryDdauCheckboxComponent.flexberryClassNames;

    // Check wrapper <div>.
    assert.strictEqual($component.tagName, 'DIV', 'Component\'s wrapper is a <div>');
    assert.ok($component.classList.contains(flexberryClassNames.wrapper), 'Component\'s container has \'' + flexberryClassNames.wrapper + '\' css-class');
    assert.ok($component.classList.contains('ui'), 'Component\'s wrapper has \'ui\' css-class');
    assert.ok($component.classList.contains('checkbox'), 'Component\'s wrapper has \'checkbox\' css-class');

    // Check <input>.
    assert.strictEqual($checkboxInput !== null, true, 'Component has inner <input>');
    assert.strictEqual($checkboxInput.type, 'checkbox', 'Component\'s inner <input> is of checkbox type');
    assert.ok($checkboxInput.classList.contains(flexberryClassNames.checkboxInput), 'Component\'s inner checkbox <input> has \'' + flexberryClassNames.checkboxInput + '\' css-class');
    assert.ok($checkboxInput.classList.contains('hidden'), 'Component\'s inner checkbox <input> has \'hidden\' css-class');
    assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked');

    // Check caption's <label>.
    assert.strictEqual($checkboxCaption !== null, true, 'Component has inner <label>');
    assert.ok($checkboxCaption.classList.contains(flexberryClassNames.checkboxCaption), 'Component\'s inner <label> has \'' + flexberryClassNames.checkboxCaption + '\' css-class');
    assert.strictEqual($.trim($checkboxCaption.textContent).length === 0, true, 'Component\'s inner <label> is empty by default');

    let checkboxCaptionText = 'Checkbox caption';
    this.set('caption', checkboxCaptionText);
    assert.strictEqual($.trim($checkboxCaption.textContent), checkboxCaptionText, 'Component\'s inner <label> text changes when component\'s \'caption\' property changes');

    // Check wrapper's additional CSS-classes.
    let additionalCssClasses = 'additional-css-class-name and-another-one';
    this.set('class', additionalCssClasses);

    A(additionalCssClasses.split(' ')).forEach((cssClassName) => {
      assert.ok($component.classList.contains(cssClassName), 'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
    });

    this.set('class', '');
    A(additionalCssClasses.split(' ')).forEach((cssClassName) => {
      assert.notOk($component.classList.contains(cssClassName), 'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
    });
  });

  test('Component invokes actions', async function(assert) {
    assert.expect(3);

    let latestEventObjects = {
      change: null
    };

    // Bind component's action handlers.
    this.set('actions', {
      onFlagChange: e => {
        latestEventObjects.change = e;
      }
    });

    await render(hbs`{{flexberry-ddau-checkbox change=(action "onFlagChange")}}`);

    // Retrieve component.
    let $component = this.element.children[0];

    assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');

    // Imitate first click on component.
    await click($component);
    assert.notStrictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action was invoked after first click');

    // Imitate second click on component.
    latestEventObjects.change = null;
    await click($component);
    assert.notStrictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action was invoked after second click');
  });

  test('Component changes binded value (without \'change\' action handler)', async function(testAssert) {
    // Mock Ember.assert method.
    let thrownExceptions = A();
    let originalEmberAssert = Ember.assert;
    Ember.assert = function(...args) {
      try {
        originalEmberAssert(...args);
      } catch (ex) {
        thrownExceptions.pushObject(ex);
      }
    };

    testAssert.expect(4);

    this.set('flag', false);
    await render(hbs`{{flexberry-ddau-checkbox value=flag}}`);

    // Retrieve component & it's inner <input>.
    let $component = this.element.children[0];
    let $checkboxInput = $component.querySelector('input');

    // Check component's initial state.
    testAssert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked before click');

    // Imitate click on component & check for exception.
    await click($component);

    // Check component's state after click (it should be changed).
    testAssert.strictEqual($checkboxInput.checked, true, 'Component\'s inner checkbox <input> is checked after click (without \'change\' action handler)');

    // Check binded value state after click (it should be unchanged, because 'change' action handler is not defined).
    testAssert.strictEqual(this.get('flag'), true, 'Component\'s binded value changed (without \'change\' action handler)');

    testAssert.strictEqual(
      thrownExceptions.length === 1 && (/.*required.*change.*action.*not.*defined.*/gi).test(thrownExceptions[0].message),
      true,
      'Component throws single exception if \'change\' action handler is not defined'
    );

    // Clean up after mock Ember.assert.
    Ember.assert = originalEmberAssert;
  });

  test('Component changes binded value (with \'change\' action handler)', async function(assert) {
    assert.expect(7);

    this.set('flag', false);

    // Bind component's 'change' action handler.
    this.set('actions', {
      onFlagChange: e => {
        assert.strictEqual(e.originalEvent.target.id, this.element.querySelector('input').id);
        this.set('flag', e.newValue);
      }
    });

    await render(hbs`{{flexberry-ddau-checkbox value=flag change=(action "onFlagChange")}}`);

    // Retrieve component & it's inner <input>.
    let $component = this.element.children[0];
    let $checkboxInput = $component.querySelector('input');

    // Check component's initial state.
    assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked before click');

    // Make component checked.
    await click($component);
    assert.strictEqual($checkboxInput.checked, true, 'Component\'s inner checkbox <input> is checked after click (with \'change\' action handler)');
    assert.strictEqual(this.get('flag'), true, 'Component\'s binded value changed (with \'change\' action handler)');

    // Make component unchecked.
    await click($component);
    assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> is unchecked after second click (with \'change\' action handler)');
    assert.strictEqual(this.get('flag'), false, 'Component\' binded value changed after second click (with \'change\' action handler)');
  });

  test('Component changes binded value (with \'change\' action handler from special mixin)', async function(assert) {
    assert.expect(5);

    this.set('flag', false);

    // Bind component's 'change' action handler from specialized mixin.
    this.set('actions', {
      onCheckboxChange: FlexberryDdauCheckboxActionsHandlerMixin.mixins[0].properties.actions.onCheckboxChange
    });

    await render(hbs`{{flexberry-ddau-checkbox value=flag change=(action "onCheckboxChange" "flag")}}`);

    // Retrieve component & it's inner <input>.
    let $component = this.element.children[0];
    let $checkboxInput = $component.querySelector('input');

    // Check component's initial state.
    assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked before click');

    // Make component checked.
    await click($component);
    assert.strictEqual($checkboxInput.checked, true, 'Component\'s inner checkbox <input> is checked after click (with \'change\' action handler from special mixin)');
    assert.strictEqual(this.get('flag'), true, 'Component changed binded value (with \'change\' action handler from special mixin)');

    // Make component unchecked.
    await click($component);
    assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> is unchecked after second click (with \'change\' action handler from special mixin)');
    assert.strictEqual(this.get('flag'), false, 'Component changed binded value after second click (with \'change\' action handler from special mixin)');
  });

  test('Component works properly in readonly mode', async function(assert) {
    assert.expect(9);

    let latestEventObjects = {
      change: null
    };

    // Bind component's action handlers.
    this.set('actions', {
      onFlagChange: e => {
        latestEventObjects.change = e;
      }
    });

    // Render component in readonly mode.
    this.set('flag', false);
    this.set('readonly', true);
    await render(hbs`{{flexberry-ddau-checkbox value=flag readonly=readonly change=(action "onFlagChange")}}`);

    // Retrieve component & it's inner <input>.
    let $component = this.element.children[0];
    let $checkboxInput = $component.querySelector('input');

    // Check component's initial state.
    assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked before click');

    // Imitate click on component.
    await click($component);

    // Check after click state.
    assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked after click');
    assert.strictEqual(latestEventObjects.change, null, 'Component doesn\'t send \'change\' action in readonly mode');

    // Disable readonly mode.
    this.set('readonly', false);

    // Imitate click on component.
    await click($component);

    // Check after click state.
    assert.strictEqual($checkboxInput.checked, true, 'Component\'s inner checkbox <input> is checked after click');
    assert.notStrictEqual(latestEventObjects.change, null, 'Component send \'change\' action after readonly mode disabling');

    latestEventObjects.change = null;

    // Imitate click on component.
    await click($component);

    // Check after click state.
    assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> is unchecked after click');
    assert.notStrictEqual(latestEventObjects.change, null, 'Component send \'change\' action after readonly mode disabling');

    latestEventObjects.change = null;

    // Enable readonly mode again.
    this.set('readonly', true);

    // Imitate click on component.
    await click($component);

    // Check after click state.
    assert.strictEqual($checkboxInput.checked, false, 'Component\'s inner checkbox <input> isn\'t checked after click');
    assert.strictEqual(latestEventObjects.change, null, 'Component doesn\'t send \'change\' action in readonly mode');
  });
});