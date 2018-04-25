import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { loadingLocales, refreshListByFunction } from './folv-tests-functions';
import I18nEnLocale from 'ember-flexberry/locales/en/translations';

executeTest('check getCellComponent', (store, assert, app) => {
  assert.expect(7);
  let path = 'components-acceptance-tests/flexberry-objectlistview/date-format';
  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    // Set 'en' as current locale.
    loadingLocales('en', app).then(() => {

      let olvContainerClass = '.object-list-view-container';

      let controller = app.__container__.lookup('controller:' + currentRouteName());

      let $folvContainer = Ember.$('.object-list-view-container');
      let $table = Ember.$('table.object-list-view', $folvContainer);

      let $headRow = Ember.$('thead tr', $table)[0].children;

      let indexDate = () => {
        let toReturn;
        Object.keys($headRow).forEach((element, index, array) => {
          if (Ember.$.trim($headRow[element].innerText) === 'Date') {
            toReturn = index;
            return false;
          }
        });
        return toReturn;
      };

      let $dateCell = () => { return Ember.$.trim(Ember.$('tbody tr', $table)[0].children[indexDate()].innerText); };

      let myRe = /[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])/;

      // Date format most be YYYY-MM-DD.
      let myArray = myRe.exec($dateCell());

      let result = myArray ? myArray[0] : null;
      assert.ok(result, 'date format is \'YYYY-MM-DD\' ');

      controller.set('dateFormat', '2');
      let $toolBar = Ember.$('.ui.secondary.menu')[0];
      let $toolBarButtons = $toolBar.children;
      let $refreshButton = $toolBarButtons[0];
      assert.equal($refreshButton.innerText.trim(), Ember.get(I18nEnLocale, 'components.olv-toolbar.refresh-button-text'), 'button refresh exist');

      let timeout = 500;
      Ember.run.later((() => {
        // Apply filter function.
        let refreshFunction =  function() {
          let refreshButton = Ember.$('.refresh-button')[0];
          refreshButton.click();
        };

        // Apply filter.
        let done = assert.async();
        refreshListByFunction(refreshFunction, controller).then(() => {
          let $list =  Ember.$(olvContainerClass);
          assert.ok($list, 'list loaded');

          // Date format most be DD.MM.YYYY, hh:mm:ss.
          let reDateTime = /(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d\, ([0-1]\d|2[0-3])(:[0-5]\d){2}$/;
          let arrayDateTime = reDateTime.exec($dateCell());

          let resultDateTime = arrayDateTime ? arrayDateTime[0] : null;
          assert.ok(resultDateTime, 'date format is \'DD.MM.YYYY, hh:mm:ss\' ');
          controller.set('dateFormat', '3');

          let done2 = assert.async();
          Ember.run.later((() => {
            let done1 = assert.async();
            refreshListByFunction(refreshFunction, controller).then(() => {
              let $list =  Ember.$(olvContainerClass);
              assert.ok($list, 'list loaded');

              // Date format most be II (example Sep 4 1986).
              let reDateString = /[a-zA-Z]{3} ([1-9]|[12][0-9]|3[01])\, (19|20)\d\d/;
              let arrayDateString = reDateString.exec($dateCell());

              let resultDateString = arrayDateString ? arrayDateString[0] : null;
              assert.ok(resultDateString, 'date format is \'ll\' ');
              done1();
            });
            done2();
          }), timeout);
          done();
        });
      }), timeout);
    });
  });
});
