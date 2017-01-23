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

test('warn works properly', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Get log-service instance & enable warn logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.logWarns = true;

  let warnMessage = 'The system generated warn';

  logService.on('warn', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), warnMessage);
    done();
  });

  // Call to Ember.Logger.warn.
  Ember.run(() => {
    Ember.Logger.warn(warnMessage);
  });
});

test('info works properly', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Get log-service instance & enable info logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.logInfos = true;

  let infoMessage = 'The system generated info';

  logService.on('info', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), infoMessage);
    done();
  });

  //Call to Ember.Logger.info.
  Ember.run(() => {
    Ember.Logger.info(infoMessage);
  });
});

test('debug works properly', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Get log-service instance & enable debug logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.logDebugs = true;

  let debugMessage = 'The system generated record about debug';

  logService.on('debug', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), 'DEBUG: ' + debugMessage);
    done();
  });

  //Call to Ember.debug.
  Ember.run(() => {
    Ember.debug(debugMessage);
  });
});

test('log works properly', function(assert) {
  let done = assert.async();
  assert.expect(1);

  // Get log-service instance & enable log logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.logLogs = true;

  let logMessage = 'The system generated log\'s record';

  logService.on('log', this, (savedLogRecord) => {
    // Check results asyncronously.
    assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), logMessage);
    done();
  });

  //Call to Ember.Logger.log.
  Ember.run(() => {
    Ember.Logger.log(logMessage);
  });
});
