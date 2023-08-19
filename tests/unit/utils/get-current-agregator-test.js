import { run } from '@ember/runloop';
import { A } from '@ember/array';
import { module, test } from 'qunit';
import startApp from 'dummy/tests/helpers/start-app';
import getCurrentAgregator from 'dummy/utils/get-current-agregator';

let App;

module('Unit | Utility | get current agregator', function(hooks) {
  hooks.beforeEach(() => {
    App = startApp();
  });

  hooks.afterEach(() => {
    run(App, 'destroy');
  });

  test('it works', function(assert) {
    let detailInteractionService = App.__container__.lookup('service:detail-interaction');
    let agregator;
    run(function () {
      agregator = App.__container__.lookup('service:store').createRecord('ember-flexberry-dummy-localization', { name: 'Localization' });
    });
  
    let agregatorsArray = A();
    detailInteractionService.pushValue('modelCurrentAgregators', agregatorsArray, agregator);
    let result = getCurrentAgregator.call(agregator);
    assert.ok(result);
  });
});
