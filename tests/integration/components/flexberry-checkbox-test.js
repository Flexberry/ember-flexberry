import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-checkbox', 'Integration | Component | Flexberry checkbox', {
  integration: true,
});

test('Component renders properly', function(assert) {
  assert.expect(17);

  this.render(hbs`{{flexberry-checkbox caption=caption class=class}}`);

  // Retrieve component, it's inner <input> & <label>.
  let $component = this.$().children();
  let $checkboxInput = $component.children('input');
  let $checkboxCaption = $component.children('label');

  let flexberryClassNames = FlexberryCheckboxComponent.flexberryClassNames;

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
    Ember.$.trim($checkboxCaption.text()).length === 0,
    true,
    'Component\'s inner <label> is empty by default');

  let checkboxCaptionText = 'Checkbox caption';
  this.set('caption', checkboxCaptionText);
  assert.strictEqual(
    Ember.$.trim($checkboxCaption.text()),
    checkboxCaptionText,
    'Component\'s inner <label> text changes when component\'s \'caption\' property changes');

  // Check wrapper's additional CSS-classes.
  let additioanlCssClasses = 'additional-css-class-name and-another-one';
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

  // Check wrapper's additional CSS-class 'radio'.
  let additioanlCssClasses = 'radio';
  this.set('class', additioanlCssClasses);

  Ember.A(additioanlCssClasses.split('radio')).forEach((cssClassName, index) => {
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
