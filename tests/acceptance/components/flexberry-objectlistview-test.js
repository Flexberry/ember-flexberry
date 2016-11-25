import Ember from 'ember';

import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';

let app;

module('Acceptance | flexberry-objectlistview', {
  beforeEach() {

    // Start application.
    app = startApp();

    // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
    let applicationController = app.__container__.lookup('controller:application');
    applicationController.set('isInAcceptanceTestMode', true);
  },

  afterEach() {
    Ember.run(app, 'destroy');
  }
});

test('visiting flexberry-objectlistview', function(assert) {
  visit('components-acceptance-tests/flexberry-objectlistview/base-operations');
  andThen(function() {
    assert.equal(currentPath(), 'components-acceptance-tests/flexberry-objectlistview/base-operations');
  });
});
