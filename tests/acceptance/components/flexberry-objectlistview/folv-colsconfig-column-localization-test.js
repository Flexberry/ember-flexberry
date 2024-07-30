import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { loadingLocales } from './folv-tests-functions';
import RuLocale from 'dummy/locales/ru/translations';
import EnLocale from 'dummy/locales/en/translations';
import { settled } from '@ember/test-helpers';

executeTest('check colsconfig column localization test', async (store, assert, app) => {
  assert.expect(21);
  const path = 'ember-flexberry-dummy-suggestion-list';

  await visit(path);
  assert.equal(currentPath(), path, 'Visited the correct path');

  const checkLocalization = async (currentLocale, locale) => {
    const columnsLocalization = Ember.get(currentLocale, 'models.ember-flexberry-dummy-suggestion.projections.SuggestionL');

    await click('.config-button');
    await settled(); // Ждем завершения всех асинхронных действий

    const $columns = Ember.$('.flexberry-colsconfig tbody tr');
    $columns.each((i, column) => {
      const cellText = column.cells[2].innerText;
      const propname = column.getAttribute('propname').replace('.name', '');
      const assertionMessage = `${locale} locale ${propname} ok`;
      const caption = Ember.get(columnsLocalization, `${propname}.__caption__`);
      assert.equal(caption, cellText, assertionMessage);
    });

    await click('.close.icon');
    await settled(); // Ждем завершения всех асинхронных действий
  };

  await loadingLocales('en', app);
  await checkLocalization(EnLocale, 'En');

  await loadingLocales('ru', app);
  await checkLocalization(RuLocale, 'Ru');
});
