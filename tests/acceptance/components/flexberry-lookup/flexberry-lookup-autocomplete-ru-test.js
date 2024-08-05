import { settled } from '@ember/test-helpers';
import { executeTest } from './execute-flexberry-lookup-test';
import { loadingLocales } from './lookup-test-functions';
import $ from 'jquery';

executeTest('flexberry-lookup autocomplete message ru', async (store, assert, app) => {
  assert.expect(4);
  const path = 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete';
  
  await visit(path);
  assert.equal(currentPath(), path, 'The current URL is correct');

  await loadingLocales('ru', app);
  
  const textbox = $('.ember-text-field')[0];
  await fillIn(textbox, 'gfhfkjglkhlh');

  // Wait for the async operations to complete
  await settled();

  await new Promise(resolve => setTimeout(resolve, 6000));

  const $message = $('.message');
  assert.ok($message.hasClass('empty'), 'Component\'s wrapper has message');

  const $messageHeader = $message.children('.header');
  assert.equal($messageHeader.text(), 'Нет данных', 'Message\'s header is properly');

  const $messageDescription = $message.children('.description');
  assert.equal($messageDescription.text(), 'Значения не найдены', 'Message\'s description is properly');
});
