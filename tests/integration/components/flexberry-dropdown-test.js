import Ember from 'ember';

import I18nService from 'ember-i18n/services/i18n';
import I18nRuLocale from 'ember-flexberry/locales/ru/translations';
import I18nEnLocale from 'ember-flexberry/locales/en/translations';

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-dropdown', 'Integration | Component | flexberry dropdown', {
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
  assert.expect(6);

  // Render component.
  this.render(hbs`{{flexberry-dropdown
    class=class
  }}`);

  // Retrieve component.
  let $component = this.$().children();

  // Check wrapper's additional CSS-classes.
  let additioanlCssClasses = 'scrolling compact fluid';
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
  this.render(hbs`{{flexberry-dropdown
    class=class
  }}`);

  // Retrieve component.
  let $component = this.$().children();

  // Check that readonly (disabled) attribute doesn't exist yet.
  assert.strictEqual($component.hasClass('disabled'), false, 'Component\'s hasn\'t readonly');

  // Activate readonly mode & check that readonly (disabled) attribute exists now & has value equals to 'readonly'.
  this.set('class', 'disabled');
  assert.strictEqual($component.hasClass('disabled'), true, 'Component\'s has readonly');

  // Check that readonly (disabled) attribute doesn't exist now.
  this.set('class', '');
  assert.strictEqual($component.hasClass('disabled'), false, 'Component\'s hasn\'t readonly');
});

