import IdProxy, { separator } from '../../../utils/idproxy';
import { module, test } from 'qunit';

module('idproxy');

// Replace this with your real tests.
test('it works', function(assert) {
  var id = '1';
  var view = { name: 'tmpViewName' };

  var proxiedId = IdProxy.mutate(id, view);
  var originalData = IdProxy.retrieve(proxiedId);

  assert.ok(proxiedId === id + separator + view.name + separator);
  assert.ok(originalData.id === id);
  assert.ok(originalData.viewName === view.name);
  assert.ok(IdProxy.idIsProxied(proxiedId));
  assert.ok(!IdProxy.idIsProxied(id));
});
