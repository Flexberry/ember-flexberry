import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';
import config from '../../../config/environment';

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
  assert.expect(10);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeErrorMessages = true;
  let errorMessage = 'The system generated an error';
  let errorMachineName = location.hostname;
  let errorAppDomainName = window.navigator.userAgent;
  let errorProcessId = document.location.href;

  logService.on('error', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'ERROR');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '1');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), errorMachineName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), errorAppDomainName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), errorProcessId);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), config.modulePrefix);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), errorMessage);
    let formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
    assert.ok(formattedMessageIsOk);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.Logger.error.
  Ember.run(() => {
    Ember.Logger.error(errorMessage);
  });
});
test('logService works properly when storeErrorMessages disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeErrorMessages = false;
  let errorMessage = 'The system generated an error';

  logService.on('error', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.notOk(savedLogRecord);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.Logger.error.
  Ember.run(() => {
    Ember.Logger.error(errorMessage);
  });
});

test('logService for error works properly when it\'s disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
    savedLogRecord = this;
    return Ember.RSVP.resolve(savedLogRecord);
  };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = false;
  logService.storeErrorMessages = true;
  let errorMessage = 'The system generated an error';

  logService.on('error', this, (savedLogRecord) => {
    // Check results asyncronously.
    if (savedLogRecord) {
      throw new Error('Log is disabled, DB isn\'t changed');
    } else {
      assert.ok(true, 'Check log call, DB isn\'t changed');
    }

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.Logger.error.
  Ember.run(() => {
    Ember.Logger.error(errorMessage);
  });
});

test('warn works properly', function(assert) {
  let done = assert.async();
  assert.expect(10);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeWarnMessages = true;
  let warnMessage = 'The system generated an warn';
  let warnMachineName = location.hostname;
  let warnAppDomainName = window.navigator.userAgent;
  let warnProcessId = document.location.href;

  logService.on('warn', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'WARN');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '2');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), warnMachineName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), warnAppDomainName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), warnProcessId);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), config.modulePrefix);
    let savedMessageContainsWarnMessage = savedLogRecord.get('message').indexOf(warnMessage) > -1;
    assert.ok(savedMessageContainsWarnMessage);
    let formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
    assert.ok(formattedMessageIsOk);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.warn.
  Ember.run(() => {
    Ember.warn(warnMessage);
  });
});

test('logService works properly when storeWarnMessages disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeWarnMessages = false;
  let warnMessage = 'The system generated an warn';

  logService.on('warn', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.notOk(savedLogRecord);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.warn.
  Ember.run(() => {
    Ember.warn(warnMessage);
  });
});

test('logService for warn works properly when it\'s disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
    savedLogRecord = this;
    return Ember.RSVP.resolve(savedLogRecord);
  };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = false;
  logService.storeWarnMessages = true;
  let warnMessage = 'The system generated an warn';

  logService.on('warn', this, (savedLogRecord) => {
    // Check results asyncronously.
    if (savedLogRecord) {
      throw new Error('Log is disabled, DB isn\'t changed');
    } else {
      assert.ok(true, 'Check log call, DB isn\'t changed');
    }

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.warn.
  Ember.run(() => {
    Ember.warn(warnMessage);
  });
});

test('log works properly', function(assert) {
  let done = assert.async();
  assert.expect(10);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeLogMessages = true;
  let logMessage = 'Logging log message';
  let logMachineName = location.hostname;
  let logAppDomainName = window.navigator.userAgent;
  let logProcessId = document.location.href;

  logService.on('log', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'LOG');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '3');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), logMachineName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), logAppDomainName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), logProcessId);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), config.modulePrefix);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), logMessage);
    let formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
    assert.ok(formattedMessageIsOk);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.Logger.log.
  Ember.run(() => {
    Ember.Logger.log(logMessage);
  });
});

test('logService works properly when storeLogMessages disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeLogMessages = false;
  let logMessage = 'Logging log message';

  logService.on('log', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.notOk(savedLogRecord);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.Logger.log.
  Ember.run(() => {
    Ember.Logger.log(logMessage);
  });
});

