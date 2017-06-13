import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import DeviceInstanceInitializer from 'ember-flexberry/instance-initializers/device';

let application;
let appInstance;
let stubbedNavigatorUserAgent;

let cleanCache = function(deviceService) {
  deviceService.set('_cache.orientation', null);
  deviceService.set('_cache.platform', null);
  deviceService.set('_cache.type', null);
  deviceService.set('_cache.pathPrefixes.landscape', null);
  deviceService.set('_cache.pathPrefixes.portrait', null);
};

let stubDevice = function(desiredDevice) {

  switch (desiredDevice) {
    case 'iphone':
      stubbedNavigatorUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) ' +
        'Version/10.0 Mobile/14A456 Safari/602.1';
      break;
    case 'ipad':
      stubbedNavigatorUserAgent = 'Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) ' +
        'Version/4.0.4 Mobile/7B314 Safari/531.21.10';
      break;
    case 'android':
      stubbedNavigatorUserAgent = 'Mozilla/5.0 (Linux; U; Android 4.1.2; en-us; SCH-I925 Build/JZO54K) AppleWebKit/534.30 (KHTML, like Gecko) ' +
        'Version/4.0 Safari/534.30';
      break;
  }
};

moduleForComponent('Resolver', 'Integration | Resolver', {
  integration: true,
  beforeEach() {
    application = startApp();
    appInstance = application.buildInstance();
  },
  afterEach() {
    destroyApp(appInstance);
    destroyApp(application);
  }
});

test('Resolver, use template for portrait', function(assert) {
  assert.expect(1);

  stubDevice('iphone');

  // Device settings.
  let deviceService = appInstance.lookup('service:device');
  deviceService.changeUserAgent(stubbedNavigatorUserAgent);

  cleanCache(deviceService);
  deviceService.prefixForPlatformAndType = true;
  deviceService.prefixForOrientation = true;
  DeviceInstanceInitializer.initialize(appInstance);
  window.innerHeight = 2;
  window.innerWidth = 1;

  let result = application.__container__.lookup('template:components/resolver-test');
  assert.strictEqual(result.meta.moduleName.toString(), 'dummy/templates/iphone-portrait/components/resolver-test.hbs');
  deviceService.changeUserAgent();
});

test('Resolver, use template for landscape', function(assert) {
  assert.expect(1);

  stubDevice('iphone');

  // Device settings.
  let deviceService = appInstance.lookup('service:device');
  deviceService.changeUserAgent(stubbedNavigatorUserAgent);

  cleanCache(deviceService);
  deviceService.prefixForPlatformAndType = true;
  deviceService.prefixForOrientation = true;
  DeviceInstanceInitializer.initialize(appInstance);
  window.innerHeight = 1;
  window.innerWidth = 2;

  let result = application.__container__.lookup('template:components/resolver-test');
  assert.strictEqual(result.meta.moduleName.toString(), 'dummy/templates/iphone-landscape/components/resolver-test.hbs');
  deviceService.changeUserAgent();
});

test('Resolver, use template for any screen orientation', function(assert) {
  assert.expect(1);

  stubDevice('ipad');

  // Device settings.
  let deviceService = appInstance.lookup('service:device');
  deviceService.changeUserAgent(stubbedNavigatorUserAgent);

  cleanCache(deviceService);
  deviceService.prefixForPlatformAndType = true;
  DeviceInstanceInitializer.initialize(appInstance);

  let result = application.__container__.lookup('template:components/resolver-test');
  assert.strictEqual(result.meta.moduleName.toString(), 'dummy/templates/ipad/components/resolver-test.hbs');
  deviceService.changeUserAgent();
});

test('Resolver, use template from mobile folder', function(assert) {
  assert.expect(1);

  stubDevice('android');

  // Device settings.
  let deviceService = appInstance.lookup('service:device');
  deviceService.changeUserAgent(stubbedNavigatorUserAgent);

  cleanCache(deviceService);
  deviceService.prefixForPlatformAndType = true;
  DeviceInstanceInitializer.initialize(appInstance);

  let result = application.__container__.lookup('template:components/resolver-test');
  assert.strictEqual(result.meta.moduleName.toString(), 'dummy/templates/mobile/components/resolver-test.hbs');
  deviceService.changeUserAgent();
});

test('Using resolver settings deviceRelatedTypes', function(assert) {
  assert.expect(2);

  stubDevice('android');

  // Device settings.
  let deviceService = appInstance.lookup('service:device');
  deviceService.changeUserAgent(stubbedNavigatorUserAgent);
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

  deviceService.changeUserAgent();
});

test('Using resolver settings resolveWithoutDeviceTypeDetection', function(assert) {
  assert.expect(2);

  stubDevice('android');

  // Device settings.
  let deviceService = appInstance.lookup('service:device');
  deviceService.changeUserAgent(stubbedNavigatorUserAgent);

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
  deviceService.changeUserAgent();
});
