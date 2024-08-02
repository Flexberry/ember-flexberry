import Component from '@ember/component';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import { A } from '@ember/array';
import { typeOf } from '@ember/utils';

import I18nService from 'ember-i18n/services/i18n';
import I18nRuLocale from 'ember-flexberry/locales/ru/translations';
import I18nEnLocale from 'ember-flexberry/locales/en/translations';

import { module, test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';


module( 'Integration | Component | flexberry-textbox', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach( function () {
    this.owner.register('locale:ru/translations', I18nRuLocale);
    this.owner.register('locale:en/translations', I18nEnLocale);
    this.owner.register('service:i18n', I18nService);

    this.i18n = this.owner.lookup('service:i18n');
    Component.reopen({
      i18n: service('i18n')
    });

    // Set 'ru' as initial locale.
    this.i18n.set('locale', 'ru');
  })


  test('it renders properly', async function(assert) {
    assert.expect(16);

    // Render component.
    await render(hbs`{{flexberry-textbox
      class=class
    }}`);

    // Retrieve component.
    let $component = $(this.element).children();
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
    let additioanlCssClasses = 'fluid transparent mini huge error';
    this.set('class', additioanlCssClasses);
    /* eslint-disable no-unused-vars */
    A(additioanlCssClasses.split(' ')).forEach((cssClassName, index) => {
      assert.strictEqual(
      $component.hasClass(cssClassName),
      true,
      'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
    });
    /* eslint-enable no-unused-vars */

    // Clean up wrapper's additional CSS-classes.
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

  test('class changes through base-component\'s dynamic properties works properly', async function (assert) {
    assert.expect(6);

    let initialClass = 'class1 class2';
    let anotherClass = 'firstClass secondClass';
    let dynamicProperties = {
      class: initialClass
    };

    this.set('dynamicProperties', dynamicProperties);

    await render(hbs`
      {{flexberry-textbox
        dynamicProperties=dynamicProperties
      }}
    `);

    let $component = $(this.element).children();

    assert.strictEqual($component.hasClass('class1'), true, 'Component\'s container has \'class1\' css-class');
    assert.strictEqual($component.hasClass('class2'), true, 'Component\'s container has \'class2\' css-class');

    set(dynamicProperties, 'class', anotherClass);
    assert.strictEqual($component.hasClass('class1'), false, 'Component\'s container hasn\'t \'class1\' css-class');
    assert.strictEqual($component.hasClass('class2'), false, 'Component\'s container hasn\'t \'class2\' css-class');
    assert.strictEqual($component.hasClass('firstClass'), true, 'Component\'s container has \'firstClass\' css-class');
    assert.strictEqual($component.hasClass('secondClass'), true, 'Component\'s container has \'secondClass\' css-class');
  });

  test('readonly mode works properly', async function(assert) {
    assert.expect(3);

    // Render component.
    await render(hbs`{{flexberry-textbox
      class=class
      readonly=readonly
    }}`);

    // Retrieve component.
    let $component = $(this.element).children();
    let $textboxInput = $component.children('input');

    // Check that <input>'s readonly attribute doesn't exist yet.
    assert.strictEqual(
      $.trim($textboxInput.attr('readonly')),
      '',
      'Component\'s inner <input> hasn\'t readonly attribute');

    // Activate readonly mode & check that <input>'s readonly attribute exists now & has value equals to 'readonly'.
    this.set('readonly', true);

    $textboxInput = $component.children('input');
    assert.strictEqual(
      $.trim($textboxInput.attr('readonly')),
      'readonly',
      'Component\'s inner <input> has readonly attribute with value equals to \'readonly\'');

    // Check that <input>'s readonly attribute doesn't exist now.
    this.set('readonly', false);

    $textboxInput = $component.children('input');
    assert.strictEqual(
      $.trim($textboxInput.attr('readonly')),
      '',
      'Component\'s inner <input> hasn\'t readonly attribute');
  });

  test('readonly mode works properly with value', async function(assert) {
    assert.expect(2);

    // Set <input>'s value' & render component.
    this.set('value', null);
    this.set('readonly', true);
    await render(hbs`{{flexberry-textbox
      readonly=readonly
      value=value
    }}`);

    // Retrieve component.
    let $component = $(this.element).children();
    let $textboxInput = $component.children('input');

    $textboxInput.on('change', (e) => {
      if (this.get('readonly')) {
        e.stopPropagation();
        $textboxInput.val(null);
      }
    });

    let newValue = 'New value';
    $textboxInput.val(newValue);
    $textboxInput.change();

    // Check <input>'s value not changed.
    assert.strictEqual(
      $.trim($textboxInput.val()),
      '',
      'Component\'s inner <input>\'s value not changed');
    assert.strictEqual(
      this.get('value'),
      null,
      'Component\'s property binded to unchanged \'value\'');
  });

  test('click on textbox in readonly mode doesn\'t change value & it\'s type', async function(assert) {
    assert.expect(3);

    // Set <input>'s value' & render component.
    let value = 123;
    this.set('value', value);
    await render(hbs`{{flexberry-textbox
      readonly=true
      value=value
    }}`);

    // Retrieve component.
    let $component = $(this.element).children();
    let $textboxInput = $component.children('input');

    $textboxInput.click();
    $textboxInput.change();

    // Check <input>'s value not changed.
    assert.strictEqual(
      $.trim($textboxInput.val()),
      '' + value,
      'Component\'s inner <input>\'s value not changed');
    assert.strictEqual(
      this.get('value'),
      value,
      'Value binded to component\'s \'value\' property is unchanged');
    assert.strictEqual(
      typeOf(this.get('value')),
      'number',
      'Value binded to component\'s \'value\' property is still number');
  });

  test('it renders i18n-ed placeholder', async function(assert) {
    assert.expect(2);

    // Render component.
    await render(hbs`{{flexberry-textbox}}`);

    // Retrieve component.
    let $component = $(this.element).children();
    let $textboxInput = $component.children('input');

    // Check <input>'s placeholder.
    assert.strictEqual(
      $.trim($textboxInput.attr('placeholder')),
      get(I18nRuLocale, 'components.flexberry-textbox.placeholder'),
      'Component\'s inner <input>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

    // Change current locale to 'en' & check <input>'s placeholder again.
    this.set('i18n.locale', 'en');
    assert.strictEqual(
      $.trim($textboxInput.attr('placeholder')),
      get(I18nEnLocale, 'components.flexberry-textbox.placeholder'),
      'Component\'s inner <input>\'s placeholder is equals to it\'s value from i18n locales/en/translations');
  });

  test('it renders manually defined placeholder', async function(assert) {
    assert.expect(2);

    // Set <input>'s placeholder' & render component.
    let placeholder = 'Input is empty, please type some text';
    this.set('placeholder', placeholder);
    await render(hbs`{{flexberry-textbox
      placeholder=placeholder
    }}`);

    // Retrieve component.
    let $component = $(this.element).children();
    let $textboxInput = $component.children('input');

    // Check <input>'s placeholder.
    assert.strictEqual(
      $.trim($textboxInput.attr('placeholder')),
      placeholder,
      'Component\'s inner <input>\'s placeholder is equals to manually defined value \'' + placeholder + '\'');

    // Change placeholder's value & check <input>'s placeholder again.
    placeholder = 'Input has no value';
    this.set('placeholder', placeholder);
    assert.strictEqual(
      $.trim($textboxInput.attr('placeholder')),
      placeholder,
      'Component\'s inner <input>\'s placeholder is equals to manually updated value \'' + placeholder + '\'');
  });

  test('changes in inner <input> causes changes in property binded to \'value\'', async function(assert) {
    assert.expect(4);

    // Set <input>'s value' & render component.
    this.set('value', null);
    await render(hbs`{{flexberry-textbox
      value=value
    }}`);

    // Retrieve component.
    let $component = $(this.element).children();
    let $textboxInput = $component.children('input');

    // Check <input>'s value & binded value for initial emptyness.
    assert.strictEqual(
      $.trim($textboxInput.val()),
      '',
      'Component\'s inner <input>\'s value is equals to \'\'');
    assert.strictEqual(
      this.get('value'),
      null,
      'Component\'s property binded to \'value\' is equals to null');

    // Change <input>'s value (imitate situation when user typed something into component's <input>)
    // & check them again ('change' event is needed to force bindings work).
    let newValue = 'Some text typed into textboxes inner <input>';
    $textboxInput.val(newValue);
    $textboxInput.change();

    assert.strictEqual(
      $.trim($textboxInput.val()),
      newValue,
      'Component\'s inner <input>\'s value is equals to \'' + newValue + '\'');
    assert.strictEqual(
      this.get('value'),
      newValue,
      'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
  });

  test('attribute maxlength rendered in html', async function(assert) {
    assert.expect(1);

    // Render component.
    await render(hbs`{{flexberry-field
      maxlength=5
    }}`);

    // Retrieve component.
    let $component = $(this.element).children();
    let $fieldInput = $('.flexberry-textbox input', $component);

    // Check <input>'s maxlength attribute.
    assert.strictEqual(
      $fieldInput.attr('maxlength'),
      '5',
      'Component\'s inner <input>\'s attribute maxlength rendered');
  });

  test('changes in property binded to \'value\' causes changes in inner <input>', async function(assert) {
    assert.expect(4);

    // Set <input>'s value' & render component.
    this.set('value', null);
    await render(hbs`{{flexberry-textbox
      value=value
    }}`);

    // Retrieve component.
    let $component = $(this.element).children();
    let $textboxInput = $component.children('input');

    // Check <input>'s value & binded value for initial emptyness.
    assert.strictEqual(
      $.trim($textboxInput.val()),
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
      $.trim($textboxInput.val()),
      newValue,
      'Component\'s inner <input>\'s value is equals to \'' + newValue + '\'');
    assert.strictEqual(
      this.get('value'),
      newValue,
      'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
  });
});
