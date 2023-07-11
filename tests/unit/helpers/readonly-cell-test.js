import { run } from '@ember/runloop';
import { readonlyCell } from 'dummy/helpers/readonly-cell';
import { module, test } from 'qunit';

module('Unit | Helper | readonly cell', function () {
  test('it works', function(assert) {
    run(function() {
      let result = readonlyCell([['test'], 'test', false]);
      assert.ok(result);
    });
  });
});
