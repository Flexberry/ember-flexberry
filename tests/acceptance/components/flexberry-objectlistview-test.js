import Ember from 'ember';

import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
// import { Query } from 'ember-flexberry-data';

let app;
let store;
let latestReceivedRecords;

module('Acceptance | flexberry-objectlistview', {
  beforeEach() {

    // Start application.
    app = startApp();

    // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
    let applicationController = app.__container__.lookup('controller:application');
    applicationController.set('isInAcceptanceTestMode', true);
    store = app.__container__.lookup('service:store');
    let originalQueryMethod = store.query;
    store.query = function(...args) {

      // Call original method & remember returned records.
      return originalQueryMethod.apply(this, args).then((records) => {
        latestReceivedRecords = records.toArray();
        return records;
      });
    };
  },

  afterEach() {
    Ember.run(app, 'destroy');
  }
});

test('projectionsAndMarkup flexberry-objectlistview', function(assert) {
  assert.expect(4);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let projectionName = function(){ return Ember.get(controller, 'modelProjection'); };

    // let builder = new Query.Builder(store).from(projectionName.modelName).selectByProjection(projectionName.projectionName);
    // let tesult = store.query(projectionName.modelName, builder.build()).then((suggestions) => {
    //   let suggestionsArr = suggestions.toArray();
    //   assert.notEqual(suggestionsArr.length, 0, 'not 0 object query');
    // });

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

test('perPage flexberry-objectlistview', function(assert) {
  assert.expect(5);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);
    let $folvPerPageButton = Ember.$('.flexberry-dropdown.compact');
    let $menu = Ember.$('.menu', $folvPerPageButton);
    let trTableBody = function(){ return $(Ember.$('tr', 'tbody', '.object-list-view-container')).length.toString(); };
    let activeItem = function(){ return $(Ember.$(".item.active.selected", $menu)).attr("data-value"); };

    // The list should be more than 5 items.
    assert.equal(activeItem(), trTableBody(), "equal perPage and visible element count");
    $folvPerPageButton.click();
    let timeout = 3000;
    Ember.run.later((function() {
      let menuIsVisible = $menu.hasClass("visible");

      assert.strictEqual(menuIsVisible, true, "menu is visible");
      if ( menuIsVisible ){
        let $choosedIthem = Ember.$(".item", $menu);
        $choosedIthem[1].click();

        assert.equal(activeItem(), $($choosedIthem[1]).attr("data-value"), "equal");
        Ember.run.later((function() {
          // The list should be more than 10 items
          assert.equal(activeItem(), trTableBody(), "equal perPage and visible element count");
        }), timeout);
      }
    }), timeout);
  });
});

test('paging flexberry-objectlistview', function(assert) {
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);
    let $basicButtons = Ember.$('.ui.button','.ui.basic.buttons');

    assert.equal($($basicButtons[0]).hasClass('disabled'), true, 'button prev is disabled');
    assert.equal($($basicButtons[1]).hasClass('active'), true, 'page 1 is active');
    $basicButtons[2].click();
    let timeout = 2000;
    Ember.run.later((function() {
      let $basicButtons = Ember.$('.ui.button','.ui.basic.buttons');
      assert.equal($($basicButtons[1]).hasClass('active'), false, 'page 1 is not active');
      assert.equal($($basicButtons[2]).hasClass('active'), true, 'page 2 is active');
    }), timeout);
  });
});

test('toolbar-buttons flexberry-objectlistview', function(assert) {
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);

    let $toolBar = Ember.$('.ui.secondary.menu')[0];
    let $toolBarButtons = Ember.$('.ui.button', $toolBar);

    assert.notEqual($toolBarButtons.length, 0, 'buttons in toolbar exists');
    assert.equal($toolBarButtons[0].innerText, 'Обновить', 'button refresh exist');
    assert.equal($toolBarButtons[1].innerText, 'Добавить', 'button create exist');
    assert.equal($toolBarButtons[2].innerText, 'Удалить', 'button delete exist');
    assert.equal($($toolBarButtons[2]).hasClass('disabled'), true, 'button delete is disabled');

  });
});
