import Ember from 'ember';
import { module, test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';
import ApplicationLogModel from 'ember-flexberry/models/i-i-s-caseberry-logging-objects-application-log';
import UserSettingsService from 'ember-flexberry/services/user-settings';

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

  let done = assert.async();

  let store = app.__container__.lookup('service:store');
  let logService = app.__container__.lookup('service:log');

  // Stub save method.
  let originalSave = ApplicationLogModel.save;

  let savedLogErrorRecord;

  ApplicationLogModel.reopen({
    save() {
      let _this = this;
      savedLogErrorRecord = _this;
      return new Ember.RSVP.Promise((resolve, reject) => {
        resolve();
      });
    }
  });

  logService.enabled = true;
  logService.logErrors = true;

  Ember.run(() => {
    Ember.Logger.error('The system generated an error').then(() => {
      ApplicationLogModel.reopen({
        save() {
          return originalSave();
        }
      });
      assert.strictEqual(savedLogErrorRecord.get('massage'), 'The system generated an error');
    }).finally(done);
  });
});
