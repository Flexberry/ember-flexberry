import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import startApp from '../../helpers/start-app';

moduleForComponent('olv-filter-interval', 'Integration | Component | olv filter interval', {
  integration: true,
  beforeEach: function () {
  App = startApp();
  Ember.Component.reopen({
    i18n: Ember.inject.service('i18n'),
  });
}
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{olv-filter-interval}}`);

  assert.equal(this.$().text().trim(), '');
});
