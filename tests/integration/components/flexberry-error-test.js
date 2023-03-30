import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-error', 'Integration | Component | flexberry error', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{flexberry-error error=error modalContext='body'}}`);
  this.set('error', new Error('Error, error, error...'));
  assert.ok(/Error, error, error.../.test(this.$().text()));
});
