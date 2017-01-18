import Ember from 'ember';
import { executeTest, loadingList } from './execute-folv-test';

executeTest('check locale change', (store, assert, app) => {
  assert.expect(12);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let projectionName = Ember.get(controller, 'modelProjection');

    let $folvContainer = Ember.$('.object-list-view-container');
    let $tableInFolvContainer = Ember.$('table.object-list-view thead tr', $folvContainer);
    let dtHeadTable = function(){ return Ember.$('th.dt-head-left.me.class', $tableInFolvContainer); };

    let thArray = dtHeadTable();

    let $toolBar = Ember.$('.ui.secondary.menu')[0];
    let $toolBarButtons = $toolBar.children;

    assert.notEqual($toolBarButtons.length, 0, 'buttons in toolbar exists');
    assert.equal($toolBarButtons[0].innerText, 'Обновить', 'button refresh exist');
    assert.equal($toolBarButtons[1].innerText, 'Добавить', 'button create exist');
    assert.equal($toolBarButtons[2].innerText, 'Удалить', 'button delete exist');
    assert.equal($($toolBarButtons[2]).hasClass('disabled'), true, 'button delete is disabled');

    // En
    let i18n = app.__container__.lookup('service:i18n');
    i18n.set('locale', 'en');

    let timeout = 2000;
    Ember.run.later((function() {
      assert.notEqual($toolBarButtons.length, 0, 'buttons in toolbar exists');
      assert.equal($toolBarButtons[0].innerText, 'Refresh', 'button refresh');
      assert.equal($toolBarButtons[1].innerText, 'Add', 'button create');
      assert.equal($toolBarButtons[2].innerText, 'Delete', 'button delete');
      assert.equal($($toolBarButtons[2]).hasClass('disabled'), true, 'button delete is disabled');

      let attrs= projectionName.attributes;
      let flag = true;

      Object.keys(attrs).forEach(( element, index, array ) => {
        if (attrs[element].kind != 'hasMany')
          flag = flag && ( Ember.$.trim(thArray[index].innerText) == attrs[element].caption);
      });
      assert.ok(flag,'projection = columns names');
    }), timeout);

  });
});
