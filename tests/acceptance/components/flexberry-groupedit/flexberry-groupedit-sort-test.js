import { A } from '@ember/array';
import { run } from '@ember/runloop';
import { module, skip } from 'qunit';
import startApp from '../../../helpers/start-app';

let app;
let flexberryGroupeditComponent;
let store;
const testName = 'sort test';

module('Acceptance | flexberry-groupedit | ' + testName, {
  needs: [
    'model:ember-flexberry-dummy-suggestion'
  ],
  beforeEach() {
    // Start application.
    app = startApp();
    /*flexberryGroupeditComponent = app.__container__.lookup('component:flexberry-groupedit');
    store = app.__container__.lookup('service:store');*/
  },

  afterEach() {
    run(app, 'destroy');
  }
});

skip(testName, (assert) => {
  assert.expect(78);
  let recordArray = new A();

  run(() => {
    recordArray.insertAt(0, store.createRecord(
      'ember-flexberry-dummy-suggestion',
      {
        id: 1,
        address: 'Alphabeth5',
        text: 'Beatrith5',
        date: new Date(2021, 10, 6, 12, 45, 0),
        moderated: false
      }));
    recordArray.insertAt(1, store.createRecord(
      'ember-flexberry-dummy-suggestion',
      {
        id: 2,
        address: 'Alphabeth4',
        text: 'Beatrith4',
        date: new Date(2020, 10, 6, 12, 45, 0),
        moderated: true
      }));
    recordArray.insertAt(2, store.createRecord(
      'ember-flexberry-dummy-suggestion',
      {
        id: 3,
        address: 'Alphabeth3',
        text: 'Beatrith1',
        date: new Date(2022, 10, 6, 12, 45, 0),
        moderated: true
      }));
    recordArray.insertAt(3, store.createRecord(
      'ember-flexberry-dummy-suggestion',
      {
        id: 4,
        address: 'Alphabeth2',
        text: 'Beatrith2',
        date: new Date(2021, 11, 6, 12, 45, 0),
        moderated: true
      }));
    recordArray.insertAt(4, store.createRecord(
      'ember-flexberry-dummy-suggestion',
      {
        id: 5,
        address: 'Alphabeth1',
        text: 'Beatrith3',
        date: new Date(2021, 9, 6, 12, 45, 0),
        moderated: true
      }));
  });

  try {
    let sortResult = flexberryGroupeditComponent.sortRecords(
      recordArray, { propName: 'address', direction: 'asc'}, 0, 4);
    specialArrayCompare(sortResult, [5, 4, 3, 2, 1], assert, 'sortRecords | text | asc');

    sortResult = flexberryGroupeditComponent.sortRecords(
      recordArray, { propName: 'address', direction: 'desc'}, 0, 4);
    specialArrayCompare(sortResult, [1, 2, 3, 4, 5], assert, 'sortRecords | text | desc');

    sortResult = flexberryGroupeditComponent.sortRecords(
      recordArray, { propName: 'address', direction: 'none'}, 0, 4);
    specialArrayCompare(sortResult, [1, 2, 3, 4, 5], assert, 'sortRecords | text | none');

    sortResult = flexberryGroupeditComponent.sortRecords(
      recordArray, { propName: 'date', direction: 'asc'}, 0, 4);
    specialArrayCompare(sortResult, [2, 5, 1, 4, 3], assert, 'sortRecords | date | asc');

    sortResult = flexberryGroupeditComponent.sortRecords(
      recordArray, { propName: 'date', direction: 'desc'}, 0, 4);
    specialArrayCompare(sortResult, [3, 4, 1, 5, 2], assert, 'sortRecords | date | desc');

    sortResult = flexberryGroupeditComponent.sortRecords(
      recordArray, { propName: 'date', direction: 'none'}, 0, 4);
    specialArrayCompare(sortResult, [3, 4, 1, 5, 2], assert, 'sortRecords | date | none');

    sortResult = flexberryGroupeditComponent.sortRecords(
      recordArray, { propName: 'moderated', direction: 'asc'}, 0, 4);
    specialArrayCompare(sortResult, [1, 4, 3, 5, 2], assert, 'sortRecords | boolean | asc');

    sortResult = flexberryGroupeditComponent.sortRecords(
      recordArray, { propName: 'moderated', direction: 'desc'}, 0, 4);
    specialArrayCompare(sortResult, [4, 3, 5, 2, 1], assert, 'sortRecords | boolean | desc');

    sortResult = flexberryGroupeditComponent.sortRecords(
      recordArray, { propName: 'moderated', direction: 'none'}, 0, 4);
    specialArrayCompare(sortResult, [4, 3, 5, 2, 1], assert, 'sortRecords | boolean | none');

    sortResult = flexberryGroupeditComponent.sortRecords(
      recordArray, { propName: 'id', direction: 'asc'}, 0, 4);
    specialArrayCompare(sortResult, [1, 2, 3, 4, 5], assert, 'sortRecords | id | asc');

    sortResult = flexberryGroupeditComponent.sortRecords(
      recordArray, { propName: 'address', direction: 'asc'}, 1, 3);
    specialArrayCompare(sortResult, [1, 4, 3, 2, 5], assert, 'sortRecords | partial sort | asc');

    sortResult = flexberryGroupeditComponent.sortRecords(
      recordArray, { propName: 'address', direction: 'asc'}, 1, 4);
    specialArrayCompare(sortResult, [1, 5, 4, 3, 2], assert, 'sortRecords | partial sort | asc');

    sortResult = flexberryGroupeditComponent.sortRecords(
      recordArray, { propName: 'address', direction: 'desc'}, 0, 3);
    specialArrayCompare(sortResult, [1, 3, 4, 5, 2], assert, 'sortRecords | partial sort | desc');
  }
  finally {
    run(() => {
      recordArray.forEach(currentRecord => {
        store.deleteRecord(currentRecord);
      });
    });
  }

});

function specialArrayCompare(resultArray, compareArray, assert, message) {
  assert.equal(compareArray.length, resultArray.length, message + ' | Length');
  for (let i = 0; i < compareArray.length; i++) {
    assert.equal(compareArray[i], resultArray.objectAt(i).id, message  + ' | Data ' + i);
  }
}