test('logService for log works properly when it\'s disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
    savedLogRecord = this;
    return Ember.RSVP.resolve(savedLogRecord);
  };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = false;
  logService.storeLogMessages = true;
  let logMessage = 'Logging log message';

  logService.on('log', this, (savedLogRecord) => {
    // Check results asyncronously.
    if (savedLogRecord) {
      throw new Error('Log is disabled, DB isn\'t changed');
    } else {
      assert.ok(true, 'Check log call, DB isn\'t changed');
    }

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.Logger.log.
  Ember.run(() => {
    Ember.Logger.log(logMessage);
  });
});

test('info works properly', function(assert) {
  let done = assert.async();
  assert.expect(10);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeInfoMessages = true;
  let infoMessage = 'Logging info message';
  let infoMachineName = location.hostname;
  let infoAppDomainName = window.navigator.userAgent;
  let infoProcessId = document.location.href;

  logService.on('info', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'INFO');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '4');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), infoMachineName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), infoAppDomainName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), infoProcessId);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), config.modulePrefix);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), infoMessage);
    let formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
    assert.ok(formattedMessageIsOk);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.Logger.info.
  Ember.run(() => {
    Ember.Logger.info(infoMessage);
  });
});

test('logService works properly when storeInfoMessages disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeInfoMessages = false;
  let infoMessage = 'Logging info message';

  logService.on('info', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.notOk(savedLogRecord);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.Logger.info.
  Ember.run(() => {
    Ember.Logger.info(infoMessage);

  });
});

test('logService for info works properly when it\'s disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
    savedLogRecord = this;
    return Ember.RSVP.resolve(savedLogRecord);
  };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = false;
  logService.storeInfoMessages = true;
  let infoMessage = 'Logging info message';

  logService.on('info', this, (savedLogRecord) => {
    // Check results asyncronously.
    if (savedLogRecord) {
      throw new Error('Log is disabled, DB isn\'t changed');
    } else {
      assert.ok(true, 'Check log call, DB isn\'t changed');
    }

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.Logger.info.
  Ember.run(() => {
    Ember.Logger.info(infoMessage);
  });
});

test('debug works properly', function(assert) {
  let done = assert.async();
  assert.expect(10);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeDebugMessages = true;
  let debugMessage = 'Logging debug message';
  let debugMachineName = location.hostname;
  let debugAppDomainName = window.navigator.userAgent;
  let debugProcessId = document.location.href;

  logService.on('debug', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'DEBUG');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '5');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), debugMachineName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), debugAppDomainName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), debugProcessId);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), config.modulePrefix);
    let savedMessageContainsDebugMessage = savedLogRecord.get('message').indexOf(debugMessage) > -1;
    assert.ok(savedMessageContainsDebugMessage);
    let formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
    assert.ok(formattedMessageIsOk);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.debug.
  Ember.run(() => {
    Ember.debug(debugMessage);
  });
});

test('logService works properly when storeDebugMessages disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeDebugMessages = false;
  let debugMessage = 'Logging debug message';

  logService.on('debug', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.notOk(savedLogRecord);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.debug.
  Ember.run(() => {
    Ember.debug(debugMessage);
  });
});

test('logService for debug works properly when it\'s disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
    savedLogRecord = this;
    return Ember.RSVP.resolve(savedLogRecord);
  };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = false;
  logService.storeDebugMessages = true;
  let debugMessage = 'Logging debug message';

  logService.on('debug', this, (savedLogRecord) => {
    // Check results asyncronously.
    if (savedLogRecord) {
      throw new Error('Log is disabled, DB isn\'t changed');
    } else {
      assert.ok(true, 'Check log call, DB isn\'t changed');
    }

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.debug.
  Ember.run(() => {
    Ember.debug(debugMessage);
  });
});

