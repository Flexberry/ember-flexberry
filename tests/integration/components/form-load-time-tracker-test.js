import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const formLoadTimeTracker = Ember.Service.extend({
  loadTime: 1,
  renderTime: 2,
});

moduleForComponent('form-load-time-tracker', 'Integration | Component | form load time tracker', {
  integration: true,

  beforeEach() {
    this.register('service:form-load-time-tracker', formLoadTimeTracker);
    this.inject.service('form-load-time-tracker', { as: 'formLoadTimeTracker' });
  },
});

test('it renders', function(assert) {
  this.render(hbs`{{form-load-time-tracker}}`);
  assert.equal(this.$().text().trim(), 'Load time: 1\nRender time: 2');

  this.render(hbs`{{#form-load-time-tracker}}Yield here!{{/form-load-time-tracker}}`);
  assert.equal(this.$().text().trim(), 'Load time: 1\nRender time: 2\nYield here!');
});
