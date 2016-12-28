import Ember from 'ember';
import { Query } from 'ember-flexberry-data';
import moduleForAcceptance from './execute-folv-test';

moduleForAcceptance('check wrapper and projection', (store, assert, app) => {
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

// test('toolbar-buttons flexberry-objectlistview', function(assert) {
//   let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
//   visit(path);
//   andThen(function() {
//     assert.equal(currentPath(), path);
//
//     let $toolBar = Ember.$('.ui.secondary.menu')[0];
//     let $toolBarButtons = $toolBar.children;
//
//     assert.notEqual($toolBarButtons.length, 0, 'buttons in toolbar exists');
//     assert.equal($toolBarButtons[0].innerText, 'Обновить', 'button refresh exist');
//     assert.equal($toolBarButtons[1].innerText, 'Добавить', 'button create exist');
//     assert.equal($toolBarButtons[2].innerText, 'Удалить', 'button delete exist');
//     assert.equal($($toolBarButtons[2]).hasClass('disabled'), true, 'button delete is disabled');
//   });
// });

//Правильность отображения записей (в нужном количестве и со свойствами идущими в порядке, соответствующем заданной проекции)
// test ('view data flexberry-objectlistview', function(assert){
//   let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
//   visit(path);
//   andThen(function() {
//     assert.equal(currentPath(), path);
//
//     let controller = app.__container__.lookup('controller:' + currentRouteName());
//     let projectionName = function(){ return Ember.get(controller, 'modelProjection'); };
//
//     let builder = new Query.Builder(store).from(projectionName.modelName).selectByProjection(projectionName.projectionName);
//     let tesult = store.query(projectionName.modelName, builder.build()).then((suggestions) => {
//       let suggestionsArr = suggestions.toArray();
//       assert.notEqual(suggestionsArr.length, 0, 'not 0 object query');
//     });
//
//   });
// });





// Встраивание компонентов, в ячейки через getCellComponent.
// test('getCellComponent flexberry-objectlistview', function(assert) {
//
// });
