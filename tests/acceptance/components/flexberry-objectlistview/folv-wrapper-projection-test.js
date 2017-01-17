import Ember from 'ember';
import { executeTest } from './execute-folv-test';

executeTest('check wrapper and projection', (store, assert, app) => {
  assert.expect(4);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let projectionName = function(){ return Ember.get(controller, 'modelProjection'); };

    let $folvContainer = Ember.$('.object-list-view-container');
    let $tableInFolvContainer = Ember.$('table', $folvContainer);
    assert.equal($tableInFolvContainer.length, 1, 'folv table in container exist');

    let $tableBody = Ember.$('tbody', '.object-list-view-container');
    assert.equal($tableBody.length, 1, 'tbody in table exist');

    let dtHeadTable = function(){ return Ember.$('.dt-head-left.me.class', 'thead', $tableInFolvContainer); };
    assert.equal(dtHeadTable().length, Object.keys(projectionName().attributes).length, 'the number of columns in the table corresponds to the projection');

    controller.set('modelProjection', 'SettingLookupExampleView');
    let timeout = 2000;
    Ember.run.later((function() {
      // not work.
      assert.equal(dtHeadTable().length, Object.keys(projectionName().attributes).length, 'the number of columns in the table corresponds to the projection');
    }), timeout);
  });
});

// Встраивание компонентов, в ячейки через getCellComponent.
// test('getCellComponent flexberry-objectlistview', function(assert) {
//
// });
