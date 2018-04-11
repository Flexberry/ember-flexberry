import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from 'dummy/tests/helpers/start-app';
import needSaveCurrentAgregator from 'dummy/utils/need-save-current-agregator';

let App;

module('Unit | Utility | need save current agregator', {
  beforeEach() {
    App = startApp();
    let offlineGlobals = App.__container__.lookup('service:offline-globals');
    offlineGlobals.setOnlineAvailable(false);
  },

  afterEach() {
    run(App, 'destroy');
  },
});

// Replace this with your real tests.
test('it works', function(assert) {
  let agregator;
  run(function () {
    agregator = App.__container__.lookup('service:store').createRecord('ember-flexberry-dummy-localization', { name: 'Localization' });
  });

  let resultOk = needSaveCurrentAgregator.call(agregator, agregator);
  assert.ok(resultOk);

  let resultNotOk = needSaveCurrentAgregator.call(agregator);
  assert.notOk(resultNotOk);
});
