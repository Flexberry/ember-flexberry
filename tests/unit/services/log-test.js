import Ember from 'ember'; //TODO Import Module. Replace Ember.Logger, Ember.testing = false;
import DS from 'ember-data';
import { module, test } from 'qunit';
import { resolve, reject } from 'rsvp';
import { run } from '@ember/runloop';
import { warn, debug, assert } from '@ember/debug';
import { deprecate } from '@ember/application/deprecations';
import startApp from 'dummy/tests/helpers/start-app';
import destroyApp from 'dummy/tests/helpers/destroy-app';
import config from '../../../config/environment';

import $ from 'jquery';

let app;
let adapter;
let saveModel;

module('Unit | Service | log', function(hooks) {
  hooks.beforeEach(() => {
    app = startApp();

    adapter = Ember.Test.adapter;
    Ember.Test.adapter = null;
    Ember.testing = false;

    saveModel = DS.Model.prototype.save;
    DS.Model.prototype.save = function() {
      return resolve(this);
    };
  });

  hooks.afterEach(() => {
    Ember.Test.adapter = adapter;
    Ember.testing = true;

    DS.Model.prototype.save = saveModel;

    destroyApp(app);
  });

  test('error works properly', function(assert) {
    let done = assert.async();
    assert.expect(10);

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
      assert.strictEqual($.trim(savedLogRecord.get('category')), 'ERROR');
      assert.strictEqual($.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual($.trim(savedLogRecord.get('priority')), '1');
      assert.strictEqual($.trim(savedLogRecord.get('machineName')), errorMachineName);
      assert.strictEqual($.trim(savedLogRecord.get('appDomainName')), errorAppDomainName);
      assert.strictEqual($.trim(savedLogRecord.get('processId')), errorProcessId);
      assert.strictEqual($.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual($.trim(savedLogRecord.get('threadName')), config.modulePrefix);
      assert.strictEqual($.trim(savedLogRecord.get('message')), errorMessage);
      let formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      done();
    });

    // Call to Ember.Logger.error.
    run(() => {
      Ember.Logger.error(errorMessage);
    });
  });

  test('logService works properly when storeErrorMessages disabled', function(assert) {
    let done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    let logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeErrorMessages = false;
    let errorMessage = 'The system generated an error';

    logService.on('error', this, (savedLogRecord) => {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      done();
    });

    // Call to Ember.Logger.error.
    run(() => {
      Ember.Logger.error(errorMessage);
    });
  });

  test('logService for error works properly when it\'s disabled', function(assert) {
    let done = assert.async();
    assert.expect(1);

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

      done();
    });

    // Call to Ember.Logger.error.
    run(() => {
      Ember.Logger.error(errorMessage);
    });
  });

  test('warn works properly', function(assert) {
    let done = assert.async();
    assert.expect(10);

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
      assert.strictEqual($.trim(savedLogRecord.get('category')), 'WARN');
      assert.strictEqual($.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual($.trim(savedLogRecord.get('priority')), '2');
      assert.strictEqual($.trim(savedLogRecord.get('machineName')), warnMachineName);
      assert.strictEqual($.trim(savedLogRecord.get('appDomainName')), warnAppDomainName);
      assert.strictEqual($.trim(savedLogRecord.get('processId')), warnProcessId);
      assert.strictEqual($.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual($.trim(savedLogRecord.get('threadName')), config.modulePrefix);
      let savedMessageContainsWarnMessage = savedLogRecord.get('message').indexOf(warnMessage) > -1;
      assert.ok(savedMessageContainsWarnMessage);
      let formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      done();
    });

    // Call to warn.
    run(() => {
      warn(warnMessage, false, { id: 'ember-flexberry-tests.log-test.warn-works-properly' });
    });
  });

  test('logService works properly when storeWarnMessages disabled', function(assert) {
    let done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    let logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeWarnMessages = false;
    let warnMessage = 'The system generated an warn';

    logService.on('warn', this, (savedLogRecord) => {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      done();
    });

    // Call to warn.
    run(() => {
      warn(warnMessage, false, { id: 'ember-flexberry-tests.log-test.warn-works-properly-when-store-warn-messages-is-disabled' });
    });
  });

  test('logService for warn works properly when it\'s disabled', function(assert) {
    let done = assert.async();
    assert.expect(1);

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

      done();
    });

    // Call to warn.
    run(() => {
      warn(warnMessage, false, { id: 'ember-flexberry-tests.log-test.warn-works-properly-when-log-service-is-disabled' });
    });
  });

  test('log works properly', function(assert) {
    let done = assert.async();
    assert.expect(10);

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
      assert.strictEqual($.trim(savedLogRecord.get('category')), 'LOG');
      assert.strictEqual($.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual($.trim(savedLogRecord.get('priority')), '3');
      assert.strictEqual($.trim(savedLogRecord.get('machineName')), logMachineName);
      assert.strictEqual($.trim(savedLogRecord.get('appDomainName')), logAppDomainName);
      assert.strictEqual($.trim(savedLogRecord.get('processId')), logProcessId);
      assert.strictEqual($.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual($.trim(savedLogRecord.get('threadName')), config.modulePrefix);
      assert.strictEqual($.trim(savedLogRecord.get('message')), logMessage);
      let formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      done();
    });

    // Call to Ember.Logger.log.
    run(() => {
      Ember.Logger.log(logMessage);
    });
  });

  test('logService works properly when storeLogMessages disabled', function(assert) {
    let done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    let logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeLogMessages = false;
    let logMessage = 'Logging log message';

    logService.on('log', this, (savedLogRecord) => {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      done();
    });

    // Call to Ember.Logger.log.
    run(() => {
      Ember.Logger.log(logMessage);
    });
  });

  test('logService for log works properly when it\'s disabled', function(assert) {
    let done = assert.async();
    assert.expect(1);

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

      done();
    });

    // Call to Ember.Logger.log.
    run(() => {
      Ember.Logger.log(logMessage);
    });
  });

  test('info works properly', function(assert) {
    let done = assert.async();
    assert.expect(10);

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
      assert.strictEqual($.trim(savedLogRecord.get('category')), 'INFO');
      assert.strictEqual($.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual($.trim(savedLogRecord.get('priority')), '4');
      assert.strictEqual($.trim(savedLogRecord.get('machineName')), infoMachineName);
      assert.strictEqual($.trim(savedLogRecord.get('appDomainName')), infoAppDomainName);
      assert.strictEqual($.trim(savedLogRecord.get('processId')), infoProcessId);
      assert.strictEqual($.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual($.trim(savedLogRecord.get('threadName')), config.modulePrefix);
      assert.strictEqual($.trim(savedLogRecord.get('message')), infoMessage);
      let formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      done();
    });

    // Call to Ember.Logger.info.
    run(() => {
      Ember.Logger.info(infoMessage);
    });
  });

  test('logService works properly when storeInfoMessages disabled', function(assert) {
    let done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    let logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeInfoMessages = false;
    let infoMessage = 'Logging info message';

    logService.on('info', this, (savedLogRecord) => {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      done();
    });

    // Call to Ember.Logger.info.
    run(() => {
      Ember.Logger.info(infoMessage);

    });
  });

  test('logService for info works properly when it\'s disabled', function(assert) {
    let done = assert.async();
    assert.expect(1);

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

      done();
    });

    // Call to Ember.Logger.info.
    run(() => {
      Ember.Logger.info(infoMessage);
    });
  });

  test('debug works properly', function(assert) {
    let done = assert.async();
    assert.expect(10);

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
      assert.strictEqual($.trim(savedLogRecord.get('category')), 'DEBUG');
      assert.strictEqual($.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual($.trim(savedLogRecord.get('priority')), '5');
      assert.strictEqual($.trim(savedLogRecord.get('machineName')), debugMachineName);
      assert.strictEqual($.trim(savedLogRecord.get('appDomainName')), debugAppDomainName);
      assert.strictEqual($.trim(savedLogRecord.get('processId')), debugProcessId);
      assert.strictEqual($.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual($.trim(savedLogRecord.get('threadName')), config.modulePrefix);
      let savedMessageContainsDebugMessage = savedLogRecord.get('message').indexOf(debugMessage) > -1;
      assert.ok(savedMessageContainsDebugMessage);
      let formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      done();
    });

    // Call to debug.
    run(() => {
      debug(debugMessage);
    });
  });

  test('logService works properly when storeDebugMessages disabled', function(assert) {
    let done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    let logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeDebugMessages = false;
    let debugMessage = 'Logging debug message';

    logService.on('debug', this, (savedLogRecord) => {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      done();
    });

    // Call to debug.
    run(() => {
      debug(debugMessage);
    });
  });

  test('logService for debug works properly when it\'s disabled', function(assert) {
    let done = assert.async();
    assert.expect(1);

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

      done();
    });

    // Call to debug.
    run(() => {
      debug(debugMessage);
    });
  });

  test('deprecate works properly', function(assert) {
    let done = assert.async();
    assert.expect(10);

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
      assert.strictEqual($.trim(savedLogRecord.get('category')), 'DEPRECATION');
      assert.strictEqual($.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual($.trim(savedLogRecord.get('priority')), '6');
      assert.strictEqual($.trim(savedLogRecord.get('machineName')), deprecationMachineName);
      assert.strictEqual($.trim(savedLogRecord.get('appDomainName')), deprecationAppDomainName);
      assert.strictEqual($.trim(savedLogRecord.get('processId')), deprecationProcessId);
      assert.strictEqual($.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual($.trim(savedLogRecord.get('threadName')), config.modulePrefix);
      let savedMessageContainsDeprecationMessage = savedLogRecord.get('message').indexOf(deprecationMessage) > -1;
      assert.ok(savedMessageContainsDeprecationMessage);
      let formattedMessageIsOk = savedLogRecord.get('formattedMessage') === '';
      assert.ok(formattedMessageIsOk);

      done();
    });

    // Call to deprecate.
    run(() => {
      deprecate(deprecationMessage, false, { id: 'ember-flexberry-debug.feature-logger-deprecate-test', until: '0' });
    });
  });

  test('logService works properly when storeDeprecationMessages disabled', function(assert) {
    let done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    let logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeDeprecationMessages = false;
    let deprecationMessage = 'The system generated an deprecation';

    logService.on('deprecation', this, (savedLogRecord) => {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      done();
    });

    // Call to deprecate.
    run(() => {
      deprecate(deprecationMessage, false, { id: 'ember-flexberry-debug.feature-logger-deprecate-test', until: '0' });
    });
  });

  test('logService for deprecate works properly when it\'s disabled', function(assert) {
    let done = assert.async();
    assert.expect(1);

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

      done();
    });

    // Call to deprecate.
    run(() => {
      deprecate(deprecationMessage, false, { id: 'ember-flexberry-debug.feature-logger-deprecate-test', until: '0' });
    });
  });

  test('assert works properly', function(testAssert) {
    let done = testAssert.async();
    testAssert.expect(10);

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
      testAssert.strictEqual($.trim(savedLogRecord.get('category')), 'ERROR');
      testAssert.strictEqual($.trim(savedLogRecord.get('eventId')), '0');
      testAssert.strictEqual($.trim(savedLogRecord.get('priority')), '1');
      testAssert.strictEqual($.trim(savedLogRecord.get('machineName')), assertMachineName);
      testAssert.strictEqual($.trim(savedLogRecord.get('appDomainName')), assertAppDomainName);
      testAssert.strictEqual($.trim(savedLogRecord.get('processId')), assertProcessId);
      testAssert.strictEqual($.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      testAssert.strictEqual($.trim(savedLogRecord.get('threadName')), config.modulePrefix);
      let savedMessageContainsAssertMessage = savedLogRecord.get('message').indexOf(assertMessage) > -1;
      testAssert.ok(savedMessageContainsAssertMessage);
      let formattedMessageContainsAssertMessage = savedLogRecord.get('formattedMessage').indexOf(assertMessage) > -1;
      testAssert.ok(formattedMessageContainsAssertMessage);

      done();
    });

    // Call to assert.
    run(() => {
      assert(assertMessage, false);
    });
  });

  test('logService works properly when storeErrorMessages for assert disabled', function(testAssert) {
    let done = testAssert.async();
    testAssert.expect(1);

    // Get log-service instance & enable errors logging.
    let logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeErrorMessages = false;
    let assertMessage = 'The system generated an error';

    logService.on('error', this, (savedLogRecord) => {
      // Check results asyncronously.
      testAssert.notOk(savedLogRecord);

      done();
    });

    // Call to assert.
    run(() => {
      assert(assertMessage, false);
    });
  });

  test('logService for assert works properly when it\'s disabled', function(testAssert) {
    let done = testAssert.async();
    testAssert.expect(1);

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
        testAssert.ok(true, 'Check log call, DB isn\'t changed');
      }

      done();
    });

    // Call to assert.
    run(() => {
      assert(assertMessage, false);
    });
  });

  test('throwing exceptions logs properly', function(assert) {
    let done = assert.async();
    assert.expect(10);

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
      assert.strictEqual($.trim(savedLogRecord.get('category')), 'ERROR');
      assert.strictEqual($.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual($.trim(savedLogRecord.get('priority')), '1');
      assert.strictEqual($.trim(savedLogRecord.get('machineName')), errorMachineName);
      assert.strictEqual($.trim(savedLogRecord.get('appDomainName')), errorAppDomainName);
      assert.strictEqual($.trim(savedLogRecord.get('processId')), errorProcessId);
      assert.strictEqual($.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual($.trim(savedLogRecord.get('threadName')), config.modulePrefix);
      assert.strictEqual($.trim(savedLogRecord.get('message')), errorMessage);
      let formattedMessageContainsErrorMessage = savedLogRecord.get('formattedMessage').indexOf(errorMessage) > -1;
      assert.ok(formattedMessageContainsErrorMessage);

      done();
    });

    // Throwing an exception.
    run(() => {
      throw new Error(errorMessage);
    });
  });

  test('logService works properly when storeErrorMessages for throw disabled', function(assert) {
    let done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    let logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storeErrorMessages = false;
    let errorMessage = 'The system thrown an exception';

    logService.on('error', this, (savedLogRecord) => {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      done();
    });

    // Throwing an exception.
    run(() => {
      throw new Error(errorMessage);
    });
  });

  test('logService for throw works properly when it\'s disabled', function(assert) {
    let done = assert.async();
    assert.expect(1);

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

      done();
    });

    // Throwing an exception.
    run(() => {
      throw new Error(errorMessage);
    });
  });

  test('promise errors logs properly', function(assert) {
    let done = assert.async();
    assert.expect(10);

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
      assert.strictEqual($.trim(savedLogRecord.get('category')), 'PROMISE');
      assert.strictEqual($.trim(savedLogRecord.get('eventId')), '0');
      assert.strictEqual($.trim(savedLogRecord.get('priority')), '7');
      assert.strictEqual($.trim(savedLogRecord.get('machineName')), promiseMachineName);
      assert.strictEqual($.trim(savedLogRecord.get('appDomainName')), promiseAppDomainName);
      assert.strictEqual($.trim(savedLogRecord.get('processId')), promiseProcessId);
      assert.strictEqual($.trim(savedLogRecord.get('processName')), 'EMBER-FLEXBERRY');
      assert.strictEqual($.trim(savedLogRecord.get('threadName')), config.modulePrefix);
      assert.strictEqual($.trim(savedLogRecord.get('message')), promiseErrorMessage);

      let formattedMessageContainsPromiseErrorMessage = savedLogRecord.get('formattedMessage').indexOf(promiseErrorMessage) > -1;
      assert.ok(formattedMessageContainsPromiseErrorMessage);

      done();
    });

    // Throwing an exception.
    run(() => {
      reject(promiseErrorMessage);
    });
  });

  test('logService works properly when storePromiseErrors disabled', function(assert) {
    let done = assert.async();
    assert.expect(1);

    // Get log-service instance & enable errors logging.
    let logService = app.__container__.lookup('service:log');
    logService.enabled = true;
    logService.storePromiseErrors = false;
    logService.showPromiseErrors = false;
    let promiseErrorMessage = 'Promise error';

    logService.on('promise', this, (savedLogRecord) => {
      // Check results asyncronously.
      assert.notOk(savedLogRecord);

      done();
    });

    // Throwing an exception.
    run(() => {
      reject(promiseErrorMessage);
    });
  });

  test('logService for promise works properly when it\'s disabled', function(assert) {
    let done = assert.async();
    assert.expect(1);

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

      done();
    });

    // Throwing an exception.
    run(() => {
      reject(promiseErrorMessage);
    });
  });
});
