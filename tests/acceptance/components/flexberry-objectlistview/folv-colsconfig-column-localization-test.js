import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { loadingLocales } from './folv-tests-functions';
import RuLocale from 'dummy/locales/ru/translations';
import EnLocale from 'dummy/locales/en/translations';

executeTest('check colsconfig column localization test', (store, assert, app) => {
  let path = 'ember-flexberry-dummy-suggestion-list';
  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);
    loadingLocales('en', app).then(() => {
      let $configButton = Ember.$('button.config-button')[0];
      click($configButton);
      andThen(() => {
        let columnsLocalization = Ember.get(EnLocale, 'models.ember-flexberry-dummy-suggestion.projections.SuggestionL');

        function checkLocalization(columnsLocalization, locale) {
          let $columns = Ember.$('div.flexberry-colsconfig.content tbody tr');
          $.each($columns, function(i, column) {
            let cellText = column.cells[2].innerText;
            let propname = column.attributes.propname.value;
            let assertionMessage = locale + ' locale '+ propname + ' ok';
            if (propname.contains('.')) {
              if (propname.contains('.name')) {
                propname = propname.split('.',1);
                let caption = columnsLocalization[propname].__caption__;
                assert.equal(caption, cellText, assertionMessage);
              } else {
                propname = propname.split('.');
                let propname2 = propname[1];
                propname = propname[0];
                let caption = columnsLocalization[propname][propname2].__caption__;
                assert.equal(caption, cellText, assertionMessage);
              }
            } else {
              let caption = columnsLocalization[propname].__caption__;
              assert.equal(caption, cellText, assertionMessage);
            }
          });
        }

        checkLocalization(columnsLocalization, 'En');
        let $closeModal = Ember.$('.flexberry-modal').children('.close');
        click($closeModal);
        andThen(() => {
          loadingLocales('ru', app).then(() => {
            click($configButton);
            andThen(() => {
              let columnsLocalization = Ember.get(RuLocale, 'models.ember-flexberry-dummy-suggestion.projections.SuggestionL');
              checkLocalization(columnsLocalization, 'Ru');
            });
          });
        });
      });
    });
  });
});
