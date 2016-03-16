import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-simpledatetime', 'Integration | Component | flexberry simpledatetime', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{flexberry-simpledatetime}}`);
  assert.ok(true);
});
