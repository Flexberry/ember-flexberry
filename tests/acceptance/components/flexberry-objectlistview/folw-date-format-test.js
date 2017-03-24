import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { loadingList, loadingLocales } from './folv-tests-functions';

executeTest('date format', (store, assert, app) => {
  assert.expect(7);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);
    loadingLocales('ru', app).then(() => {
      let olvContainerClass = '.object-list-view-container';
      let trTableClass = 'table.object-list-view tbody tr';

      let controller = app.__container__.lookup('controller:application');
      let moment = app.__container__.lookup('service:moment');

      let getCellComponent = Ember.get(controller, 'getCellComponent');
      let momentValue = Ember.get(moment, 'defaultFormat');

      assert.notOk(getCellComponent, 'method \'getCellComponent\' is null');
      assert.equal(momentValue, 'L', 'moment value is \'L\' ');

      let $folvContainer = Ember.$(olvContainerClass);
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

      // Date format most be DD.MM.YYYY
      let dateFormatRuRe = /(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d/;
      let findDateRu = dateFormatRuRe.exec($dateCell());

      assert.ok(findDateRu, 'date format is \'DD.MM.YYYY\' ');

      loadingLocales('en', app).then(() => {
        let $toolBar = Ember.$('.ui.secondary.menu')[0];
        let $toolBarButtons = $toolBar.children;
        let $refreshButton = $toolBarButtons[0];
        assert.equal($refreshButton.innerText, 'Refresh', 'button refresh exist');

        let done = assert.async();

        loadingList($refreshButton, olvContainerClass, trTableClass).then(($list) => {
          assert.ok($list, 'list loaded');

          // Date format most be MM/DD/YYYY:
          let dateFormatEnRe = /(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d/;
          let dataCellStr = $dateCell();

          let findDateEn = dateFormatEnRe.exec(dataCellStr);

          assert.ok(findDateEn, 'date format is \'MM/DD/YYYY\' ');

        }).catch((reason) => {
          throw new Error(reason);
        }).finally(() => {
          done();
        });
      });

    });
  });
});
