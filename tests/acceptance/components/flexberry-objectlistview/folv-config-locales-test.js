import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { loadingLocales } from './folv-tests-functions';

import I18nRuLocale from 'dummy/locales/ru/translations'; 
import I18nEnLocale from 'dummy/locales/en/translations'; 

executeTest('check config locale change', (store, assert, app) => {
  assert.expect(21);
  let path = 'ember-flexberry-dummy-suggestion-list';
  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    function configMenuTableRowsAssert(currentLocale) {
      let configButton = Ember.$('.config-button');
      configButton.click();
      let configContent = Ember.$('.flexberry-colsconfig.content');
      let configTable = Ember.$('.table', configContent);
      let tableBody = Ember.$('tbody', configTable);
      let tableRows = tableBody.children();

      for (var i = 0; i < tableRows.length; i++){
        let row = tableRows[i];
        let rowName = row.children[2].innerText;
        let propname = row.getAttribute('propname').replace('.name','');
        let getLocale = Ember.get(currentLocale, 'models.ember-flexberry-dummy-suggestion.projections.SuggestionL.' + propname + '.__caption__');
        assert.equal(getLocale, rowName, rowName + ' == ' + getLocale);
      }

      let closeButton = Ember.$('.close.icon')
      closeButton.click();
    }

    loadingLocales('ru', app).then(() => {
      configMenuTableRowsAssert(I18nRuLocale);
      loadingLocales('en', app).then(() => {
        configMenuTableRowsAssert(I18nEnLocale);
      });
    });
  });
});
