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
  placeholder=placeholder}}
  {{/flexberry-lookup}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $lookupFluid = $component.children('.fluid');
  let $lookupInput = $lookupFluid.children('.lookup-field');
  let $lookupButtouChoose = $lookupFluid.children('.lookup-choose-button');
  let $lookupButtouClear = $lookupFluid.children('.lookup-clear-button');
  let $lookupButtouClearIcon = $lookupButtouClear.children('.remove');

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
  assert.equal($lookupInput.attr('placeholder'), '(no value)', 'Component\'s container has \'input\' css-class');

  // Check <choose button>.
  assert.strictEqual($lookupButtouChoose.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupButtouChoose.prop('tagName'), 'BUTTON', 'Component\'s title block is a <button>');
  assert.strictEqual($lookupButtouChoose.hasClass('ui'), true, 'Component\'s container has \'ui\' css-class');
  assert.strictEqual($lookupButtouChoose.hasClass('lookup-choose-button'), true, 'Component\'s container has \'lookup-choose-button\' css-class');
  assert.strictEqual($lookupButtouChoose.hasClass('button'), true, 'Component\'s container has \'button\' css-class');
  assert.equal($lookupButtouChoose.text().trim(), 'Choose');

  // Check <clear button>.
  assert.strictEqual($lookupButtouClear.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupButtouClear.prop('tagName'), 'BUTTON', 'Component\'s title block is a <button>');
  assert.strictEqual($lookupButtouClear.hasClass('ui'), true, 'Component\'s container has \'ui\' css-class');
  assert.strictEqual($lookupButtouClear.hasClass('lookup-clear-button'), true, 'Component\'s container has \'lookup-clear-button\' css-class');
  assert.strictEqual($lookupButtouClear.hasClass('button'), true, 'Component\'s container has \'button\' css-class');

  // Check <clear button icon>
  assert.strictEqual($lookupButtouClearIcon.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupButtouClearIcon.prop('tagName'), 'I', 'Component\'s title block is a <i>');
  assert.strictEqual($lookupButtouClearIcon.hasClass('remove'), true, 'Component\'s container has \'remove\' css-class');
  assert.strictEqual($lookupButtouClearIcon.hasClass('icon'), true, 'Component\'s container has \'icon\' css-class');
});

