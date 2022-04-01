import $ from 'jquery';
import { A } from '@ember/array';
import { assert } from '@ember/debug';
import FlexberryDdauCheckboxComponent from 'ember-flexberry/components/flexberry-ddau-checkbox';
import FlexberryDdauCheckboxActionsHandlerMixin from 'ember-flexberry/mixins/flexberry-ddau-checkbox-actions-handler';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-ddau-checkbox', 'Integration | Component | flexberry-ddau-checkbox', {
  integration: true
});

test('Component renders properly', function(assert) {
  assert.expect(17);

  this.render(hbs`{{flexberry-ddau-checkbox caption=caption class=class}}`);

  // Retrieve component, it's inner <input> & <label>.
  let $component = this.$().children();
  let $checkboxInput = $component.children('input');
  let $checkboxCaption = $component.children('label');

  let flexberryClassNames = FlexberryDdauCheckboxComponent.flexberryClassNames;

  // Check wrapper <div>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual(
    $component.hasClass(flexberryClassNames.wrapper),
    true,
    'Component\'s container has \'' + flexberryClassNames.wrapper + '\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($component.hasClass('checkbox'), true, 'Component\'s wrapper has \'checkbox\' css-class');

  // Check <input>.
  assert.strictEqual($checkboxInput.length === 1, true, 'Component has inner <input>');
  assert.strictEqual($checkboxInput.attr('type'), 'checkbox', 'Component\'s inner <input> is of checkbox type');
  assert.strictEqual(
    $checkboxInput.hasClass(flexberryClassNames.checkboxInput),
    true,
    'Component\'s inner checkbox <input> has \'' + flexberryClassNames.checkboxInput + '\' css-class');
  assert.strictEqual($checkboxInput.hasClass('hidden'), true, 'Component\'s inner checkbox <input> has \'hidden\' css-class');
  assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked');

  // Check caption's <label>.
  assert.strictEqual($checkboxCaption.length === 1, true, 'Component has inner <label>');
  assert.strictEqual(
    $checkboxCaption.hasClass(flexberryClassNames.checkboxCaption),
    true,
    'Component\'s inner <label> has \'' + flexberryClassNames.checkboxCaption + '\' css-class');
  assert.strictEqual(
    $.trim($checkboxCaption.text()).length === 0,
    true,
    'Component\'s inner <label> is empty by default');

  let checkboxCaptionText = 'Checkbox caption';
  this.set('caption', checkboxCaptionText);
  assert.strictEqual(
    $.trim($checkboxCaption.text()),
    checkboxCaptionText,
    'Component\'s inner <label> text changes when component\'s \'caption\' property changes');

  // Check wrapper's additional CSS-classes.
  let additioanlCssClasses = 'additional-css-class-name and-another-one';
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

test('Component invokes actions', function(assert) {
  assert.expect(3);

  let latestEventObjects = {
    change: null
  };

  // Bind component's action handlers.
  this.set('actions.onFlagChange', e => {
    latestEventObjects.change = e;
  });
  this.render(hbs`{{flexberry-ddau-checkbox change=(action \"onFlagChange\")}}`);

  // Retrieve component.
  let $component = this.$().children();

  assert.strictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action wasn\'t invoked before click');

  // Imitate first click on component.
  $component.click();
  assert.notStrictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action was invoked after first click');

  // Imitate second click on component.
  latestEventObjects.change = null;
  $component.click();
  assert.notStrictEqual(latestEventObjects.change, null, 'Component\'s \'change\' action was invoked after second click');
});

test('Component changes binded value (without \'change\' action handler)', function(testAssert) {
  // Mock Ember.assert method.
  let thrownExceptions = A();
  let originalEmberAssert = assert;
  assert = function(...args) {
    try {
      originalEmberAssert(...args);
    } catch (ex) {
      thrownExceptions.pushObject(ex);
    }
  };

  testAssert.expect(4);

  this.set('flag', false);
  this.render(hbs`{{flexberry-ddau-checkbox value=flag}}`);

  // Retrieve component & it's inner <input>.
  let $component = this.$().children();
  let $checkboxInput = $component.children('input');

  // Check component's initial state.
  testAssert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked before click');

  // Imitate click on component & check for exception.
  $component.click();

  // Check component's state after click (it should be changed).
  testAssert.strictEqual(
    $checkboxInput.prop('checked'),
    true,
    'Component\'s inner checkbox <input> isn\'t checked after click (without \'change\' action handler)');

  // Check binded value state after click (it should be unchanged, because 'change' action handler is not defined).
  testAssert.strictEqual(
    this.get('flag'),
    true,
    'Component\'s binded value changed (without \'change\' action handler)');

  testAssert.strictEqual(
    thrownExceptions.length === 1 && (/.*required.*change.*action.*not.*defined.*/gi).test(thrownExceptions[0].message),
    true,
    'Component throws single exception if \'change\' action handler is not defined');

  // Clean up after mock Ember.assert.
  assert = originalEmberAssert;
});

