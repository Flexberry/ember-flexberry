import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import DeviceInstanceInitializer from 'ember-flexberry/instance-initializers/device';

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
      stubbedNavigatoAppName = 'Netscape1';
      break;
    case 'ipad':
      stubbedNavigatorUserAgent = 'Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) ' +
        'Version/4.0.4 Mobile/7B314 Safari/531.21.10';
      stubbedNavigatoAppName = 'Netscape2';
      break;
    case 'android':
      stubbedNavigatorUserAgent = 'Mozilla/5.0 (Linux; U; Android 4.1.2; en-us; SCH-I925 Build/JZO54K) AppleWebKit/534.30 (KHTML, like Gecko) ' +
        'Version/4.0 Safari/534.30';
      stubbedNavigatoAppName = 'Netscape3';
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

moduleForComponent('Resolver', 'Integration | Resolver', {
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

test('Resolver, use template for portrait', function(assert) {
  assert.expect(1);

  stubDevice('iphone');

  let $testPage = this.$();
  var $scriptContainer = $('<div>').attr('id', 'deviceJsScriptContainer');
  $testPage.append($scriptContainer);

  // Force devicejs to run it's initialization again & read stubbed device-related properties.
  let $devicejsScript = $('<script>').attr('type', 'text/javascript').attr('src', '/assets/devicejs.script');
  $scriptContainer.append($devicejsScript);

  // Device settings.
  let deviceService = appInstance.lookup('service:device');
  cleanCache(deviceService);
  deviceService.prefixForPlatformAndType = true;
  deviceService.prefixForOrientation = true;
  DeviceInstanceInitializer.initialize(appInstance);
  window.innerHeight = 2;
  window.innerWidth = 1;

  let result = application.__container__.lookup('template:components/resolver-test');
  assert.strictEqual(result.meta.moduleName.toString(), 'dummy/templates/iphone-portrait/components/resolver-test.hbs');

  $scriptContainer.remove();
});

test('Resolver, use template for landscape', function(assert) {
  assert.expect(1);

  stubDevice('iphone');

  let $testPage = this.$();
  let $scriptContainer = $('<div>').attr('id', 'deviceJsScriptContainer');
  $testPage.append($scriptContainer);

  // Force devicejs to run it's initialization again & read stubbed device-related properties.
  let $devicejsScript = $('<script>').attr('type', 'text/javascript').attr('src', '/assets/devicejs.script');
  $scriptContainer.append($devicejsScript);

  // Device settings.
  let deviceService = appInstance.lookup('service:device');
  cleanCache(deviceService);
  deviceService.prefixForPlatformAndType = true;
  deviceService.prefixForOrientation = true;
  DeviceInstanceInitializer.initialize(appInstance);
  window.innerHeight = 1;
  window.innerWidth = 2;

  let result = application.__container__.lookup('template:components/resolver-test');
  assert.strictEqual(result.meta.moduleName.toString(), 'dummy/templates/iphone-landscape/components/resolver-test.hbs');

  $scriptContainer.remove();
});

test('Resolver, use template for any screen orientation', function(assert) {
  assert.expect(1);

  stubDevice('ipad');

  let $testPage = this.$();
  let $scriptContainer = $('<div>').attr('id', 'deviceJsScriptContainer');
  $testPage.append($scriptContainer);

  // Force devicejs to run it's initialization again & read stubbed device-related properties.
  let $devicejsScript = $('<script>').attr('type', 'text/javascript').attr('src', '/assets/devicejs.script');
  $scriptContainer.append($devicejsScript);

  // Device settings.
  let deviceService = appInstance.lookup('service:device');
  cleanCache(deviceService);
  deviceService.prefixForPlatformAndType = true;
  DeviceInstanceInitializer.initialize(appInstance);

  let result = application.__container__.lookup('template:components/resolver-test');
  assert.strictEqual(result.meta.moduleName.toString(), 'dummy/templates/ipad/components/resolver-test.hbs');

  $scriptContainer.remove();
});

test('Resolver, use template from mobile folder', function(assert) {
  assert.expect(1);

  stubDevice('android');

  let $testPage = this.$();
  let $scriptContainer = $('<div>').attr('id', 'deviceJsScriptContainer');
  $testPage.append($scriptContainer);

  // Force devicejs to run it's initialization again & read stubbed device-related properties.
  let $devicejsScript = $('<script>').attr('type', 'text/javascript').attr('src', '/assets/devicejs.script');
  $scriptContainer.append($devicejsScript);

  // Device settings.
  let deviceService = appInstance.lookup('service:device');
  cleanCache(deviceService);
  deviceService.prefixForPlatformAndType = true;
  DeviceInstanceInitializer.initialize(appInstance);

  let result = application.__container__.lookup('template:components/resolver-test');
  assert.strictEqual(result.meta.moduleName.toString(), 'dummy/templates/mobile/components/resolver-test.hbs');

  $scriptContainer.remove();
});

test('Using resolver settings deviceRelatedTypes', function(assert) {
  assert.expect(2);

  stubDevice('android');

  let $testPage = this.$();
  let $scriptContainer = $('<div>').attr('id', 'deviceJsScriptContainer');
  $testPage.append($scriptContainer);

  // Force devicejs to run it's initialization again & read stubbed device-related properties.
  let $devicejsScript = $('<script>').attr('type', 'text/javascript').attr('src', '/assets/devicejs.script');
  $scriptContainer.append($devicejsScript);

  // Device settings.
  let deviceService = appInstance.lookup('service:device');
  cleanCache(deviceService);
  DeviceInstanceInitializer.initialize(appInstance);

  let applicationResolver = appInstance.application.__registry__.resolver;
  var resultWithTemplate = applicationResolver.resolve('template:components/resolver-test');
  assert.strictEqual(resultWithTemplate.meta.moduleName.toString(), 'dummy/templates/mobile/components/resolver-test.hbs');

  // Install deviceRelatedTypes settings.
  let deviceRelatedTypes = applicationResolver.get('deviceRelatedTypes');
  for (let i = 0; i < deviceRelatedTypes.length; i++) {
    if (deviceRelatedTypes[i] === 'template') {
      deviceRelatedTypes[i] = undefined;
    }
  }

  cleanCache(deviceService);
  var resultWithoutTemplate = applicationResolver.resolve('template:components/resolver-test');
  assert.strictEqual(resultWithoutTemplate.meta.moduleName.toString(), 'dummy/templates/components/resolver-test.hbs');

  // Return default deviceRelatedTypes settings.
  for (let i = 0; i < deviceRelatedTypes.length; i++) {
    if (deviceRelatedTypes[i] === undefined) {
      deviceRelatedTypes[i] = 'template';
    }
  }

  $scriptContainer.remove();
});

test('Using resolver settings resolveWithoutDeviceTypeDetection', function(assert) {
  assert.expect(2);

  stubDevice('android');

  let $testPage = this.$();
  let $scriptContainer = $('<div>').attr('id', 'deviceJsScriptContainer');
  $testPage.append($scriptContainer);

  // Force devicejs to run it's initialization again & read stubbed device-related properties.
  let $devicejsScript = $('<script>').attr('type', 'text/javascript').attr('src', '/assets/devicejs.script');
  $scriptContainer.append($devicejsScript);

  // Device settings.
  let deviceService = appInstance.lookup('service:device');
  cleanCache(deviceService);
  DeviceInstanceInitializer.initialize(appInstance);

  let applicationResolver = appInstance.application.__registry__.resolver;
  var resultWithTemplate = applicationResolver.resolve('template:components/resolver-test');
  assert.strictEqual(resultWithTemplate.meta.moduleName.toString(), 'dummy/templates/mobile/components/resolver-test.hbs');

  // Install resolveWithoutDeviceTypeDetection settings.
  let resolveWithoutDeviceTypeDetection = ['template:components/resolver-test'];
  applicationResolver.namespace.set('resolveWithoutDeviceTypeDetection', resolveWithoutDeviceTypeDetection);

  cleanCache(deviceService);
  var resultWithoutTemplate = applicationResolver.resolve('template:components/resolver-test');
  assert.strictEqual(resultWithoutTemplate.meta.moduleName.toString(), 'dummy/templates/components/resolver-test.hbs');

  // Return default resolveWithoutDeviceTypeDetection settings.
  applicationResolver.namespace.set('resolveWithoutDeviceTypeDetection', undefined);

  $scriptContainer.remove();
});
