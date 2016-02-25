import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('flexberry-validationsummary', 'Integration | Component | flexberry validationsummary', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.set('errors', new Ember.Object());

  this.render(hbs`{{flexberry-validationsummary errors=errors}}`);

  assert.equal(this.$().text().trim(), '');
});
