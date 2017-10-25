import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-validationsummary', 'Integration | Component | flexberry validationsummary', {
  integration: true
});

test('it renders and works', function(assert) {
  this.render(hbs`{{flexberry-validationsummary errors=errors}}`);

  assert.ok(this.$('.ui.message').is(':hidden'));
  assert.equal(this.$('.ui.message').text().trim(), '');

  this.set('errors', Ember.A());
  this.render(hbs`{{flexberry-validationsummary errors=errors}}`);

  assert.ok(this.$('.ui.message').is(':hidden'));
  assert.equal(this.$('.ui.message').text().trim(), '');

  this.set('errors', Ember.A(['Validation error.']));
  this.render(hbs`{{flexberry-validationsummary errors=errors color="blue"}}`);

  assert.ok(this.$('.ui.message').is(':visible'));
  assert.ok(this.$('.ui.message').hasClass('blue'));
  assert.equal(this.$('.ui.message').text().trim(), 'Validation error.');
});
