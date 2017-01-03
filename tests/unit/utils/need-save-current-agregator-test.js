import needSaveCurrentAgregator from 'dummy/utils/need-save-current-agregator';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';

let App;

module('Unit | Utility | need save current agregator', {
  setup: function() {
    App = startApp();
    let offlineGlobals = App.__container__.lookup('service:offline-globals');
    offlineGlobals.setOnlineAvailable(false);
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  let agregator;
  Ember.run(function () {
    agregator = App.__container__.lookup('service:store').createRecord('ember-flexberry-dummy-localization', { name: 'Localization' });
  });

  let resultOk = needSaveCurrentAgregator.call(agregator, agregator);
  assert.ok(resultOk);

  let resultNotOk = needSaveCurrentAgregator.call(agregator);
  assert.notOk(resultNotOk);
});
