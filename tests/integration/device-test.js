import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../helpers/start-app';
import hbs from 'htmlbars-inline-precompile';

let application;

moduleForComponent('service:device', 'TEST Device', {
  integration: true,
  beforeEach() {
    Ember.run(() => {
      window.navigator.__defineGetter__('userAgent', function () {
          return "Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A456 Safari/602.1"
      });
      window.navigator.__defineGetter__('appName', function () {
          return "Netscape"
      });
      application = startApp();
      var script = '<script type="text/javascript" src="/assets/bower_components/devicejs/lib/device.js"></script>';
      $('head').append(script);
      $('body').append(script);
    });
  }
});

test('work method platform(false)', function(assert) {
  assert.expect(1);
  //document.documentElement.className = 'tv ios';
  this.render(hbs`<h1></h1>`);

  //let service = this.subject(application.__container__.ownerInjection());
  let result = this.platform(false);
  assert.strictEqual(result, 'ios');
});
