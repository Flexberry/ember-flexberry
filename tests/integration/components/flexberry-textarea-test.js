import Ember from 'ember';

import I18nService from 'ember-i18n/services/i18n';
import I18nRuLocale from 'ember-flexberry/locales/ru/translations';
import I18nEnLocale from 'ember-flexberry/locales/en/translations';

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-textarea', 'Integration | Component | flexberry-textarea', {
  integration: true,

  beforeEach: function () {
    this.register('locale:ru/translations', I18nRuLocale);
    this.register('locale:en/translations', I18nEnLocale);
    this.register('service:i18n', I18nService);

    this.inject.service('i18n', { as: 'i18n' });
    Ember.Component.reopen({
      i18n: Ember.inject.service('i18n')
    });

    // Set 'ru' as initial locale.
    this.set('i18n.locale', 'ru');
  }
});

test('it renders properly', function(assert) {
  assert.expect(10);

  // Render component.
  this.render(hbs`{{flexberry-textarea
    class=class
  }}`);

  // Retrieve component.
  let $component = this.$().children();

  // Check wrapper <div>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual($component.hasClass('flexberry-textarea'), true, 'Component\'s wrapper has \' flexberry-textarea\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($component.hasClass('input'), true, 'Component\'s wrapper has \'input\' css-class');

  // Check wrapper's additional CSS-classes.
  let additioanlCssClasses = 'fluid mini huge';
  this.set('class', additioanlCssClasses);
  Ember.A(additioanlCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    true,
    'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
  });

  // Clean up wrapper's additional CSS-classes.
  this.set('class', '');
  Ember.A(additioanlCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    false,
    'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
  });
});

test('readonly mode works properly', function(assert) {
  assert.expect(3);

  // Render component.
  this.render(hbs`{{flexberry-textarea
    class=class
    readonly=readonly
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Check that <textarea>'s readonly attribute doesn't exist yet.
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('readonly')),
    '',
    'Component\'s inner <textarea> hasn\'t readonly attribute');

  // Activate readonly mode & check that <textarea>'s readonly attribute exists now & has value equals to 'readonly'.
  this.set('readonly', true);
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('readonly')),
    'readonly',
    'Component\'s inner <textarea> has readonly attribute with value equals to \'readonly\'');

  // Check that <textarea>'s readonly attribute doesn't exist now.
  this.set('readonly', false);
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('readonly')),
    '',
    'Component\'s inner <textarea> hasn\'t readonly attribute');
});

test('readonly mode works properly with value', function(assert) {
  assert.expect(2);

  // Set <textarea>'s value' & render component.
  this.set('value', null);
  this.set('readonly', true);
  this.render(hbs`{{flexberry-textarea
    readonly=readonly
    value=value
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  $textareaInput.on('change', (e) => {
    if (this.get('readonly')) {
      e.stopPropagation();
      $textareaInput.val(null);
    }
  });

  let newValue = 'New value';
  $textareaInput.val(newValue);
  $textareaInput.change();

  // Check <textarea>'s value not changed.
  assert.strictEqual(
    Ember.$.trim($textareaInput.val()),
    '',
    'Component\'s inner <textarea>\'s value not changed');
  assert.strictEqual(
    this.get('value'),
    null,
    'Component\'s property binded to unchanged \'value\'');
});

test('it renders i18n-ed placeholder', function(assert) {
  assert.expect(2);

  // Render component.
  this.render(hbs`{{flexberry-textarea}}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Check <textarea>'s placeholder.
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('placeholder')),
    Ember.get(I18nRuLocale, 'components.flexberry-textarea.placeholder'),
    'Component\'s inner <textarea>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

  // Change current locale to 'en' & check <textarea>'s placeholder again.
  this.set('i18n.locale', 'en');
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('placeholder')),
    Ember.get(I18nEnLocale, 'components.flexberry-textarea.placeholder'),
    'Component\'s inner <textarea>\'s placeholder is equals to it\'s value from i18n locales/en/translations');
});

test('it renders manually defined placeholder', function(assert) {
  assert.expect(2);

  // Set <textarea>'s placeholder' & render component.
  let placeholder = 'textarea is empty, please type some text';
  this.set('placeholder', placeholder);
  this.render(hbs`{{flexberry-textarea
    placeholder=placeholder
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Check <textarea>'s placeholder.
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('placeholder')),
    placeholder,
    'Component\'s inner <textarea>\'s placeholder is equals to manually defined value \'' + placeholder + '\'');

  // Change placeholder's value & check <textarea>'s placeholder again.
  placeholder = 'textarea has no value';
  this.set('placeholder', placeholder);
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('placeholder')),
    placeholder,
    'Component\'s inner <textarea>\'s placeholder is equals to manually updated value \'' + placeholder + '\'');
});

test('required mode works properly', function(assert) {
  assert.expect(3);

  // Render component.
  this.render(hbs`{{flexberry-textarea
    class=class
    required=required
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Check that <textarea>'s required attribute doesn't exist yet.
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('required')),
    '',
    'Component\'s inner <textarea> hasn\'t required attribute');

  // Activate required mode & check that <textarea>'s required attribute exists now & has value equals to 'required'.
  this.set('required', true);
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('required')),
    'required',
    'Component\'s inner <textarea> has required attribute with value equals to \'required\'');

  // Check that <textarea>'s required attribute doesn't exist now.
  this.set('required', false);
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('required')),
    '',
    'Component\'s inner <textarea> hasn\'t required attribute');
});

test('disabled mode works properly', function(assert) {
  assert.expect(3);

  // Render component.
  this.render(hbs`{{flexberry-textarea
    class=class
    disabled=disabled
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Check that <textarea>'s disabled attribute doesn't exist yet.
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('disabled')),
    '',
    'Component\'s inner <textarea> hasn\'t disabled attribute');

  // Activate disabled mode & check that <textarea>'s disabled attribute exists now & has value equals to 'disabled'.
  this.set('disabled', true);
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('disabled')),
    'disabled',
    'Component\'s inner <textarea> has disabled attribute with value equals to \'disabled\'');

  // Check that <textarea>'s disabled attribute doesn't exist now.
  this.set('disabled', false);
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('disabled')),
    '',
    'Component\'s inner <textarea> hasn\'t disabled attribute');
});

