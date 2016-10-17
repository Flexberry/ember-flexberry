import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-checkbox', 'Integration | Component | Flexberry checkbox', {
  integration: true,
});

test('Component renders properly', function(assert) {
  assert.expect(15);

  this.render(hbs`{{flexberry-checkbox caption=caption class=class}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $checkboxInput = $component.children('input');

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
  assert.strictEqual($checkboxInput.hasClass('hidden'), true, 'Component\'s inner checkbox <input> has \'hidden\' css-class');
  assert.strictEqual($checkboxInput.prop('checked'), false, 'Component\'s inner checkbox <input> isn\'t checked');

  // Check wrapper's additional CSS-classes.
  let additioanlCssClasses = 'radio slider toggle';
  this.set('class', additioanlCssClasses);

  Ember.A(additioanlCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    true,
    'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
  });

  this.set('class', '');
  Ember.A(additioanlCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    false,
    'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
  });
});

test('Component render label', function(assert) {
  assert.expect(3);

  this.render(hbs`{{flexberry-checkbox caption=caption class=class}}`);

  // Retrieve component, it's inner <label>.
  let $component = this.$().children();
  let $checkboxCaption = $component.children('label');

  // Check caption's <label>.
  assert.strictEqual($checkboxCaption.length === 1, true, 'Component has inner <label>');
  assert.strictEqual(
  $checkboxCaption.hasClass('flexberry-checkbox-label'),
  true,
  'Component\'s inner <label> has flexberry-checkbox-label css-class');
  assert.strictEqual(
  Ember.$.trim($checkboxCaption.text()).length === 0,
  true,
  'Component\'s inner <label> is empty by default');
});

test('Component works properly in readonly mode', function(assert) {
  assert.expect(3);

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
  this.render(hbs`{{flexberry-checkbox value=flag readonly=readonly change=(action "onFlagChange")}}`);

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
});

