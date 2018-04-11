import EmberObject, { get } from '@ember/object';
import { run } from '@ember/runloop';
import DS from 'ember-data';
import ReloadListMixin from 'ember-flexberry/mixins/reload-list-mixin';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import { Projection } from 'ember-flexberry-data';
import { Serializer } from 'ember-flexberry-data';
import { Query } from 'ember-flexberry-data';

const {
  SimplePredicate,
  StringPredicate,
  ComplexPredicate
} = Query;

module('Unit | Mixin | reload list mixin');

test('it works', function(assert) {
  let ReloadListMixinObject = EmberObject.extend(ReloadListMixin);
  let subject = ReloadListMixinObject.create();
  assert.ok(subject);
});

test('it properly generates simple filter predicate', function(assert) {
  let Model = Projection.Model.extend({
    firstName: DS.attr('string'),
  });

  Model.defineProjection('EmployeeE', 'employeeTest', {
    firstName: Projection.attr()
  });

  let modelSerializer = Serializer.Odata.extend({});
  let projection = get(Model, 'projections').EmployeeE;

  let app = startApp();

  app.register('model:employeeTest', Model);
  app.register('serializer:employeeTest', modelSerializer);
  let store = app.__container__.lookup('service:store');

  let ReloadListMixinObject = EmberObject.extend(ReloadListMixin);
  let objectInstance = ReloadListMixinObject.create();
  objectInstance.store = store;

  let result = objectInstance._getFilterPredicate(projection, { filter: 'test' });
  let resultUndefined = objectInstance._getFilterPredicate(projection, { filter: undefined });
  let resultEmpty = objectInstance._getFilterPredicate(projection, { filter: '' });
  run(app, 'destroy');

  assert.equal(typeof result, 'object');
  assert.equal(result.constructor, StringPredicate);
  assert.equal(result.attributePath, 'firstName');
  assert.equal(result.containsValue, 'test');

  assert.equal(resultUndefined, null);
  assert.equal(resultEmpty, null);
});

test('it properly generates complex filter predicate', function(assert) {
  let Model0 = Projection.Model.extend({
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    dateField: DS.attr('date'),
    numberField: DS.attr('number'),
  });

  let app = startApp();
  app.register('model:employeeTest2', Model0);

  let Model = Projection.Model.extend({
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    dateField: DS.attr('date'),
    numberField: DS.attr('number'),
    masterField: DS.belongsTo('employeeTest2', { inverse: null, async: false }),
  });

  app.register('model:employeeTest', Model);

  Model.defineProjection('EmployeeE', 'employeeTest', {
    firstName: Projection.attr(),
    lastName: Projection.attr(),
    dateField: Projection.attr(),
    numberField: Projection.attr(),
    reportsTo: Projection.belongsTo('employeeTest2', 'Reports To', {
      firstName: Projection.attr('Reports To - First Name', {
        hidden: true
      })
    }, {
      displayMemberPath: 'firstName'
    })
  });

  let modelSerializer = Serializer.Odata.extend({});
  let modelSerializer0 = Serializer.Odata.extend({});
  let projection = get(Model, 'projections').EmployeeE;

  app.register('serializer:employeeTest2', modelSerializer0);
  app.register('serializer:employeeTest', modelSerializer);
  let store = app.__container__.lookup('service:store');

  let ReloadListMixinObject = EmberObject.extend(ReloadListMixin);
  let objectInstance = ReloadListMixinObject.create();
  objectInstance.store = store;
  let result = objectInstance._getFilterPredicate(projection, { filter: '123' });
  run(app, 'destroy');

  assert.equal(typeof result, 'object');
  assert.equal(result.constructor, ComplexPredicate);
  assert.equal(result.condition, 'or');

  // It counts only string fields.
  assert.equal(result.predicates.length, 4);
  assert.equal(result.predicates[0].constructor, StringPredicate);
  assert.equal(result.predicates[0].attributePath, 'firstName');
  assert.equal(result.predicates[0].containsValue, '123');
  assert.equal(result.predicates[2].constructor, SimplePredicate);
  assert.equal(result.predicates[2].attributePath, 'numberField');
  assert.equal(result.predicates[2].operator, 'eq');
  assert.equal(result.predicates[2].value, '123');
  assert.equal(result.predicates[3].constructor, StringPredicate);
  assert.equal(result.predicates[3].attributePath, 'reportsTo.firstName');
  assert.equal(result.predicates[3].containsValue, '123');
});
