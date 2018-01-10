import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-lookup', 'Integration | Component | flexberry lookup', {
  integration: true,

  beforeEach: function () {
    Ember.Component.reopen({
      i18n: Ember.inject.service('i18n')
    });
  }
});

test('component renders properly', function(assert) {
  assert.expect(30);

  this.render(hbs`{{#flexberry-lookup
  placeholder='(нет значения)'}}
  {{/flexberry-lookup}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $lookupFluid = $component.children('.fluid');
  let $lookupInput = $lookupFluid.children('.lookup-field');
  let $lookupButtonChoose = $lookupFluid.children('.ui-change');
  let $lookupButtonClear = $lookupFluid.children('.ui-clear');
  let $lookupButtonClearIcon = $lookupButtonClear.children('.remove');

  // Check wrapper <flexberry-lookup>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s title block is a <div>');
  assert.strictEqual($component.hasClass('flexberry-lookup'), true, 'Component\'s container has \'flexberry-lookup\' css-class');
  assert.strictEqual($component.hasClass('ember-view'), true, 'Component\'s wrapper has \'ember-view\' css-class');

  // Check wrapper <fluid>.
  assert.strictEqual($lookupFluid.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupFluid.prop('tagName'), 'DIV', 'Component\'s title block is a <div>');
  assert.strictEqual($lookupFluid.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($lookupFluid.hasClass('fluid'), true, 'Component\'s wrapper has \'fluid\' css-class');
  assert.strictEqual($lookupFluid.hasClass('action'), true, 'Component\'s wrapper has \'action\' css-class');
  assert.strictEqual($lookupFluid.hasClass('input'), true, 'Component\'s container has \'input\' css-class');

  // Check <input>.
  assert.strictEqual($lookupInput.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupInput.prop('tagName'), 'INPUT', 'Component\'s wrapper is a <input>');
  assert.strictEqual($lookupInput.hasClass('lookup-field'), true, 'Component\'s title block has \'lookup-field\' css-class');
  assert.strictEqual($lookupInput.hasClass('ember-view'), true, 'Component\'s title block has \'ember-view\' css-class');
  assert.strictEqual($lookupInput.hasClass('ember-text-field'), true, 'Component\'s title block has \'ember-text-field\' css-class');
  assert.equal($lookupInput.attr('placeholder'), '(нет значения)', 'Component\'s container has \'input\' css-class');

  // Check <choose button>.
  assert.strictEqual($lookupButtonChoose.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupButtonChoose.prop('tagName'), 'BUTTON', 'Component\'s title block is a <button>');
  assert.strictEqual($lookupButtonChoose.hasClass('ui'), true, 'Component\'s container has \'ui\' css-class');
  assert.strictEqual($lookupButtonChoose.hasClass('ui-change'), true, 'Component\'s container has \'ui-change\' css-class');
  assert.strictEqual($lookupButtonChoose.hasClass('button'), true, 'Component\'s container has \'button\' css-class');
  assert.equal($lookupButtonChoose.attr('title'), 'Выбрать');

  // Check <clear button>.
  assert.strictEqual($lookupButtonClear.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupButtonClear.prop('tagName'), 'BUTTON', 'Component\'s title block is a <button>');
  assert.strictEqual($lookupButtonClear.hasClass('ui'), true, 'Component\'s container has \'ui\' css-class');
  assert.strictEqual($lookupButtonClear.hasClass('ui-clear'), true, 'Component\'s container has \'ui-clear\' css-class');
  assert.strictEqual($lookupButtonClear.hasClass('button'), true, 'Component\'s container has \'button\' css-class');

  // Check <clear button icon>
  assert.strictEqual($lookupButtonClearIcon.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupButtonClearIcon.prop('tagName'), 'I', 'Component\'s title block is a <i>');
  assert.strictEqual($lookupButtonClearIcon.hasClass('remove'), true, 'Component\'s container has \'remove\' css-class');
  assert.strictEqual($lookupButtonClearIcon.hasClass('icon'), true, 'Component\'s container has \'icon\' css-class');
});

test('component with readonly renders properly', function(assert) {
  assert.expect(2);

  this.render(hbs`{{flexberry-lookup
  readonly=true
  }}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $lookupFluid = $component.children('.fluid');
  let $lookupButtonChoose = $lookupFluid.children('.ui-change');
  let $lookupButtonClear = $lookupFluid.children('.ui-clear');

  // Check <choose button>.
  assert.strictEqual($lookupButtonChoose.hasClass('disabled'), true, 'Component\'s container has \'disabled\' css-class');

  // Check <clear button>.
  assert.strictEqual($lookupButtonClear.hasClass('disabled'), true, 'Component\'s container has \'disabled\' css-class');
});

test('component with choose-text and remove-text properly', function(assert) {
  assert.expect(2);
  this.set('tempTextChoose', 'TempText1');
  this.set('tempTextRemove', 'TempText2');

  this.render(hbs`{{#flexberry-lookup
    chooseText=tempTextChoose
    removeText=tempTextRemove
  }}
  {{/flexberry-lookup}}`);

  let $component = this.$().children();
  let $lookupFluid = $component.children('.fluid');
  let $lookupButtonChoose = $lookupFluid.children('.ui-change');
  let $lookupButtonClear = $lookupFluid.children('.ui-clear');

  // Check <choose button>.
  assert.equal($lookupButtonChoose.text().trim(), 'TempText1');

  // Check <clear button>.
  assert.equal($lookupButtonClear.text().trim(), 'TempText2');
});
