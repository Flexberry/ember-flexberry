import Ember from 'ember';
import { executeTest } from './execute-flexberry-lookup-test';
import { loadingLocales } from './lookup-test-functions';

executeTest('flexberry-lookup autocomplete message en', (store, assert, app) => {
  assert.expect(4);
  let path = 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete';
  visit(path);

  andThen(function() {
    assert.equal(currentPath(), path);

    loadingLocales('en', app).then(() => {
      let textbox = Ember.$('.ember-text-field');
      fillIn(textbox, 'gfhfkjglkhlh');
    });

    let asyncOperationsCompleted = assert.async();
    Ember.run.later(function() {
      asyncOperationsCompleted();

      let $message = Ember.$('.message');
      assert.strictEqual($message.hasClass('empty'), true, 'Component\'s wrapper has message');

      let $messageHeader = $message.children('.header');
      assert.equal($messageHeader.text(), 'No results', 'Message\'s header is properly');

      let $messageDescription = $message.children('.description');
      assert.equal($messageDescription.text(), 'No results found', 'Message\'s description is properly');
    }, 5000);
  });
});
