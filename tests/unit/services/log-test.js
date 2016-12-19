import Ember from 'ember';
import { module, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';
import AggregatorModel from '../../../models/components-examples/flexberry-groupedit/shared/aggregator';
import UserSettingsService from 'ember-flexberry/services/user-settings';

let app;

module('log-service', 'Unit | Service | log', {
  beforeEach: function () {
    app = startApp();
  },
  afterEach: function() {
    destroyApp(app);
  }
});

test('it works properly', function(assert) {
  let store = App.__container__.lookup('service:store');
  let logService = App.__container__.lookup('service:log');

  ...
});
