import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import DeviceInstanceInitializer from 'ember-flexberry/instance-initializers/device';
import hbs from 'htmlbars-inline-precompile';

let application;
let appInstance;
let originalNavigatorUserAgent;
let originalNavigatorAppName;
var withPlatformPath;

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

moduleForComponent('Resolver', 'Integration | Resolver', {
  integration: true,
  beforeEach() {
    storeOriginalDevice();

    application = startApp();
    appInstance = application.buildInstance();
  },
  afterEach() {
    resotreOriginalDevice();

    destroyApp(application);
  }
});

let registerMochModule = function() {
  withPlatformPath = Object({
      subObj1: 'template:mobile/my-form'
    });
  var noPlatformImPath = Object({
      subObj1: 'template:my-form'
    });

    application.register('template:mobile/my-form', hbs`template:mobile/my-form`);
    application.register('template:my-form', hbs`template:my-form`);
    application.__registry__.resolver._moduleRegistry._entries['dummy/templates/mobile/my-form'] = withPlatformPath;
    application.__registry__.resolver._moduleRegistry._entries['dummy/templates/my-form'] = noPlatformImPath;
}

test('work resolver', function(assert) {
  assert.expect(1);

  stubDevice('iphone');

  let $testPage = this.$();
  let $scriptContainer = $('<div>').attr('id', 'deviceJsScriptContainer');
  $testPage.append($scriptContainer);

  // Force devicejs to run it's initialization again & read stubbed device-related properties.
  let $devicejsScript = $('<script>').attr('type', 'text/javascript').attr('src', '/assets/devicejs.script');
  $scriptContainer.append($devicejsScript);

  registerMochModule();
  DeviceInstanceInitializer.initialize(appInstance);


  let result = application.__container__.lookup('template:my-form');
  assert.strictEqual(result.subObj1, 'template:mobile/my-form');

  $scriptContainer.remove();
});
