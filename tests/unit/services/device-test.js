import Ember from 'ember';
import { module, test } from 'qunit';
import sinon from 'sinon';

import DeviceService from 'ember-flexberry/services/device';

/* eslint-disable-next-line qunit/no-global-module-test */ // https://github.com/platinumazure/eslint-plugin-qunit/issues/75
module('Unit | Service | device', {
  beforeEach() {
    sinon.stub(Ember, 'getOwner').returns({ application: { deviceService: {} } });
  },
  afterEach() {
    Ember.getOwner.restore();
  }
});

/* eslint-disable-next-line qunit/no-global-module-test */
test('device service isMobile work', function(assert) {
  const service = DeviceService.create();
  const fakeMobile = sinon.fake.returns(true);
  service.mobile = fakeMobile;

  assert.ok(service.isMobile());
  assert.ok(fakeMobile.called);
});

/* eslint-disable-next-line qunit/no-global-module-test */
test('device service isDesktop work', function(assert) {
  const service = DeviceService.create();
  const fakeDesktop = sinon.fake.returns(true);
  service.desktop = fakeDesktop;

  assert.ok(service.isDesktop());
  assert.ok(fakeDesktop.called);
});
