import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';

let app;

module('Unit | Service | log', {
  beforeEach: function () {
    app = startApp();
  },
  afterEach: function() {
    destroyApp(app);
  }
});

test('error works properly', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.logErrors = true;
  let errorMessage = 'The system generated an error';

  logService.on('error', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), errorMessage);
    done();
  });

  // Call to Ember.Logger.error.
  Ember.run(() => {
    Ember.Logger.error(errorMessage);
  });
});
