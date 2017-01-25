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
  logService.storeErrorMessages = true;
  let errorMessage = 'The system generated an error';

  logService.on('error', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), errorMessage);
    done();
  });

  // Call to Ember.Logger.error.
  Ember.run(() => {
    Ember.Logger.error(errorMessage);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
  });
});

test('warn works properly', function(assert) {
  let done = assert.async();
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
  logService.storeWarnMessages = true;
  let warnMessage = 'The system generated an warn';

  logService.on('warn', this, (savedLogRecord) => {
    // Check results asyncronously.
    let savedMessageContainsWarnMessage = savedLogRecord.get('message').indexOf(warnMessage) > -1;
    assert.ok(savedMessageContainsWarnMessage);
    done();
  });

  // Call to Ember.warn.
  Ember.run(() => {
    Ember.warn(warnMessage);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
  });
});

test('info works properly', function(assert) {
  let done = assert.async();
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
  logService.storeInfoMessages = true;
  let infoMessage = 'Logging info message';

  logService.on('info', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), infoMessage);
    done();
  });

  // Call to Ember.Logger.info.
  Ember.run(() => {
    Ember.Logger.info(infoMessage);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
  });
});

test('debug works properly', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeDebugMessages = true;
  let debugMessage = 'Logging debug message';

  logService.on('debug', this, (savedLogRecord) => {
    // Check results asyncronously.
    let savedMessageContainsDebugMessage = savedLogRecord.get('message').indexOf(debugMessage) > -1;
    assert.ok(savedMessageContainsDebugMessage);
    done();
  });

  // Call to Ember.debug.
  Ember.run(() => {
    Ember.debug(debugMessage);
  });
});

test('log works properly', function(assert) {
  let done = assert.async();
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
  logService.storeLogMessages = true;
  let logMessage = 'Logging log message';

  logService.on('log', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), logMessage);
    done();
  });

  // Call to Ember.Logger.log.
  Ember.run(() => {
    Ember.Logger.log(logMessage);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
  });
});

test('deprecate works properly', function(assert) {
  let done = assert.async();
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
  logService.storeDeprecationMessages = true;
  let deprecationMessage = 'The system generated an deprecation';

  logService.on('deprecation', this, (savedLogRecord) => {
    // Check results asyncronously.
    let savedMessageContainsDeprecationMessage = savedLogRecord.get('message').indexOf(deprecationMessage) > -1;
    assert.ok(savedMessageContainsDeprecationMessage);
    done();
  });

  // Call to Ember.deprecate.
  Ember.run(() => {
    Ember.deprecate(deprecationMessage, false, { id: 'ember-flexberry-debug.feature-logger-deprecate-test', until: '0' });

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
  });
});

test('assert works properly', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeErrorMessages = true;
  let assertMessage = 'The system generated an error';

  logService.on('error', this, (savedLogRecord) => {
    // Check results asyncronously.
    let savedMessageContainsAssertMessage = savedLogRecord.get('message').indexOf(assertMessage) > -1;
    assert.ok(savedMessageContainsAssertMessage);
    done();
  });

  // Call to Ember.assert.
  Ember.run(() => {
    Ember.assert(assertMessage, false);
  });
});

test('throwing exceptions logs properly', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeErrorMessages = true;
  let errorMessage = 'The system thrown an exception';

  logService.on('error', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), errorMessage);
    done();
  });

  // Throwing an exception.
  Ember.run(() => {
    throw new Error(errorMessage);
  });
});

test('promise errors logs properly', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Override default QUnitAdapter.exception method to avoid calling additional assertion when rejecting promise.
  let oldTestAdapterException = Ember.Test.adapter.exception;
  Ember.Test.adapter.exception = () => { };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storePromiseErrors = true;
  logService.showPromiseErrors = false;
  let promiseErrorMessage = 'Promise error';

  logService.on('promise', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), promiseErrorMessage);

    //Restore default QUnitAdapter.exception method
    Ember.Test.adapter.exception = oldTestAdapterException;
    done();
  });

  // Throwing an exception.
  Ember.run(() => {
    Ember.RSVP.reject(promiseErrorMessage);
  });
});
