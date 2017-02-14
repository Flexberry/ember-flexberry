import Ember from 'ember';
import { test, moduleFor } from 'ember-qunit';
import startApp from '../../helpers/start-app';

let application;

moduleFor('service:device', 'Unit | Service | Device', {
  beforeEach() {
    Ember.run(() => {
      window.navigator.__defineGetter__('userAgent', function () {
          return "Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A456 Safari/602.1"
      });
      window.navigator.__defineGetter__('appName', function () {
          return "Netscape"
      });
      application = startApp();
    });
  },
  setup() {
    Ember.Component.reopen({
      device: Ember.inject.service('device')
    })
  }
});

test('it exists', function(assert) {
  assert.expect(1);
  let service = this.subject(application.__container__.ownerInjection());
  assert.ok(service);
});

test('work method orientation(true)', function(assert) {
  assert.expect(1);
  let service = this.subject(application.__container__.ownerInjection());
  service.set('_cache.orientation', 'testOrientation');
  let result = service.orientation(true);
  assert.strictEqual(result, 'testOrientation');
});

test('work method platform(true)', function(assert) {
  assert.expect(1);
  let service = this.subject(application.__container__.ownerInjection());
  service.set('_cache.platform', 'testPlatform');
  let result = service.platform(true);
  assert.strictEqual(result, 'testPlatform');
});

test('work method type(true)', function(assert) {
  assert.expect(1);
  let service = this.subject(application.__container__.ownerInjection());
  service.set('_cache.type', 'testType');
  let result = service.type(true);
  assert.strictEqual(result, 'testType');
});

test('work method pathPrefixes(true)', function(assert) {
  assert.expect(1);
  let service = this.subject(application.__container__.ownerInjection());
  service.set('_cache.orientation', 'testOrientation');
  service.set('_cache.pathPrefixes.testOrientation', 'testPath');
  let result = service.pathPrefixes(true);
  assert.strictEqual(result, 'testPath');
});

test('work method orientation(false)', function(assert) {
  assert.expect(1);
  window.innerHeight = 2;
  window.innerWidth = 1;
  let service = this.subject(application.__container__.ownerInjection());
  let result = service.orientation(false);
  assert.strictEqual(result, 'portrait');
});

test('work method platform(false)', function(assert) {
  assert.expect(1);

  $.getScript('/assets/bower_components/devicejs/lib/device.js')
    .done(function( script, textStatus ) {
      let service = this.subject(application.__container__.ownerInjection());
      let result = service.platform(false);
    })
    .fail(function( jqxhr, settings, exception ) {
      let service = this.subject(application.__container__.ownerInjection());
      let result = service.platform(false);
  });

  let service = this.subject(application.__container__.ownerInjection());
  let result = service.platform(false);
  
  assert.strictEqual(result, 'ios');
});