test('autofocus mode works properly', function(assert) {
  assert.expect(3);

  // Render component.
  this.render(hbs`{{flexberry-textarea
    class=class
    autofocus=autofocus
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Check that <textarea>'s autofocus attribute doesn't exist yet.
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('autofocus')),
    '',
    'Component\'s inner <textarea> hasn\'t autofocus attribute');

  // Activate autofocus mode & check that <textarea>'s autofocus attribute exists now & has value equals to 'autofocus'.
  this.set('autofocus', true);
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('autofocus')),
    'autofocus',
    'Component\'s inner <textarea> has autofocus attribute with value equals to \'autofocus\'');

  // Check that <textarea>'s autofocus attribute doesn't exist now.
  this.set('autofocus', false);
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('autofocus')),
    '',
    'Component\'s inner <textarea> hasn\'t autofocus attribute');
});

test('spellcheck mode works properly', function(assert) {
  assert.expect(3);

  // Render component.
  this.render(hbs`{{flexberry-textarea
    class=class
    spellcheck=spellcheck
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Check that <textarea>'s spellcheck attribute doesn't exist yet.
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('spellcheck')),
    '',
    'Component\'s inner <textarea> hasn\'t spellcheck attribute');

  // Activate spellcheck mode & check that <textarea>'s spellcheck attribute exists now & has value equals to 'spellcheck'.
  this.set('spellcheck', true);
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('spellcheck')),
    'true',
    'Component\'s inner <textarea> has spellcheck attribute with value equals to \'spellcheck\'');

  // Check that <textarea>'s spellcheck attribute doesn't exist now.
  this.set('spellcheck', false);
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('spellcheck')),
    'false',
    'Component\'s inner <textarea> hasn\'t spellcheck attribute');
});

