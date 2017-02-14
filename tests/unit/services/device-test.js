import { test, moduleFor } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';

let application;

moduleFor('service:device', 'Unit | Service | Device', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    destroyApp(application);
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
