import Ember from 'ember';
import EditFormNewRoute from 'ember-flexberry/routes/edit-form-new';
import { Projection } from 'ember-flexberry-data';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';

let app;
let getConfiguredTestRoute = function(modelCurrentNotSaved, modelSelectedDetail) {
  let route = EditFormNewRoute.create();

  let model = Projection.Model;
  model.defineProjection('testProjection', 'test-model');
  let detailInteractionServiceMock = Ember.Object.create({
    modelCurrentNotSaved: !Ember.isNone(modelCurrentNotSaved) && modelCurrentNotSaved ? model : null,
    modelSelectedDetail: !Ember.isNone(modelSelectedDetail) && modelSelectedDetail ? model : null,
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
  var route = EditFormNewRoute.create();
  assert.ok(route);
});

test('return model as Promise main', function(assert) {
  let route = getConfiguredTestRoute();

  assert.ok(route);
  Ember.run(() => {
    let record = route.model({}, { queryParams: { } });
    assert.equal(record instanceof Ember.RSVP.Promise, true);
  });
});

test('return model as Promise modelCurrentNotSaved', function(assert) {
  let route = getConfiguredTestRoute(true);

  assert.ok(route);
  Ember.run(() => {
    let record = route.model({}, { queryParams: { } });
    assert.equal(record instanceof Ember.RSVP.Promise, true);
  });
});

test('return model as Promise modelSelectedDetail', function(assert) {
  let route = getConfiguredTestRoute(false, true);

  assert.ok(route);
  Ember.run(() => {
    let record = route.model({}, { queryParams: { } });
    assert.equal(record instanceof Ember.RSVP.Promise, true);
  });
});

test('return model as Promise prototypeId', function(assert) {
  let route = getConfiguredTestRoute();

  assert.ok(route);
  Ember.run(() => {
    let record = route.model({}, { queryParams: { prototypeId: 'test-id' } });
    assert.equal(record instanceof Ember.RSVP.Promise, true);
  });
});
