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
  //let done = assert.async();
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
    let done = assert.async();
    let errorMessage = 'The system generated an error';
    Ember.Logger.error(errorMessage);

    setTimeout(() => {
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), errorMessage);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    }, 500);
  });
});

test('warn works properly', function(assert) {
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

  // Get log-service instance & enable warn logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.logWarns = true;

  // Call to Ember.Logger.error & check results.
  Ember.run(() => {
    let done = assert.async();
    let warnMessage = 'The system generated warn';
    Ember.Logger.warn(warnMessage);

    setTimeout(() => {
      // Check results asyncronously.
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), warnMessage);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    }, 500);
  });
});

test('info works properly', function(assert) {
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

  // Get log-service instance & enable info logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.logInfos = true;

  //Call to Ember.Logger.info.
  Ember.run(() => {
    let done = assert.async();
    let infoMessage = 'The system generated info';
    Ember.Logger.info(infoMessage);

    setTimeout(() => {
      // Check results asyncronously.
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), infoMessage);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    }, 500);
  });
});

test('debug works properly', function(assert) {
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

  // Get log-service instance & enable debug logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.logDebugs = true;

  //Call to Ember.debug.
  Ember.run(() => {
    let done = assert.async();
    let debugMessage = 'The system generated record about debug';
    Ember.debug(debugMessage);

    setTimeout(() => {
      // Check results asyncronously.
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), 'DEBUG: ' + debugMessage);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    }, 500);
  });
});

test('log works properly', function(assert) {
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

  // Get log-service instance & enable log logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.logLogs = true;

  //Call to Ember.Logger.log.
  Ember.run(() => {
    let done = assert.async();
    let logMessage = 'The system generated log\'s record';
    Ember.Logger.log(logMessage);

    setTimeout(() => {
      // Check results asyncronously.
      // Вот тут ругается на гет. Прохождение теста отличается от исправных по одним и тем же
      // брейкпойнтам. Почему у него такие завихи - тоже найти не смогла :(.
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), logMessage);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    }, 500);
  });
});

test('deprecate works properly', function(assert) {
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

  // Get log-service instance & enable log logging.
  let logService = app.__container__.lookup('service:log');
  logService.enabled = true;
  logService.logDeprecations = true;

  //Call to Ember.Logger.log.
  Ember.run(() => {
    let done = assert.async();
    let deprecateMessage = 'The system generated deprecation';
    Ember.deprecate(deprecateMessage);

    setTimeout(() => {
      // Check results asyncronously.
      // Вот тут плюсом к соолбщению лезет стектрейс. Как его убрать/обработать не нашла.
      // Втирают принципы общие тестирования, а я хочу не это. Вот скрин: https://yadi.sk/i/7UAHmQkj3AmTZn.
      assert.strictEqual(Ember.$.trim(savedLogRecord.get('message')), 'DEPRECATION: ' + deprecateMessage);

      // Restore save method of i-i-s-caseberry-logging-objects-application-log base model.
      DS.Model.prototype.save = originalSaveMethod;
      done();
    }, 500);
  });
});