test('deprecate works properly', function(assert) {
  let done = assert.async();
  assert.expect(10);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeDeprecationMessages = true;
  let deprecationMessage = 'The system generated an deprecation';
  let deprecationMachineName = location.hostname;
  let deprecationAppDomainName = window.navigator.userAgent;
  let deprecationProcessId = document.location.href;

  logService.on('deprecation', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'DEPRECATION');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '6');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), deprecationMachineName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), deprecationAppDomainName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), deprecationProcessId);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), config.modulePrefix);
    let savedMessageContainsDeprecationMessage = savedLogRecord.get('message').indexOf(deprecationMessage) > -1;
    assert.ok(savedMessageContainsDeprecationMessage);
    let formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
    assert.ok(formattedMessageIsOk);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.deprecate.
  Ember.run(() => {
    Ember.deprecate(deprecationMessage, false, { id: 'ember-flexberry-debug.feature-logger-deprecate-test', until: '0' });
  });
});

test('logService works properly when storeDeprecationMessages disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeDeprecationMessages = false;
  let deprecationMessage = 'The system generated an deprecation';

  logService.on('deprecation', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.notOk(savedLogRecord);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.deprecate.
  Ember.run(() => {
    Ember.deprecate(deprecationMessage, false, { id: 'ember-flexberry-debug.feature-logger-deprecate-test', until: '0' });
  });
});

test('logService for deprecate works properly when it\'s disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
    savedLogRecord = this;
    return Ember.RSVP.resolve(savedLogRecord);
  };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = false;
  logService.storeDeprecationMessages = true;
  let deprecationMessage = 'The system generated an deprecation';

  logService.on('deprecation', this, (savedLogRecord) => {
    // Check results asyncronously.
    if (savedLogRecord) {
      throw new Error('Log is disabled, DB isn\'t changed');
    } else {
      assert.ok(true, 'Check log call, DB isn\'t changed');
    }

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.deprecate.
  Ember.run(() => {
    Ember.deprecate(deprecationMessage, false, { id: 'ember-flexberry-debug.feature-logger-deprecate-test', until: '0' });
  });
});

test('assert works properly', function(assert) {
  let done = assert.async();
  assert.expect(10);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeErrorMessages = true;
  let assertMessage = 'The system generated an error';
  let assertMachineName = location.hostname;
  let assertAppDomainName = window.navigator.userAgent;
  let assertProcessId = document.location.href;

  logService.on('error', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'ERROR');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '1');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), assertMachineName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), assertAppDomainName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), assertProcessId);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), config.modulePrefix);
    let savedMessageContainsAssertMessage = savedLogRecord.get('message').indexOf(assertMessage) > -1;
    assert.ok(savedMessageContainsAssertMessage);
    let formattedMessageContainsAssertMessage = savedLogRecord.get('formattedMessage').indexOf(assertMessage) > -1;
    assert.ok(formattedMessageContainsAssertMessage);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.assert.
  Ember.run(() => {
    Ember.assert(assertMessage, false);
  });
});

test('logService works properly when storeErrorMessages for assert disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeErrorMessages = false;
  let assertMessage = 'The system generated an error';

  logService.on('error', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.notOk(savedLogRecord);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.assert.
  Ember.run(() => {
    Ember.assert(assertMessage, false);
  });
});

test('logService for assert works properly when it\'s disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
    savedLogRecord = this;
    return Ember.RSVP.resolve(savedLogRecord);
  };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = false;
  logService.storeErrorMessages = true;
  let assertMessage = 'The system generated an error';

  logService.on('error', this, (savedLogRecord) => {
    // Check results asyncronously.
    if (savedLogRecord) {
      throw new Error('Log is disabled, DB isn\'t changed');
    } else {
      assert.ok(true, 'Check log call, DB isn\'t changed');
    }

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Call to Ember.assert.
  Ember.run(() => {
    Ember.assert(assertMessage, false);
  });
});

test('throwing exceptions logs properly', function(assert) {
  let done = assert.async();
  assert.expect(10);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeErrorMessages = true;
  let errorMessage = 'The system thrown an exception';
  let errorMachineName = location.hostname;
  let errorAppDomainName = window.navigator.userAgent;
  let errorProcessId = document.location.href;

  logService.on('error', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'ERROR');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '1');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), errorMachineName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), errorAppDomainName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), errorProcessId);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), config.modulePrefix);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), errorMessage);
    let formattedMessageContainsErrorMessage = savedLogRecord.get('formattedMessage').indexOf(errorMessage) > -1;
    assert.ok(formattedMessageContainsErrorMessage);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Throwing an exception.
  Ember.run(() => {
    throw new Error(errorMessage);
  });
});

