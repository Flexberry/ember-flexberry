import { moduleForComponent, test } from 'ember-qunit';
import Component from '@ember/component';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import hbs from 'htmlbars-inline-precompile';

import I18nService from 'ember-i18n/services/i18n';
import I18nRuLocale from 'ember-flexberry/locales/ru/translations';
import I18nEnLocale from 'ember-flexberry/locales/en/translations';

moduleForComponent('flexberry-simpledatetime', 'Integration | Component | flexberry simpledatetime', {
  integration: true,

  beforeEach: function () {
    this.register('locale:ru/translations', I18nRuLocale);
    this.register('locale:en/translations', I18nEnLocale);
    this.register('service:i18n', I18nService);

    this.inject.service('i18n', { as: 'i18n' });
    Component.reopen({
      i18n: service('i18n')
    });

    // Set 'ru' as initial locale.
    this.set('i18n.locale', 'ru');
  }
});

test('it renders', function(assert) {
  this.render(hbs`{{flexberry-simpledatetime}}`);
  assert.ok(true);
});

test('render with type before value', function(assert) {
  assert.expect(1);
  let typeName = 'date';
  this.set('type', typeName);

  // Render component.
  this.render(hbs`{{flexberry-simpledatetime
      type=type
      value=value
    }}`);

  // Retrieve component.
  let $component = this.$();
  let $componentInput = $('.flatpickr-input.custom-flatpickr', $component);

  // Click on component to open calendar.
  $componentInput.click();

  let $calendar = $('.flatpickr-calendar');

  // Check calendar.
  assert.strictEqual($calendar.hasClass('flatpickr-calendar'), true, 'Component\'s wrapper has \' flatpickr-calendar\' css-class');
});

test('render with type afther value', function(assert) {
  assert.expect(1);
  let typeName = 'date';
  this.set('type', typeName);

  // Render component.
  this.render(hbs`{{flexberry-simpledatetime
      value=value
      type=type
    }}`);

  // Retrieve component.
  let $component = this.$();
  let $componentInput = $('.flatpickr-input.custom-flatpickr', $component);

  // Click on component to open calendar.
  $componentInput.click();

  let $calendar = $('.flatpickr-calendar');

  // Check calendar.
  assert.strictEqual($calendar.hasClass('flatpickr-calendar'), true, 'Component\'s wrapper has \' flatpickr-calendar\' css-class');
});

test('properly init value by input', function(assert) {
  assert.expect(1);
  let typeName = 'date';
  Ember.set(this, 'type', typeName);
  Ember.set(this, 'dateValue', undefined);

  // Render component.
  this.render(hbs`{{flexberry-simpledatetime
      type=type
      value=dateValue
    }}`);

  // Retrieve component.
  let $component = this.$();
  let $componentInput = Ember.$('.custom-flatpickr', $component);

  Ember.run(() => {
    $componentInput.val('01.01.2022');
    $componentInput.change();
    assert.equal(Ember.get(this, 'dateValue').toISOString().split('T')[0], '2022-01-01');
  });
});