test('Component changes binded value (with \'change\' action handler)', function(assert) {
  assert.expect(7);

  this.set('flag', false);

  // Bind component's 'change' action handler.
  this.set('actions.onFlagChange', e => {
    assert.strictEqual(e.originalEvent.target.id, this.$('input')[0].id);
    this.set('flag', e.newValue);
  });

  this.render(hbs`{{flexberry-ddau-checkbox value=flag change=(action "onFlagChange")}}`);

  // Retrieve component & it's inner <input>.
  let $component = this.$().children();
  let $checkboxInput = $component.children('input');

  // Check component's initial state.
  assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked before click');

  // Make component checked.
  $component.click();
  assert.strictEqual(
    $checkboxInput.prop('checked'),
    true,
    'Component\'s inner checkbox <input> is checked after click (with \'change\' action handler)');
  assert.strictEqual(
    this.get('flag'),
    true,
    'Component\'s binded value changed (with \'change\' action handler)');

  // Make component unchecked.
  $component.click();
  assert.strictEqual(
    $checkboxInput.prop('checked'),
    false,
    'Component\'s inner checkbox <input> is unchecked after second click (with \'change\' action handler)');
  assert.strictEqual(
    this.get('flag'),
    false,
    'Component\' binded value changed after second click (with \'change\' action handler)');
});

test('Component changes binded value (with \'change\' action handler from special mixin)', function(assert) {
  assert.expect(5);

  this.set('flag', false);

  // Bind component's 'change' action handler from specialized mixin.
  this.set('actions.onCheckboxChange', FlexberryDdauCheckboxActionsHandlerMixin.mixins[0].properties.actions.onCheckboxChange);

  this.render(hbs`{{flexberry-ddau-checkbox value=flag change=(action "onCheckboxChange" "flag")}}`);

  // Retrieve component & it's inner <input>.
  let $component = this.$().children();
  let $checkboxInput = $component.children('input');

  // Check component's initial state.
  assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked before click');

  // Make component checked.
  $component.click();
  assert.strictEqual(
    $checkboxInput.prop('checked'),
    true,
    'Component\'s inner checkbox <input> is checked after click (with \'change\' action handler from special mixin)');
  assert.strictEqual(
    this.get('flag'),
    true,
    'Component changed binded value (with \'change\' action handler from special mixin)');

  // Make component unchecked.
  $component.click();
  assert.strictEqual(
    $checkboxInput.prop('checked'),
    false,
    'Component\'s inner checkbox <input> is unchecked after second click (with \'change\' action handler from special mixin)');
  assert.strictEqual(
    this.get('flag'),
    false,
    'Component changed binded value after second click (with \'change\' action handler from special mixin)');
});

test('Component works properly in readonly mode', function(assert) {
  assert.expect(9);

  let latestEventObjects = {
    change: null
  };

  // Bind component's action handlers.
  this.set('actions.onFlagChange', e => {
    latestEventObjects.change = e;
  });

  // Render component in readonly mode.
  this.set('flag', false);
  this.set('readonly', true);
  this.render(hbs`{{flexberry-ddau-checkbox value=flag readonly=readonly change=(action "onFlagChange")}}`);

  // Retrieve component & it's inner <input>.
  let $component = this.$().children();
  let $checkboxInput = $component.children('input');

  // Check component's initial state.
  assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked before click');

  // Imitate click on component.
  $component.click();

  // Check after click state.
  assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked after click');
  assert.strictEqual(latestEventObjects.change, null, 'Component doesn\'t send \'change\' action in readonly mode');

  // Disable readonly mode.
  this.set('readonly', false);

  // Imitate click on component.
  $component.click();

  // Check after click state.
  assert.strictEqual($checkboxInput.prop('checked'), true, 'Component\'s inner checkbox <input> is checked after click');
  assert.notStrictEqual(latestEventObjects.change, null, 'Component send \'change\' action after readonly mode disabling');

  latestEventObjects.change = null;

  // Imitate click on component.
  $component.click();

  // Check after click state.
  assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> is unchecked after click');
  assert.notStrictEqual(latestEventObjects.change, null, 'Component send \'change\' action after readonly mode disabling');

  latestEventObjects.change = null;

  // Enable readonly mode again.
  this.set('readonly', true);

  // Imitate click on component.
  $component.click();

  // Check after click state.
  assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked after click');
  assert.strictEqual(latestEventObjects.change, null, 'Component doesn\'t send \'change\' action in readonly mode');
});
