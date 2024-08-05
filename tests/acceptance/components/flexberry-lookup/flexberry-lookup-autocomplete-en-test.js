import $ from 'jquery';
import { executeTest } from './execute-flexberry-lookup-test';
import { loadingLocales } from './lookup-test-functions';
import { settled } from '@ember/test-helpers';

executeTest('flexberry-lookup autocomplete message en', async (store, assert, app) => {
  assert.expect(4);
  const path = 'components-acceptance-tests/flexberry-lookup/settings-example-autocomplete';
  
  await visit(path);
  assert.equal(currentPath(), path, 'Navigated to the correct path');

  await loadingLocales('en', app);

  const textbox = $('.ember-text-field')[0];
  await fillIn(textbox, 'gfhfkjglkhlh');

  // Wait for any asynchronous operations to complete
  await settled();

  await new Promise(resolve => setTimeout(resolve, 6000));

  // Check for the message
  const $message = $('.message');
  assert.strictEqual($message.hasClass('empty'), true, 'Component\'s wrapper has message');

  const $messageHeader = $message.children('.header');
  assert.equal($messageHeader.text(), 'No results', 'Message\'s header is properly');

  const $messageDescription = $message.children('.description');
  assert.equal($messageDescription.text(), 'No results found', 'Message\'s description is properly');
});
