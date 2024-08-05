import { executeTest } from './execute-folv-test';
import { settled } from '@ember/test-helpers';

executeTest('check column config save button test', async (store, assert) => {
  assert.expect(3);
  const path = 'ember-flexberry-dummy-suggestion-list';

  await visit(path);
  assert.equal(currentPath(), path, 'Visited the correct path');

  await click('button.config-button');
  await settled(); // Ждем завершения всех асинхронных действий

  const $field = document.querySelector('div.ui.action.input');
  const $fieldInput = $field.querySelector('input');

  assert.equal($field.querySelectorAll('.cols-config-save.disabled').length === 1, true, 'button disabled');
  await fillIn($fieldInput, 'aaayyyeee leemaauuuu');
  await settled(); // Ждем завершения всех асинхронных действий

  assert.equal($field.querySelectorAll('.cols-config-save.disabled').length === 0, true, 'button active');
});