test('logService works properly when storeErrorMessages for throw disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storeErrorMessages = false;
  let errorMessage = 'The system thrown an exception';

  logService.on('error', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.notOk(savedLogRecord);

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Throwing an exception.
  Ember.run(() => {
    throw new Error(errorMessage);
  });
});

test('logService for throw works properly when it\'s disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
    savedLogRecord = this;
    return Ember.RSVP.resolve(savedLogRecord);
  };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = false;
  logService.storeErrorMessages = true;
  let errorMessage = 'The system thrown an exception';

  logService.on('error', this, (savedLogRecord) => {
    // Check results asyncronously.
    if (savedLogRecord) {
      throw new Error('Log is disabled, DB isn\'t changed');
    } else {
      assert.ok(true, 'Check log call, DB isn\'t changed');
    }

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Throwing an exception.
  Ember.run(() => {
    throw new Error(errorMessage);
  });
});

test('promise errors logs properly', function(assert) {
  let done = assert.async();
  assert.expect(10);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Override default QUnitAdapter.exception method to avoid calling additional assertion when rejecting promise.
  let oldTestAdapterException = Ember.Test.adapter.exception;
  Ember.Test.adapter.exception = () => { };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storePromiseErrors = true;
  logService.showPromiseErrors = false;
  let promiseErrorMessage = 'Promise error';
  let promiseMachineName = location.hostname;
  let promiseAppDomainName = window.navigator.userAgent;
  let promiseProcessId = document.location.href;

  logService.on('promise', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('category')), 'PROMISE');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('eventId')), '0');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('priority')), '7');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('machineName')), promiseMachineName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('appDomainName')), promiseAppDomainName);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processId')), promiseProcessId);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('threadName')), config.modulePrefix);
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), promiseErrorMessage);

    let formattedMessageContainsPromiseErrorMessage = savedLogRecord.get('formattedMessage').indexOf(promiseErrorMessage) > -1;
    assert.ok(formattedMessageContainsPromiseErrorMessage);

    //Restore default QUnitAdapter.exception method
    Ember.Test.adapter.exception = oldTestAdapterException;

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Throwing an exception.
  Ember.run(() => {
    Ember.RSVP.reject(promiseErrorMessage);
  });
});

test('logService works properly when storePromiseErrors disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
     savedLogRecord = this;
     return Ember.RSVP.resolve(savedLogRecord);
   };

  // Override default QUnitAdapter.exception method to avoid calling additional assertion when rejecting promise.
  let oldTestAdapterException = Ember.Test.adapter.exception;
  Ember.Test.adapter.exception = () => { };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.storePromiseErrors = false;
  logService.showPromiseErrors = false;
  let promiseErrorMessage = 'Promise error';

  logService.on('promise', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.notOk(savedLogRecord);

    //Restore default QUnitAdapter.exception method
    Ember.Test.adapter.exception = oldTestAdapterException;

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Throwing an exception.
  Ember.run(() => {
    Ember.RSVP.reject(promiseErrorMessage);
  });
});

test('logService for promise works properly when it\'s disabled', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Stub save method of i-i-s-caseberry-logging-objects-application-log base model.
  let originalSaveMethod = DS.Model.prototype.save;

  let savedLogRecord;
  DS.Model.prototype.save = function() {
    savedLogRecord = this;
    return Ember.RSVP.resolve(savedLogRecord);
  };

  // Get log-service instance & enable errors logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = false;
  logService.storePromiseErrors = true;
  let promiseErrorMessage = 'Promise error';

  logService.on('promise', this, (savedLogRecord) => {
    // Check results asyncronously.
    if (savedLogRecord) {
      throw new Error('Log is disabled, DB isn\'t changed');
    } else {
      assert.ok(true, 'Check log call, DB isn\'t changed');
    }

    // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
    DS.Model.prototype.save = originalSaveMethod;
    done();
  });

  // Throwing an exception.
  Ember.run(() => {
    Ember.RSVP.reject(promiseErrorMessage);
  });
});
