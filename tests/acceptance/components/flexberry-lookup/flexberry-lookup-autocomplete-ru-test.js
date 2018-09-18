import $ from 'jquery';
import { run } from '@ember/runloop';
import { executeTest } from './execute-flexberry-lookup-test';
import { loadingLocales } from './lookup-test-functions';
import { fillIn } from '@ember/test-helpers';

executeTest('flexberry-lookup autocomplete message ru', (store, assert, app) => {
  assert.expect(4);
  let path = 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete';
  visit(path);

  andThen(function() {
    assert.equal(currentPath(), path);

    loadingLocales('ru', app).then(() => {
      let textbox = $('.ember-text-field')[0];
      fillIn(textbox, 'gfhfkjglkhlh');
    });

    let asyncOperationsCompleted = assert.async();
    run.later(function() {
      asyncOperationsCompleted();

      let $message = $('.message');
      assert.strictEqual($message.hasClass('empty'), true, 'Component\'s wrapper has message');

      let $messageHeader = $message.children('.header');
      assert.equal($messageHeader.text(), 'Нет данных', 'Message\'s header is properly');

      let $messageDescription = $message.children('.description');
      assert.equal($messageDescription.text(), 'Значения не найдены', 'Message\'s description is properly');

    }, 5000);
  });
});
