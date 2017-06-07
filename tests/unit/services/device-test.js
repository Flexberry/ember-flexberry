import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';

let application;
let appInstance;
let originalNavigatorUserAgent;
let originalNavigatorAppName;

let cleanCache = function(deviceService) {
  deviceService.set('_cache.orientation', null);
  deviceService.set('_cache.platform', null);
  deviceService.set('_cache.type', null);
  deviceService.set('_cache.pathPrefixes.landscape', null);
  deviceService.set('_cache.pathPrefixes.portrait', null);
};

let stubDevice = function(desiredDevice) {
  var stubbedNavigatorUserAgent;
  var stubbedNavigatoAppName;

  switch (desiredDevice) {
    case 'iphone':
      stubbedNavigatorUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) ' +
        'Version/10.0 Mobile/14A456 Safari/602.1';
      stubbedNavigatoAppName = 'Netscape';
      break;
  }

  if (stubbedNavigatorUserAgent) {
    window.navigator.__defineGetter__('userAgent', function () {
      return stubbedNavigatorUserAgent;
    });
  }

  if (stubbedNavigatoAppName) {
    window.navigator.__defineGetter__('appName', function () {
      return stubbedNavigatoAppName;
    });
  }
};

let storeOriginalDevice = function() {
  if (!originalNavigatorUserAgent) {
    originalNavigatorUserAgent = window.navigator.userAgent;
  }

  if (!originalNavigatorAppName) {
    originalNavigatorAppName =  window.navigator.appName;
  }
};

let resotreOriginalDevice = function() {
  window.navigator.__defineGetter__('userAgent', function () {
    return originalNavigatorUserAgent;
  });
  window.navigator.__defineGetter__('appName', function () {
    return originalNavigatorUserAgent;
  });
};

moduleForComponent('service:device', 'Unit | Service | Device', {
  integration: true,
  beforeEach() {
    storeOriginalDevice();
    application = startApp();
    appInstance = application.buildInstance();
  },
  afterEach() {
    resotreOriginalDevice();
    destroyApp(appInstance);
    destroyApp(application);
  }
});

test('work method orientation(true)', function(assert) {
  assert.expect(1);
  let service = appInstance.lookup('service:device');
  service.set('_cache.orientation', 'testPlatform');
  let result = service.orientation(true);
  cleanCache(service);
  assert.strictEqual(result, 'testPlatform');
});

test('work method platform(true)', function(assert) {
  assert.expect(1);
  let service = appInstance.lookup('service:device');
  service.set('_cache.platform', 'testPlatform');
  let result = service.platform(true);
  cleanCache(service);
  assert.strictEqual(result, 'testPlatform');
});

test('work method type(true)', function(assert) {
  assert.expect(1);
  let service = appInstance.lookup('service:device');
  service.set('_cache.type', 'testType');
  let result = service.type(true);
  cleanCache(service);
  assert.strictEqual(result, 'testType');
});

test('work method pathPrefixes(true)', function(assert) {
  assert.expect(1);
  let service = appInstance.lookup('service:device');
  service.set('_cache.orientation', 'testOrientation');
  service.set('_cache.pathPrefixes.testOrientation', 'testPath');
  let result = service.pathPrefixes(true);
  cleanCache(service);
  assert.strictEqual(result, 'testPath');
});

test('work method orientation(false)', function(assert) {
  assert.expect(1);
  window.innerHeight = 2;
  window.innerWidth = 1;
  let service = appInstance.lookup('service:device');
  let result = service.orientation(false);
  assert.strictEqual(result, 'portrait');
});

test('work method platform(false)', function(assert) {
  assert.expect(1);

  stubDevice('iphone');

  let $testPage = this.$();
  let $scriptContainer = $('<div>').attr('id', 'deviceJsScriptContainer');
  $testPage.append($scriptContainer);

  // Force devicejs to run it's initialization again & read stubbed device-related properties.
  let $devicejsScript = $('<script>').attr('type', 'text/javascript').attr('src', '/assets/devicejs.script');
  $scriptContainer.append($devicejsScript);

  let service = application.__container__.lookup('service:device');
  let platform = service.platform(false);
  assert.strictEqual(platform, 'ios');

  $scriptContainer.remove();
});

test('work method type(false)', function(assert) {
  assert.expect(1);

  stubDevice('iphone');

  let $testPage = this.$();
  let $scriptContainer = $('<div>').attr('id', 'deviceJsScriptContainer');
  $testPage.append($scriptContainer);

  // Force devicejs to run it's initialization again & read stubbed device-related properties.
  let $devicejsScript = $('<script>').attr('type', 'text/javascript').attr('src', '/assets/devicejs.script');
  $scriptContainer.append($devicejsScript);

  let service = application.__container__.lookup('service:device');
  let result = service.type(false);
  assert.strictEqual(result, 'phone');
});

test('work method pathPrefixes(false)', function(assert) {
  assert.expect(1);

  stubDevice('iphone');

  let $testPage = this.$();
  let $scriptContainer = $('<div>').attr('id', 'deviceJsScriptContainer');
  $testPage.append($scriptContainer);

  // Force devicejs to run it's initialization again & read stubbed device-related properties.
  let $devicejsScript = $('<script>').attr('type', 'text/javascript').attr('src', '/assets/devicejs.script');
  $scriptContainer.append($devicejsScript);

  let service = application.__container__.lookup('service:device');
  let result = service.pathPrefixes(false);
  assert.strictEqual(Ember.$.trim(result), 'mobile');
});
