import { module, test } from 'qunit';
import Component from '@ember/component';
import { run } from '@ember/runloop';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import hbs from 'htmlbars-inline-precompile';
import { get, set } from '@ember/object';

import { setupIntl, setLocale, t } from 'ember-intl/test-support';
import { render, click } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | Component | flexberry-simpledatetime', function(hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, 'ru');

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
        type=this.type
        value=this.value
      }}`);

    // Retrieve component.
    let componentInput = this.element.querySelector('.custom-flatpickr');

    // Click on component to open calendar.
    await click(componentInput);

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
        value=this.value
        type=this.type
      }}`);

    // Retrieve component.
    let $component = $(this.element);
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
    set(this, 'type', typeName);
    set(this, 'dateValue', undefined);

    // Render component.
    await render(hbs`{{flexberry-simpledatetime
        type=this.type
        value=this.dateValue
      }}`);

    // Retrieve component.
    let $component = $(this.element);
    let $componentInput = $('.custom-flatpickr', $component);

    run(() => {
      $componentInput.val('01.01.2022');
      $componentInput.change();
      assert.equal(get(this, 'dateValue').toISOString().split('T')[0], '2022-01-01');
    });
  });
});
