import IdProxy, { separator } from '../../../utils/idproxy';
import ModelProjection from '../../../objects/model-projection';
import { module, test } from 'qunit';

module('idproxy');

// Replace this with your real tests.
test('it works', function(assert) {
  var id = '1';
  var projection = ModelProjection.create({
    name: 'tmpProjectionName'
  });

  var proxiedId = IdProxy.mutate(id, projection);
  var originalData = IdProxy.retrieve(proxiedId);

  assert.ok(proxiedId === id + separator + projection.name + separator);
  assert.ok(originalData.id === id);
  assert.ok(originalData.projectionName === projection.name);
  assert.ok(IdProxy.idIsProxied(proxiedId));
  assert.ok(!IdProxy.idIsProxied(id));
});
