import { Promise } from 'rsvp';
import EmberObject from '@ember/object';
import { isNone } from '@ember/utils';
import { run } from '@ember/runloop';
import EditFormNewRoute from 'ember-flexberry/routes/edit-form-new';
import Model from 'ember-flexberry-data/models/model';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';

let app;
let getConfiguredTestRoute = function(modelCurrentNotSaved, modelSelectedDetail) {
  let route = EditFormNewRoute.create();

  let model = Model;
  model.defineProjection('testProjection', 'test-model');
  let detailInteractionServiceMock = EmberObject.create({
    modelCurrentNotSaved: !isNone(modelCurrentNotSaved) && modelCurrentNotSaved ? model : null,
    modelSelectedDetail: !isNone(modelSelectedDetail) && modelSelectedDetail ? model : null,
  });

  let store = app.__container__.lookup('service:store');
  app.register('model:test-model', model);

  route.set('store', store);
  route.set('modelName', 'test-model');
  route.set('prototypeProjection', 'testProjection');
  route.set('flexberryDetailInteractionService', detailInteractionServiceMock);

  return route;
};

module('Unit | Route | edit form new', {
  beforeEach: function () {
    app = startApp();
  },
  afterEach: function() {
    destroyApp(app);
  }
});

test('it exists', function(assert) {
  let route = EditFormNewRoute.create();
  assert.ok(route);
});

test('return model as Promise main', function(assert) {
  let route = getConfiguredTestRoute();

  assert.ok(route);
  run(() => {
    let record = route.model({}, { queryParams: { } });
    assert.equal(record instanceof Promise, true);
  });
});

test('return model as Promise modelCurrentNotSaved', function(assert) {
  let route = getConfiguredTestRoute(true);

  assert.ok(route);
  run(() => {
    let record = route.model({}, { queryParams: { } });
    assert.equal(record instanceof Promise, true);
  });
});

test('return model as Promise modelSelectedDetail', function(assert) {
  let route = getConfiguredTestRoute(false, true);

  assert.ok(route);
  run(() => {
    let record = route.model({}, { queryParams: { } });
    assert.equal(record instanceof Promise, true);
  });
});

test('return model as Promise prototypeId', function(assert) {
  let route = getConfiguredTestRoute();

  assert.ok(route);
  run(() => {
    let record = route.model({}, { queryParams: { prototypeId: 'test-id' } });
    assert.equal(record instanceof Promise, true);
  });
});