test('wrap mode works properly', function(assert) {
  assert.expect(3);

  // Render component.
  this.render(hbs`{{flexberry-textarea
    class=class
    wrap=wrap
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Check that <textarea>'s wrap attribute 'hard'.
  this.set('wrap', 'hard');
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('wrap')),
    'hard',
    'Component\'s inner <textarea> wrap attribute \'hard\'');

  // Check that <textarea>'s wrap attribute 'soft'.
  this.set('wrap', 'soft');
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('wrap')),
    'soft',
    'Component\'s inner <textarea> wrap attribute \'soft\'');

  // Check that <textarea>'s wrap attribute 'off'.
  this.set('wrap', 'off');
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('wrap')),
    'off',
    'Component\'s inner <textarea> wrap attribute \'off\'');
});

test('rows mode works properly', function(assert) {
  assert.expect(2);

  // Render component.
  this.render(hbs`{{flexberry-textarea
    class=class
    rows=rows
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Retrieve default rows count for current browser.
  let defaultRowsCount = $textareaInput.prop('rows');

  // Generate random rows count >= 2.
  let rowsValue = Math.floor(Math.random() * 10) + 2;

  // Check that <textarea>'s rows attribute is equals to specified value.
  this.set('rows', rowsValue);
  assert.strictEqual(
    $textareaInput.prop('rows'),
    rowsValue,
    'Component\'s inner <textarea>\'s value \'rows\' is equals to ' + rowsValue);

  // Check that <textarea>'s rows count is switched to default value.
  this.set('rows', null);
  assert.strictEqual(
    $textareaInput.prop('rows'),
    defaultRowsCount,
    'Component\'s inner <textarea>\'s rows count is switched to default value');
});

test('cols mode works properly', function(assert) {
  assert.expect(2);

  // Render component.
  this.render(hbs`{{flexberry-textarea
    class=class
    cols=cols
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Retrieve default rows count for current browser.
  let defaultColsCount = $textareaInput.prop('cols');

  // Generate random cols count >= 20.
  let colsValue = Math.floor(Math.random() * 10) + 20;

  // Check that <textarea>'s cols attribute is equals to specified value.
  this.set('cols', colsValue);
  assert.strictEqual(
    $textareaInput.prop('cols'),
    colsValue,
    'Component\'s inner <textarea>\'s value \'cols\' is equals to ' + colsValue);

  // Check that <textarea>'s cols count is switched to default value.
  this.set('cols', null);
  assert.strictEqual(
    $textareaInput.prop('cols'),
    defaultColsCount,
    'Component\'s inner <textarea> hasn\'t value cols attribute');
});

test('maxlength mode works properly', function(assert) {
  assert.expect(2);

  // Render component.
  this.render(hbs`{{flexberry-textarea
    class=class
    maxlength=maxlength
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  //Generate a random value 'maxlength' and convert to a string.
  let maxlengthValue = '' + (Math.floor(Math.random() * 10));

  // Check that <textarea>'s maxlength attribute.
  this.set('maxlength', maxlengthValue);
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('maxlength')),
    maxlengthValue,
    'Component\'s inner <textarea>\'s value \'maxlength\' is equals to \'' + maxlengthValue + '\'');

  // Check that <textarea>'s hasn\'t value maxlength attribute.
  this.set('maxlength', null);
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('maxlength')),
    '',
    'Component\'s inner <textarea> hasn\'t value maxlength attribute');
});

test('selectionStart mode works properly', function(assert) {
  assert.expect(2);

  // Render component.
  this.render(hbs`{{flexberry-textarea
    class=class
    selectionStart=selectionStart
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Change <textarea>'s value (imitate situation when user typed something into component's <textarea>)
  // & check them again ('change' event is needed to force bindings work).
  let newValue = 'Some text typed into textarea';
  $textareaInput.val(newValue);
  $textareaInput.change();

  //Generate a random value 'selectionStart' and convert to a string.
  let selectionStartValue = (Math.floor(Math.random() * 10 + 1));

  let $this = this;

  // This timeout  is correcting problem with selectionStart in Mozila Firefox.
  let done = assert.async();
  setTimeout(function() {
    $this.set('selectionStart', selectionStartValue);
    assert.strictEqual(
      $textareaInput.prop('selectionStart'),
      selectionStartValue,
      'Component\'s inner <textarea>\'s value \'selectionStart\' is equals to \'' + selectionStartValue + '\'');

    // Check that <textarea>'s hasn\'t value maxlength attribute.
    $this.set('selectionStart', null);
    assert.strictEqual(
      Ember.$.trim($textareaInput.attr('selectionStart')),
      '',
      'Component\'s inner <textarea> hasn\'t value selectionStart attribute');
    done();
  }, 10);
});

test('selectionEnd mode works properly', function(assert) {
  assert.expect(2);

  // Render component.
  this.render(hbs`{{flexberry-textarea
    class=class
    selectionEnd=selectionEnd
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Change <textarea>'s value (imitate situation when user typed something into component's <textarea>)
  // & check them again ('change' event is needed to force bindings work).
  let newValue = 'Some text typed into textarea';
  $textareaInput.val(newValue);
  $textareaInput.change();

  //Generate a random value 'selectionEnd' and convert to a string.
  let selectionEndValue = (Math.floor(Math.random() * 10 + 1));

  // Check that <textarea>'s selectionEnd attribute.
  this.set('selectionEnd', selectionEndValue);
  assert.strictEqual(
    $textareaInput.prop('selectionEnd'),
    selectionEndValue,
    'Component\'s inner <textarea>\'s value \'selectionEnd\' is equals to \'' + selectionEndValue + '\'');

  // Check that <textarea>'s hasn\'t value maxlength attribute.
  this.set('selectionEnd', null);
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('selectionEnd')),
    '',
    'Component\'s inner <textarea> hasn\'t value selectionEnd attribute');
});

test('selectionDirection mode works properly', function(assert) {
  assert.expect(1);

  // Render component.
  this.render(hbs`{{flexberry-textarea
    class=class
    selectionDirection=selectionDirection
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Check that <textarea>'s hasn\'t value selectionDirection attribute.
  this.set('selectionDirection', null);
  assert.strictEqual(
   $textareaInput.attr('selectionDirection'),
    undefined,
    'Component\'s inner <textarea> hasn\'t value selectionDirection attribute');
});

test('changes in inner <textarea> causes changes in property binded to \'value\'', function(assert) {
  assert.expect(4);

  // Set <textarea>'s value' & render component.
  this.set('value', null);
  this.render(hbs`{{flexberry-textarea
    value=value
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Check <textarea>'s value & binded value for initial emptyness.
  assert.strictEqual(
    Ember.$.trim($textareaInput.val()),
    '',
    'Component\'s inner <textarea>\'s value is equals to \'\'');
  assert.strictEqual(
    this.get('value'),
    null,
    'Component\'s property binded to \'value\' is equals to null');

  // Change <textarea>'s value (imitate situation when user typed something into component's <textarea>)
  // & check them again ('change' event is needed to force bindings work).
  let newValue = 'Some text typed into textareas inner <textarea>';
  $textareaInput.val(newValue);
  $textareaInput.change();

  assert.strictEqual(
    Ember.$.trim($textareaInput.val()),
    newValue,
    'Component\'s inner <textarea>\'s value is equals to \'' + newValue + '\'');
  assert.strictEqual(
    this.get('value'),
    newValue,
    'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
});

test('changes in property binded to \'value\' causes changes in inner <textarea>', function(assert) {
  assert.expect(4);

  // Set <textarea>'s value' & render component.
  this.set('value', null);
  this.render(hbs`{{flexberry-textarea
    value=value
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Check <textarea>'s value & binded value for initial emptyness.
  assert.strictEqual(
    Ember.$.trim($textareaInput.val()),
    '',
    'Component\'s inner <textarea>\'s value is equals to \'\'');
  assert.strictEqual(
    this.get('value'),
    null,
    'Component\'s property binded to \'value\' is equals to null');

  // Change property binded to 'value' & check them again.
  let newValue = 'Some text typed into textareas inner <textarea>';
  this.set('value', newValue);

  assert.strictEqual(
    Ember.$.trim($textareaInput.val()),
    newValue,
    'Component\'s inner <textarea>\'s value is equals to \'' + newValue + '\'');
  assert.strictEqual(
    this.get('value'),
    newValue,
    'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
});
