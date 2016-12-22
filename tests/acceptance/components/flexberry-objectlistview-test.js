import Ember from 'ember';

import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import { Query } from 'ember-flexberry-data';

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

//Правильное формирование разметки и в зависимости от возможных настроек
//(столбцы и их заголовки в зависимости от заданной проекции, наличие тех или иных кнопок и пунктов меню)
test('projectionsAndMarkup flexberry-objectlistview', function(assert) {
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

test('toolbar-buttons flexberry-objectlistview', function(assert) {
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);

    let $toolBar = Ember.$('.ui.secondary.menu')[0];
    let $toolBarButtons = $toolBar.children;

    assert.notEqual($toolBarButtons.length, 0, 'buttons in toolbar exists');
    assert.equal($toolBarButtons[0].innerText, 'Обновить', 'button refresh exist');
    assert.equal($toolBarButtons[1].innerText, 'Добавить', 'button create exist');
    assert.equal($toolBarButtons[2].innerText, 'Удалить', 'button delete exist');
    assert.equal($($toolBarButtons[2]).hasClass('disabled'), true, 'button delete is disabled');
  });
});

//Правильность отображения записей (в нужном количестве и со свойствами идущими в порядке, соответствующем заданной проекции)
test ('view data flexberry-objectlistview', function(assert){
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let projectionName = function(){ return Ember.get(controller, 'modelProjection'); };

    let builder = new Query.Builder(store).from(projectionName.modelName).selectByProjection(projectionName.projectionName);
    let tesult = store.query(projectionName.modelName, builder.build()).then((suggestions) => {
      let suggestionsArr = suggestions.toArray();
      assert.notEqual(suggestionsArr.length, 0, 'not 0 object query');
    });

  });
});

//Правильность работы сортировки по различным типам полей.
test ('sorting symbol flexberry-objectlistview', function(assert){
  assert.expect(7);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);

    let $olv = Ember.$('.object-list-view ');
    let th = function(item){ return Ember.$('th.dt-head-left', $olv)[item]; };

    assert.equal( th(0).children[0].children.length, 1, 'not ordr' );
    $(th(0)).click();
    let timeout = 2000;

    Ember.run.later((function() {
      let ord = function(){ return Ember.$(th(0).children[0].children[1].children[0]); };
      assert.equal( ord().attr('title'), 'Order ascending', 'title is Order ascending' );
      assert.equal( Ember.$.trim(ord().text()), String.fromCharCode('9650')+'1', 'sorting symbol added' );
      $(th(0)).click();

      Ember.run.later((function() {
        assert.equal( ord().attr('title'), 'Order descending', 'title is Order descending' );
        assert.equal( Ember.$.trim(ord().text()), String.fromCharCode('9660')+'1', 'sorting symbol changed' );
        $(th(0)).click();

        Ember.run.later((function() {
          assert.equal( th(0).children[0].children.length, 1, 'not ordr' );
        }), timeout);

      }), timeout);

    }), timeout);
  });
});

//Правильность работы пейджинга и переключателя количества отображаемых записей.
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

//Правильность работы пейджинга и переключателя количества отображаемых записей.
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

let openEditForm = function($trTableBody, path) {
  return new Ember.RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;
    let timeout = 10000;
    let $cell = $trTableBody[0].children[1];
    // Try to open lookup dialog.
    Ember.run(() => {
      $cell.click();
    });
    // Wait for lookup dialog to be opened & data loaded.
    Ember.run(() => {
      checkIntervalId = window.setInterval(() => {
        let $editForm = Ember.$('form');
        let $fields = Ember.$('.field', $editForm);
        if ($fields.length === 0) {
          // Data isn't loaded yet.
          return;
        }
        // Data is loaded.
        // Stop interval & resolve promise.
        window.clearInterval(checkIntervalId);
        checkIntervalSucceed = true;
        resolve($editForm);
      }, checkInterval);
    });

    // Set wait timeout.
    Ember.run(() => {
      window.setTimeout(() => {
        if (checkIntervalSucceed) {
          return;
        }
        // Time is out.
        // Stop intervals & reject promise.
        window.clearInterval(checkIntervalId);
        reject('editForm load operation is timed out');
      }, timeout);
    });
  });
};

let setController = function(controller, propName, propVal) {
  return new Ember.RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;
    let timeout = 10000;
    //let $cell = $trTableBody[0].children[1];
    // Try to open lookup dialog.
    Ember.run(() => {
      controller.set(propName, propVal);
    });
    // Wait for lookup dialog to be opened & data loaded.
    Ember.run(() => {
      checkIntervalId = window.setInterval(() => {
        let $editForm = Ember.$('form');
        let $fields = Ember.$('.field', $editForm);
        if ($fields.length === 0) {
          // Data isn't loaded yet.
          return;
        }
        // Data is loaded.
        // Stop interval & resolve promise.
        window.clearInterval(checkIntervalId);
        checkIntervalSucceed = true;
        resolve($editForm);
      }, checkInterval);
    });

    // Set wait timeout.
    Ember.run(() => {
      window.setTimeout(() => {
        if (checkIntervalSucceed) {
          return;
        }
        // Time is out.
        // Stop intervals & reject promise.
        window.clearInterval(checkIntervalId);
        reject('editForm load operation is timed out');
      }, timeout);
    });
  });
};

//Переход к формам редактирования
test('edit form flexberry-objectlistview', function(assert) {
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  // let controller = app.__container__.lookup('controller:' + 'components-acceptance-tests/flexberry-objectlistview/base-operations');
  // controller.set('model', 'ember-flexberry-dummy-suggestion-type');
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $trTableBody = Ember.$('tr', 'tbody', '.object-list-view-container');

    assert.equal(currentPath(), path, 'edit form not open');
    controller.set('rowClickable', true);

    let asyncOperationsCompleted = assert.async();

    openEditForm($trTableBody, path).then(($editForm) => {
      assert.ok($editForm, 'edit form open');
      assert.equal(currentPath(), 'ember-flexberry-dummy-suggestion-edit', 'edit form path');
    }).catch((reason) => {
      throw new Error(reason);
    }).finally(() => {
      asyncOperationsCompleted();
    });


    let $cell = $trTableBody[0].children[1];
    $cell.click();

    // let projectionName = Ember.get(controller, 'modelProjection');
    // controller.set('modelProjection', 'SuggestionTypeL');
    let timeout = 2000;
    Ember.run.later((function() {
      assert.equal(currentPath(), path, 'edit form not open');
      controller.set('rowClickable', true);
      Ember.run.later((function() {
        $cell.click();
        Ember.run.later((function() {
          assert.equal(currentPath(), 'ember-flexberry-dummy-suggestion-edit', 'edit form open');
        }), timeout);
      }), timeout);
    }), timeout);
  });
});

//Переход к формам редактирования
test('open new edit form flexberry-objectlistview', function(assert) {
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);
    let $toolBar = Ember.$('.ui.secondary.menu')[0];
    let $toolBarButtons = $toolBar.children;

    $toolBarButtons[1].click();
    let timeout = 2000;
    Ember.run.later((function() {
      assert.equal(currentPath(), 'ember-flexberry-dummy-suggestion-edit.new', 'new form open');
    }), timeout);
  });
});

// Встраивание компонентов, в ячейки через getCellComponent.
// test('getCellComponent flexberry-objectlistview', function(assert) {
//
// });
