import Ember from 'ember';

import I18nService from 'ember-i18n/services/i18n';
import I18nRuLocale from 'ember-flexberry/locales/ru/translations';
import I18nEnLocale from 'ember-flexberry/locales/en/translations';

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-textbox', 'Integration | Component | flexberry-textbox', {
  integration: true,

  beforeEach: function () {
    this.register('locale:ru/translations', I18nRuLocale);
    this.register('locale:en/translations', I18nEnLocale);
    this.register('service:i18n', I18nService);

    this.inject.service('i18n', { as: 'i18n' });
    Ember.Component.reopen({
      i18n: Ember.inject.service('i18n')
    });
  }
});

test('it renders properly', function(assert) {
    assert.expect(10);

    // Set default locale as 'ru' & render component.
    this.set('i18n.locale', 'ru');
    this.render(hbs`{{flexberry-textbox
      class=class
    }}`);

    // Retrieve component.
    let $component = this.$().children();
    let $textboxInput = $component.children('input');

    // Check wrapper <div>.
    assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
    assert.strictEqual($component.hasClass('flexberry-textbox'), true, 'Component\'s wrapper has \' flexberry-textbox\' css-class');
    assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
    assert.strictEqual($component.hasClass('input'), true, 'Component\'s wrapper has \'input\' css-class');

    // Check <input>.
    assert.strictEqual($textboxInput.length === 1, true, 'Component has inner <input>');
    assert.strictEqual($textboxInput.attr('type'), 'text', 'Component\'s inner <input> is of text type');

    // Check wrapper's additional CSS-classes.
    let additioanlCssClasses = 'additional-css-class-name and-another-one';
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

test('it renders i18n-ed placeholder', function(assert) {
    assert.expect(2);

    // Set default locale as 'ru' & render component.
    this.set('i18n.locale', 'ru');
    this.render(hbs`{{flexberry-textbox}}`);

    // Retrieve component.
    let $component = this.$().children();
    let $textboxInput = $component.children('input');

    // Check <input>'s placeholder.
    assert.strictEqual(
      Ember.$.trim($textboxInput.attr('placeholder')),
      Ember.get(I18nRuLocale, 'components.flexberry-textbox.placeholder'),
      'Component\'s inner <input>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

    // Change current locale to 'en' & check <input>'s placeholder again.
    this.set('i18n.locale', 'en');
    assert.strictEqual(
      Ember.$.trim($textboxInput.attr('placeholder')),
      Ember.get(I18nEnLocale, 'components.flexberry-textbox.placeholder'),
      'Component\'s inner <input>\'s placeholder is equals to it\'s value from i18n locales/en/translations');
});

test('it renders manually defined placeholder', function(assert) {
    assert.expect(2);

    // Set <input>'s placeholder' & render component.
    let placeholder = 'Input is empty, please type some text';
    this.set('placeholder', placeholder);
    this.render(hbs`{{flexberry-textbox
      placeholder=placeholder
    }}`);

    // Retrieve component.
    let $component = this.$().children();
    let $textboxInput = $component.children('input');

    // Check <input>'s placeholder.
    assert.strictEqual(
      Ember.$.trim($textboxInput.attr('placeholder')),
      placeholder,
      'Component\'s inner <input>\'s placeholder is equals to manually defined value \'' + placeholder + '\'');

    // Change placeholder's value & check <input>'s placeholder again.
    placeholder = 'Input has no value';
    this.set('placeholder', placeholder);
    assert.strictEqual(
      Ember.$.trim($textboxInput.attr('placeholder')),
      placeholder,
      'Component\'s inner <input>\'s placeholder is equals to manually updated value \'' + placeholder + '\'');
});

test('Changes in inner <input> causes changes in property binded to \'value\'', function(assert) {
    assert.expect(4);

    // Set <input>'s value' & render component.
    this.set('value', null);
    this.render(hbs`{{flexberry-textbox
      value=value
    }}`);

    // Retrieve component.
    let $component = this.$().children();
    let $textboxInput = $component.children('input');

    // Check <input>'s value & binded value for initial emptyness.
    assert.strictEqual(
      Ember.$.trim($textboxInput.val()),
      '',
      'Component\'s inner <input>\'s value is equals to \'\'');
    assert.strictEqual(
      this.get('value'),
      null,
      'Component\'s property binded to \'value\' is equals to null');

    // Change <input>'s value (imitate situation when user typed something into component's <input>)
    // & check them again ('chenge' event is needed to force bindings work).
    let newValue = 'Some text typed into textboxes inner <input>';
    $textboxInput.val(newValue);
    $textboxInput.change();

    assert.strictEqual(
      Ember.$.trim($textboxInput.val()),
      newValue,
      'Component\'s inner <input>\'s value is equals to \'' + newValue + '\'');
    assert.strictEqual(
      this.get('value'),
      newValue,
      'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
});

test('Changes in property binded to \'value\' causes changes in inner <input>', function(assert) {
    assert.expect(4);

    // Set <input>'s value' & render component.
    this.set('value', null);
    this.render(hbs`{{flexberry-textbox
      value=value
    }}`);

    // Retrieve component.
    let $component = this.$().children();
    let $textboxInput = $component.children('input');

    // Check <input>'s value & binded value for initial emptyness.
    assert.strictEqual(
      Ember.$.trim($textboxInput.val()),
      '',
      'Component\'s inner <input>\'s value is equals to \'\'');
    assert.strictEqual(
      this.get('value'),
      null,
      'Component\'s property binded to \'value\' is equals to null');

    // Change property binded to 'value' & check them again.
    let newValue = 'Some text typed into textboxes inner <input>';
    this.set('value', newValue);

    assert.strictEqual(
      Ember.$.trim($textboxInput.val()),
      newValue,
      'Component\'s inner <input>\'s value is equals to \'' + newValue + '\'');
    assert.strictEqual(
      this.get('value'),
      newValue,
      'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
});
