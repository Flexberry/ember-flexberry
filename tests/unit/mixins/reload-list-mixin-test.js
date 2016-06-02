import Ember from 'ember';
import ReloadListMixin from 'ember-flexberry/mixins/reload-list-mixin';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';
import ODataSerializer from 'ember-flexberry-data/serializers/odata';
import { StringPredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';

module('Unit | Mixin | reload list mixin');

test('it works', function(assert) {
  let ReloadListMixinObject = Ember.Object.extend(ReloadListMixin);
  let subject = ReloadListMixinObject.create();
  assert.ok(subject);
});

test('it properly generates simple filter predicate', function(assert) {
  let Model = BaseModel.extend({
    firstName: DS.attr('string'),
  });

  Model.defineProjection('EmployeeE', 'employeeTest', {
    firstName: Proj.attr()
  });

  let modelSerializer = ODataSerializer.extend({});
  let projection = Ember.get(Model, 'projections').EmployeeE;

  let app = startApp();

  app.register('model:employeeTest', Model);
  app.register('serializer:employeeTest', modelSerializer);
  let store = app.__container__.lookup('service:store');

  let ReloadListMixinObject = Ember.Object.extend(ReloadListMixin);
  let objectInstance = ReloadListMixinObject.create();
  objectInstance.store = store;

  let result = objectInstance.getFilterPredicate(projection, { filter: 'test' });
  let resultUndefined = objectInstance.getFilterPredicate(projection, { filter: undefined });
  let resultEmpty = objectInstance.getFilterPredicate(projection, { filter: '' });
  Ember.run(app, 'destroy');

  assert.equal(typeof result, 'object');
  assert.equal(result.constructor, StringPredicate);
  assert.equal(result.attributeName, 'firstName');
  assert.equal(result.containsValue, 'test');

  assert.equal(resultUndefined, undefined);
  assert.equal(resultEmpty, undefined);
});

test('it properly generates complex filter predicate', function(assert) {
  let Model0 = BaseModel.extend({
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    dateField: DS.attr('date'),
    numberField: DS.attr('number'),
  });

  let app = startApp();
  app.register('model:employeeTest2', Model0);

  let Model = BaseModel.extend({
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    dateField: DS.attr('date'),
    numberField: DS.attr('number'),
    masterField: DS.belongsTo('employeeTest2', { inverse: null, async: false }),
  });

  app.register('model:employeeTest', Model);

  Model.defineProjection('EmployeeE', 'employeeTest', {
    firstName: Proj.attr(),
    lastName: Proj.attr(),
    dateField: Proj.attr(),
    numberField: Proj.attr(),
    reportsTo: Proj.belongsTo('employeeTest2', 'Reports To', {
      firstName: Proj.attr('Reports To - First Name')
    }, { hidden: true })
  });

  let modelSerializer = ODataSerializer.extend({});
  let modelSerializer0 = ODataSerializer.extend({});
  let projection = Ember.get(Model, 'projections').EmployeeE;

  app.register('serializer:employeeTest2', modelSerializer0);
  app.register('serializer:employeeTest', modelSerializer);
  let store = app.__container__.lookup('service:store');

  let ReloadListMixinObject = Ember.Object.extend(ReloadListMixin);
  let objectInstance = ReloadListMixinObject.create();
  objectInstance.store = store;
  let result = objectInstance.getFilterPredicate(projection, { filter: 'test' });
  Ember.run(app, 'destroy');

  assert.equal(typeof result, 'object');
  assert.equal(result.constructor, ComplexPredicate);
  assert.equal(result.condition, 'or');
  assert.equal(result.predicates.length, 4);
  assert.equal(result.predicates[0].constructor, StringPredicate);
  assert.equal(result.predicates[0].attributeName, 'firstName');
  assert.equal(result.predicates[0].containsValue, 'test');
});
