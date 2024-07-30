import { executeTest } from './execute-folv-test';
// import { click, visit, currentURL } from '@ember/test-helpers';
import { get } from '@ember/object';
import RuLocale from 'dummy/locales/ru/translations';
import { settled } from '@ember/test-helpers';

executeTest('check edit in modal open', async (store, assert) => {
  assert.expect(3);
  const path = 'ember-flexberry-dummy-suggestion-type-list';
  
  await visit(path);
  assert.equal(currentURL(), path, 'Visited the correct path');

  const row = document.querySelector('.field');
  await click(row);
  
  await settled(); // Wait for any pending promises
  
  const $editForm = document.querySelector('.flexberry-modal');
  assert.ok($editForm, 'edit form open');
  assert.strictEqual($editForm.querySelector('.ui.header').innerText, get(RuLocale, 'forms.ember-flexberry-dummy-suggestion-type-edit.caption'), 'check header');

  const closeButton = document.querySelector('.close-button');
  await click(closeButton);
});