test('component with readonly renders properly', function(assert) {
  assert.expect(2);

  this.render(hbs`{{flexberry-lookup
  readonly=true
  }}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $lookupFluid = $component.children('.fluid');
  let $lookupInput = $lookupFluid.children('.lookup-field');
  let $lookupButtouChoose = $lookupFluid.children('.lookup-choose-button');
  let $lookupButtouClear = $lookupFluid.children('.lookup-clear-button');
  let $lookupButtouClearIcon = $lookupButtouClear.children('.remove');

  // Check <choose button>.
  assert.strictEqual($lookupButtouChoose.hasClass('disabled'), true, 'Component\'s container has \'disabled\' css-class');

  // Check <clear button>.
  assert.strictEqual($lookupButtouClear.hasClass('disabled'), true, 'Component\'s container has \'disabled\' css-class');
});

test('component with choose-text and remove-text properly', function(assert) {
  assert.expect(2);
  this.set('tempText1',"TempText1")    
  this.set('tempText2',"TempText2")

  this.render(hbs`{{#flexberry-lookup
    chooseText=tempText1
    removeText=tempText2
  }}
  {{/flexberry-lookup}}`);

  let $component = this.$().children();
  let $lookupFluid = $component.children('.fluid');
  let $lookupInput = $lookupFluid.children('.lookup-field');
  let $lookupButtouChoose = $lookupFluid.children('.lookup-choose-button');
  let $lookupButtouClear = $lookupFluid.children('.lookup-clear-button');
  let $lookupButtouClearIcon = $lookupButtouClear.children('.remove');


  // Check <choose button>.
  assert.equal($lookupButtouChoose.text().trim(), "TempText1");

  // Check <clear button>.
  assert.equal($lookupButtouClear.text().trim(), "TempText2");
});

/*test('component with drowdown renders properly', function(assert) {
  assert.expect(30);

  this.render(hbs`{{#flexberry-lookup
  dropdown=true}}
  {{/flexberry-lookup}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $lookupFluid = $component.children('.flexberry-dropdown');
  let $lookupInput = $lookupFluid.children('.lookup-field');
  let $lookupButtouChoose = $lookupFluid.children('.lookup-choose-button');
  let $lookupButtouClear = $lookupFluid.children('.lookup-clear-button');
  let $lookupButtouClearIcon = $lookupButtouClear.children('.remove');

  // Check wrapper <flexberry-lookup>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s title block is a <div>');
  assert.strictEqual($component.hasClass('flexberry-lookup'), true, 'Component\'s container has \'flexberry-lookup\' css-class');
  assert.strictEqual($component.hasClass('ember-view'), true, 'Component\'s wrapper has \'ember-view\' css-class');

  // Check wrapper <fluid>.
  assert.strictEqual($lookupFluid.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupFluid.prop('tagName'), 'DIV', 'Component\'s title block is a <div>');
  assert.strictEqual($lookupFluid.hasClass('flexberry-dropdown'), true, 'Component\'s wrapper has \'flexberry-dropdown\' css-class');
  assert.strictEqual($lookupFluid.hasClass('search'), true, 'Component\'s wrapper has \'search\' css-class');
  assert.strictEqual($lookupFluid.hasClass('selection'), true, 'Component\'s wrapper has \'selection\' css-class');
  assert.strictEqual($lookupFluid.hasClass('ember-view'), true, 'Component\'s wrapper has \'ember-view\' css-class');
  assert.strictEqual($lookupFluid.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($lookupFluid.hasClass('drowdown'), true, 'Component\'s container has \'drowdown\' css-class');

  // Check <input>.
  assert.strictEqual($lookupInput.length === 0, true, 'Component has inner title block');
  assert.strictEqual($lookupInput.prop('tagName'), 'INPUT', 'Component\'s wrapper is a <input>');
  assert.strictEqual($lookupInput.hasClass('lookup-field'), true, 'Component\'s title block has \'lookup-field\' css-class');
  assert.strictEqual($lookupInput.hasClass('ember-view'), true, 'Component\'s title block has \'ember-view\' css-class');
  assert.strictEqual($lookupInput.hasClass('ember-text-field'), true, 'Component\'s title block has \'ember-text-field\' css-class');
  assert.equal($lookupInput.attr('placeholder'), '(no value)', 'Component\'s container has \'input\' css-class');

  // Check <choose button>.
  assert.strictEqual($lookupButtouChoose.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupButtouChoose.prop('tagName'), 'BUTTON', 'Component\'s title block is a <button>');
  assert.strictEqual($lookupButtouChoose.hasClass('ui'), true, 'Component\'s container has \'ui\' css-class');
  assert.strictEqual($lookupButtouChoose.hasClass('lookup-choose-button'), true, 'Component\'s container has \'lookup-choose-button\' css-class');
  assert.strictEqual($lookupButtouChoose.hasClass('button'), true, 'Component\'s container has \'button\' css-class');
  assert.equal($lookupButtouChoose.text().trim(), 'Choose');

  // Check <clear button>.
  assert.strictEqual($lookupButtouChoose.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupButtouClear.prop('tagName'), 'BUTTON', 'Component\'s title block is a <button>');
  assert.strictEqual($lookupButtouClear.hasClass('ui'), true, 'Component\'s container has \'ui\' css-class');
  assert.strictEqual($lookupButtouClear.hasClass('lookup-clear-button'), true, 'Component\'s container has \'lookup-clear-button\' css-class');
  assert.strictEqual($lookupButtouClear.hasClass('button'), true, 'Component\'s container has \'button\' css-class');

  // Check <clear button icon>
  assert.strictEqual($lookupButtouClearIcon.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupButtouClearIcon.prop('tagName'), 'I', 'Component\'s title block is a <i>');
  assert.strictEqual($lookupButtouClearIcon.hasClass('remove'), true, 'Component\'s container has \'remove\' css-class');
  assert.strictEqual($lookupButtouClearIcon.hasClass('icon'), true, 'Component\'s container has \'icon\' css-class');
});*/

/*test('component render modal window', function(assert) {
  assert.expect(2);

  this.render(hbs`{{#flexberry-lookup}}
  {{/flexberry-lookup}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $lookupFluid = $component.children('.fluid');
  let $lookupInput = $lookupFluid.children('.lookup-field');
  let $lookupButtouChoose = $lookupFluid.children('.lookup-choose-button');
  let $lookupButtouClear = $lookupFluid.children('.lookup-clear-button');
  let $lookupButtouClearIcon = $lookupButtouClear.children('.remove');

  // Check wrapper <flexberry-lookup>.
  let $modalFlexbarryWindow = Ember.$('.flexberry-modal');
  assert.strictEqual($modalFlexbarryWindow.length === 0, true, 'Modal window isn\'t open');

  // Try to expand component.
  Ember.run(() => {
    $lookupButtouChoose.click();
  });

  // Wait for collapse animation to be completed & check component's state.
  var done = assert.async();
  Ember.run(() => {
    setTimeout(function() {
      let $modalFlexbarryWindow = Ember.$('.flexberry-modal');
      assert.strictEqual($modalFlexbarryWindow.length === 1, true, 'Modal window is open');
      done();
    }, 1000);

  });
  
});

test('component with autocomplete renders properly', function(assert) {
  assert.expect(2);

  this.set('per', true);
  this.set('rm', "type");

  this.render(hbs`{{flexberry-lookup
  readonly=true
  }}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $lookupFluid = $component.children('.fluid');
  let $lookupResult = $component.children('.result');
  let $lookupInput = $lookupFluid.children('.lookup-field');

  // Check wrapper <flexberry-lookup>.
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s container has \'ui\' css-class');
  assert.strictEqual($component.hasClass('search'), true, 'Component\'s wrapper has \'search\' css-class');

  // Check <input>.
  assert.strictEqual($lookupInput.hasClass('prompt'), true, 'Component\'s title block has \'lookup-field\' css-class');

  // Check <result>
  assert.strictEqual($lookupResult.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupResult.prop('tagName'), 'DIV', 'Component\'s title block is a <i>');
  assert.strictEqual($lookupResult.hasClass('result'), true, 'Component\'s container has \'result\' css-class');
});*/
