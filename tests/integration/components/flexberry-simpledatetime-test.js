import { module, test } from 'qunit';
import Component from '@ember/component';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import hbs from 'htmlbars-inline-precompile';

import I18nService from 'ember-i18n/services/i18n';
import I18nRuLocale from 'ember-flexberry/locales/ru/translations';
import I18nEnLocale from 'ember-flexberry/locales/en/translations';
import { render, click } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | Component | flexberry-simpledatetime', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach (function () {
    this.owner.register('locale:ru/translations', I18nRuLocale);
    this.owner.register('locale:en/translations', I18nEnLocale);
    this.owner.register('service:i18n', I18nService);

      // Injecting i18n service into the test context
      this.i18n = this.owner.lookup('service:i18n');
    
      Component.reopen({
        i18n: service('i18n')
      });
  
      // Set 'ru' as the initial locale
      this.i18n.set('locale', 'ru');
  });

  test('it renders', async function(assert) {
    await render(hbs`{{flexberry-simpledatetime}}`);
    assert.ok(true);
  });

  test('render with type before value', async function(assert) {
    assert.expect(1);
    let typeName = 'date';
    this.set('type', typeName);

    // Render component.
    await render(hbs`{{flexberry-simpledatetime
        type=type
        value=value
      }}`);

    // Retrieve component.
    //let $component = this.$();
    //let $componentInput = $('.flatpickr-input.custom-flatpickr', $component);
    //let componentInput = $component.querySelector('.flatpickr-input.custom-flatpickr');
    let componentInput = this.element.querySelector('.custom-flatpickr');


    // Click on component to open calendar.
    await click(componentInput);

    //let $calendar = $('.flatpickr-calendar');
    let calendar = document.querySelector('.flatpickr-calendar');

    // Check calendar.
    assert.strictEqual(calendar.classList.contains('flatpickr-calendar'), true, 'Component\'s wrapper has \' flatpickr-calendar\' css-class');
  });

  test('render with type afther value', async function(assert) {
    assert.expect(1);
    let typeName = 'date';
    this.set('type', typeName);

    // Render component.
    await render(hbs`{{flexberry-simpledatetime
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

  test('properly init value by input', async function(assert) {
    assert.expect(1);
    let typeName = 'date';
    Ember.set(this, 'type', typeName);
    Ember.set(this, 'dateValue', undefined);

    // Render component.
    await render(hbs`{{flexberry-simpledatetime
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
});

