import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'dummy/tests/helpers/start-app';
import getCurrentAgregator from 'dummy/utils/get-current-agregator';

let App;

module('Unit | Utility | get current agregator', {
  beforeEach() {
    App = startApp();
  },

  afterEach() {
    Ember.run(App, 'destroy');
  },
});

// Replace this with your real tests.
test('it works', function(assert) {
  let detailInteractionService = App.__container__.lookup('service:detail-interaction');
  let agregator;
  Ember.run(function () {
    agregator = App.__container__.lookup('service:store').createRecord('ember-flexberry-dummy-localization', { name: 'Localization' });
  });

  let agregatorsArray = Ember.A();
  detailInteractionService.pushValue('modelCurrentAgregators', agregatorsArray, agregator);
  let result = getCurrentAgregator.call(agregator);
  assert.ok(result);
});
