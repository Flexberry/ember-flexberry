import Ember from 'ember';
import { module, test } from 'qunit';
import DS from 'ember-data';
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
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
    savedLogRecord = this;
    return new Ember.RSVP.Promise((resolve, reject) => {
      resolve();
    });
  };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.logErrors = true;

  // Call to Ember.Logger.error & check results.
  Ember.run(() => {
    let errorMessage = 'The system generated an error';
    let done = assert.async();

    Ember.Logger.error(errorMessage).then(() => {
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), errorMessage);
    }).finally(() => {

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;

      done();
    });
  });
});
