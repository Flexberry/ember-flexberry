import serializeSortingParam from 'dummy/utils/serialize-sorting-param';
import { module, test } from 'qunit';

module('Unit | Utility | serialize sorting param', function() {
  test('it works', function(assert) {
    let sortingObject = [
      { propName: 'type.name', direction: 'asc' },
      { propName: 'moderated', direction: 'desc' },
    ];

    let result = serializeSortingParam(sortingObject);
    assert.ok(result);
    assert.equal(result, '+type.name-moderated');
  });

  test('empty array', function(assert) {
    let sortingObject = [];

    let result = serializeSortingParam(sortingObject, null);
    assert.equal(result, null);
  });
});
