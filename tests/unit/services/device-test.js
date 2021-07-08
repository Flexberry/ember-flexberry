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
    // eslint-disable-next-line ember/new-module-imports
    Ember.getOwner.restore();
  }
});

/* eslint-disable-next-line qunit/no-global-module-test */
test('device service isMobile work', function (assert) {
  const service = DeviceService.create();
  const fakeMobile = sinon.fake.returns(true);
  service.mobile = fakeMobile;

  assert.ok(service.isMobile());
  assert.ok(fakeMobile.called);
});

/* eslint-disable-next-line qunit/no-global-module-test */
test('device service isDesktop work', function (assert) {
  const service = DeviceService.create();
  const fakeDesktop = sinon.fake.returns(true);
  service.desktop = fakeDesktop;

  assert.ok(service.isDesktop());
  assert.ok(fakeDesktop.called);
});

/* eslint-disable-next-line qunit/no-global-module-test */
test('device service isTablet work', function (assert) {
  const service = DeviceService.create();
  const fakeTablet = sinon.fake.returns(true);
  service.tablet = fakeTablet;

  assert.ok(service.isTablet());
  assert.ok(fakeTablet.called);
});

/* eslint-disable-next-line qunit/no-global-module-test */
test('device service isTv work', function (assert) {
  const service = DeviceService.create();
  const fakeTv = sinon.fake.returns(true);
  service.television = fakeTv;

  assert.ok(service.isTv());
  assert.ok(fakeTv.called);
});

/* eslint-disable-next-line qunit/no-global-module-test */
test('device service pathPrefixes work Desktop', function (assert) {
  const service = DeviceService.create();
  const fakeDesktop = sinon.fake.returns(true);
  service.desktop = fakeDesktop;

  let pathPrefixes = service.pathPrefixes(false);

  assert.equal(pathPrefixes.length, 0);
  assert.ok(fakeDesktop.called);
});

/* eslint-disable-next-line qunit/no-global-module-test */
test('device service pathPrefixes work Mobile', function (assert) {
  const service = DeviceService.create();
  const fakeDesktop = sinon.fake.returns(false);
  const fakeMobile = sinon.fake.returns(true);
  const fakeTablet = sinon.fake.returns(false);
  const fakeTv = sinon.fake.returns(false);
  service.desktop = fakeDesktop;
  service.mobile = fakeMobile;
  service.tablet = fakeTablet;
  service.tv = fakeTv;

  let pathPrefixes = service.pathPrefixes(false);

  assert.equal(pathPrefixes.length, 1);
  assert.equal(pathPrefixes[0], 'mobile');
  assert.ok(fakeDesktop.called);
  assert.ok(fakeMobile.called);
});

/* eslint-disable-next-line qunit/no-global-module-test */
test('device service pathPrefixes work Tablet', function (assert) {
  const service = DeviceService.create();
  const fakeDesktop = sinon.fake.returns(false);
  const fakeMobile = sinon.fake.returns(false);
  const fakeTablet = sinon.fake.returns(true);
  const fakeTv = sinon.fake.returns(false);
  service.desktop = fakeDesktop;
  service.mobile = fakeMobile;
  service.tablet = fakeTablet;
  service.tv = fakeTv;

  let pathPrefixes = service.pathPrefixes(false);

  assert.equal(pathPrefixes.length, 1);
  assert.equal(pathPrefixes[0], 'mobile');
  assert.ok(fakeDesktop.called);
  assert.ok(fakeTablet.called);
});
