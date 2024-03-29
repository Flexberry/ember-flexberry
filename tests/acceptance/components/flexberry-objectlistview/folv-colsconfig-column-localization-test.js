import Ember from 'ember';
import RSVP from 'rsvp';
import { executeTest } from './execute-folv-test';
import { loadingLocales } from './folv-tests-functions';
import RuLocale from 'dummy/locales/ru/translations';
import EnLocale from 'dummy/locales/en/translations';

executeTest('check colsconfig column localization test', (store, assert, app) => {
  assert.expect(21);
  const path = 'ember-flexberry-dummy-suggestion-list';
  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    function checkLocalization(currentLocale, locale) {
      return new RSVP.Promise((resolve) => {
        const columnsLocalization = Ember.get(currentLocale, 'models.ember-flexberry-dummy-suggestion.projections.SuggestionL');

        click('.config-button');
        andThen(() => {
          const $columns = Ember.$('.flexberry-colsconfig tbody tr');
          $columns.each((i, column) => {
            const cellText = column.cells[2].innerText;
            const propname = column.getAttribute('propname').replace('.name', '');
            const assertionMessage = `${locale} locale ${propname} ok`;
            const caption = Ember.get(columnsLocalization, `${propname}.__caption__`);
            assert.equal(caption, cellText, assertionMessage);
          });

          click('.close.icon');
          andThen(() => {
            resolve();
          });
        });
      });
    }

    loadingLocales('en', app).then(() => {
      checkLocalization(EnLocale, 'En').then(() => {
        loadingLocales('ru', app).then(() => {
          checkLocalization(RuLocale, 'Ru');
        });
      });
    });
  });
});
