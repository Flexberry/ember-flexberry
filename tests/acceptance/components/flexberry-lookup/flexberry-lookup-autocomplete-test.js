import Ember from 'ember';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup autocomplete message', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete';
  visit(path);

  andThen(function() {
    assert.equal(currentPath(), path);

    let $result = Ember.$('.result');
    fillIn('.flexberry-lookup', 'gfhfkjglkhlh').then(function() {

      assert.strictEqual($result.hasClass('transition'), true, 'Component\'s wrapper has');
    });
  });
});
