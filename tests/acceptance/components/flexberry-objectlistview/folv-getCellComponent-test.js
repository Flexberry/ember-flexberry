import Ember from 'ember';
import { executeTest } from './execute-folv-test';

executeTest('check getCellComponent', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $folvContainer = Ember.$('.object-list-view-container');
    let $table = Ember.$('table.object-list-view', $folvContainer);

    let $firstRow =  Ember.$('tbody tr', $table)[0];
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

    let $dateCell = Ember.$.trim($firstRow.children[indexDate()].innerText);
    let myRe = /[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])/;

    // Date format most be YYYY-MM-DD.
    let myArray = myRe.exec($dateCell);

    assert.ok(myArray[0], 'date format is \'YYYY-MM-DD\' ');
  });
});
