import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-simpledatetime', 'Integration | Component | flexberry simpledatetime', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{flexberry-simpledatetime}}`);
  assert.ok(true);
});

test('render with type before value', function(assert) {
  assert.expect(1);
  let typeName = 'date';
  this.set('typeName', typeName);

  // Render component.
  this.render(hbs`{{flexberry-simpledatetime
      type='date'
      value=value
      placeholder=placeholder
    }}`);

  // Retrieve component.
  let $component = this.$();
  let $componentInput = Ember.$('.flatpickr-input.custom-flatpickr', $component);

  // Click on component to open calendar.
  $componentInput.click();

  let $calendar = Ember.$('.flatpickr-calendar');

  // Check calendar.
  assert.strictEqual($calendar.hasClass('flatpickr-calendar'), true, 'Component\'s wrapper has \' flatpickr-calendar\' css-class');
});

test('render with type afther value', function(assert) {
  assert.expect(1);
  let typeName = 'date';
  this.set('typeName', typeName);

  // Render component.
  this.render(hbs`{{flexberry-simpledatetime
      value=value
      type='date'
      placeholder=placeholder
    }}`);

  // Retrieve component.
  let $component = this.$();
  let $componentInput = Ember.$('.flatpickr-input.custom-flatpickr', $component);

  // Click on component to open calendar.
  $componentInput.click();

  let $calendar = Ember.$('.flatpickr-calendar');

  // Check calendar.
  assert.strictEqual($calendar.hasClass('flatpickr-calendar'), true, 'Component\'s wrapper has \' flatpickr-calendar\' css-class');
});
