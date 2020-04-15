import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { loadingLocales } from './folv-tests-functions';

executeTest('check colsconfig column localization test', (store, assert, app) => {
  assert.expect(3);
  let path = 'ember-flexberry-dummy-suggestion-list';
  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);
    loadingLocales('en', app).then(() => {
      let $configButton = Ember.$('button.config-button')[0].nextElementSibling;
      click($configButton);
      click($configButton.children[2].children[0]);
      andThen(() => {
        let $innerText = Ember.$('div.flexberry-colsconfig.content')[0].innerText;
        assert.ok($innerText.contains('Address'),
                  $innerText.contains('Text'),
                  $innerText.contains('Date'),
                  $innerText.contains('Votes'),
                  $innerText.contains('Moderated'),
                  $innerText.contains('Type'),
                  $innerText.contains('Author'),
                  $innerText.contains('Email'),
                  $innerText.contains('Editor'),
                  $innerText.contains('Comments count'));
        let $closeModal = Ember.$('.flexberry-modal').children('.close');
        click ($closeModal);
        andThen(() => {
          loadingLocales('ru', app).then(() => {
            click($configButton);
            click($configButton.children[2].children[0]);
            andThen(() => {
              let $innerText = Ember.$('div.flexberry-colsconfig.content')[0].innerText;
              assert.ok($innerText.contains('Адрес'),
                        $innerText.contains('Текст'),
                        $innerText.contains('Дата'),
                        $innerText.contains('Голоса'),
                        $innerText.contains('Одобрено'),
                        $innerText.contains('Тип предложения'),
                        $innerText.contains('Автор'),
                        $innerText.contains('Почта'),
                        $innerText.contains('Редактор'),
                        $innerText.contains('Количество комментариев'));
            });
          });
        });
      });
    });
  });
});


