import Ember from 'ember';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup autocomplete message', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete';
  visit(path);

  andThen(function() {
    assert.equal(currentPath(), path);

    let done = assert.async();
    let timeout = 100;
    Ember.run.later((() => {
      let input = Ember.$('.flexberry-lookup');
      input.focus();

      let $inputState = Ember.$('.flexberry-lookup');
      assert.strictEqual($inputState.hasClass('focus'), true, 'ok');
      done();
    }), timeout);

    // let $result = Ember.$('.result');
    // fillIn('.flexberry-lookup', 'gfhfkjglkhlh').andThen(function() {

    // let $message = $result.children('');
    //assert.strictEqual($result.hasClass('transition'), true, 'Component\'s wrapper has');
    //});
  });
});
