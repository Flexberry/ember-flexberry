import ProjectionQuery from '../../../utils/projection-query';
import { module, test } from 'qunit';
import Ember from 'ember';
import DS from 'ember-data';
import ModelProjectionsCollection from '../../../objects/model-projections-collection';
import ModelProjection from '../../../objects/model-projection';

test('query for async relationships', function(assert) {
  var projection = ModelProjection.create({
    type: 'employee',
    name: 'EmployeeE',
    properties: ['firstName', 'lastName', 'birthDate', 'reportsTo', 'tmpChildren'],
    masters: ModelProjectionsCollection.create({
      reportsTo: ModelProjection.create({
        type: 'employee',
        name: 'EmployeeE.masters.reportsTo',
        properties: ['firstName']
      })
    }),
    details: ModelProjectionsCollection.create({
      tmpChildren: ModelProjection.create({
        type: 'employee',
        name: 'EmployeeE.details.tmpChildren',
        properties: ['lastName']
      })
    })
  });

  var serializer = DS.RESTSerializer.create({
    primaryKey: 'EmployeeID',

    keyForAttribute: function(attr) {
      return Ember.String.capitalize(attr);
    }
  });

  var query = ProjectionQuery.get(projection, serializer);
  assert.equal(query.$select, 'EmployeeID,FirstName,LastName,BirthDate,ReportsTo,TmpChildren');
  assert.strictEqual(query.$expand, undefined);
});
