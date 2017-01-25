import Ember from 'ember';
import { executeTest, loadingList } from './execute-folv-test';

executeTest('check delete and checked', (store, assert, app) => {
  assert.expect(5);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';

  let textForRecordToolBarBtn = 'AcceptanceTestToolBarBtn';
  let textForRecordBtnInRow = 'AcceptanceTestBtnInRow';
  let howAddRec = 10;

  // Add records for deliting.
  Ember.run(() => {
    for (var i = 0; i < howAddRec; i++) {
      let nameText = i % 2 ? textForRecordToolBarBtn : textForRecordBtnInRow;
      let newRecord = store.createRecord('ember-flexberry-dummy-suggestion-type', { name: nameText + i });
      newRecord.save();
    }
  });

  visit(path + '?perPage=1000');
  andThen(() => {
    assert.equal(currentPath(), path);
    let olvContainerClass = '.object-list-view-container';
    let trTableClass = 'table.object-list-view tbody tr';

    let $folvContainer = Ember.$(olvContainerClass);
    let $rows = () => { return Ember.$(trTableClass, $folvContainer).toArray(); };

    // Check that the records have been added.
    let recordIsForDeleting = $rows().reduce((sum, current) => {
      let nameRecord = Ember.$.trim(current.children[1].innerText);
      let flag = (nameRecord.indexOf(textForRecordToolBarBtn) >= 0 || nameRecord.indexOf(textForRecordBtnInRow) >= 0);
      return sum + flag;
    }, 0);

    assert.equal(recordIsForDeleting, howAddRec, howAddRec + ' records added');

    // Delete via a row button.
    $rows().forEach((element, i, arr) => {
      let nameRecord = Ember.$.trim(element.children[1].innerText);
      if (nameRecord.indexOf(textForRecordBtnInRow) >= 0) {
        let $firstCell = element.children[0].children[1];
        let $deleteBtnInRow = $firstCell.children[1].children[0];
        $deleteBtnInRow.click();
      }
    });

    // Check that the records have been removed.
    let recordsIsDeleteBtnInRow = $rows().every((element) => {
      let nameRecord = Ember.$.trim(element.children[1].innerText);
      return nameRecord.indexOf(textForRecordBtnInRow) < 0;
    });

    assert.ok(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + textForRecordBtnInRow + '\' is delete with button in row');

    // Мark records.
    let recordIsChecked = $rows().reduce((sum, current) => {
      let nameRecord = Ember.$.trim(current.children[1].innerText);
      let $firstCell = current.children[0].children[1];
      let checkboxInRow = $firstCell.children[0].children[0];
      let checked = true;
      if (nameRecord.indexOf(textForRecordToolBarBtn) >= 0) {
        checkboxInRow.click();
        checked = (checkboxInRow.className.indexOf('checked') >= 0);
      }

      return sum && checked;
    }, true);

    assert.ok(recordIsChecked, 'Each entry begins with \'' + textForRecordToolBarBtn + '\' is checked');

    let $toolBar = Ember.$('.ui.secondary.menu')[0];
    let $deleteButton = $toolBar.children[2];
    let done = assert.async();

    // Delete the marked records.
    loadingList($deleteButton, olvContainerClass, trTableClass).then(($list) => {
      let recordsIsDelete = $rows().every((element) => {
        let nameRecord = Ember.$.trim(element.children[1].innerText);
        return nameRecord.indexOf(textForRecordToolBarBtn) < 0;
      });

      assert.ok(recordsIsDelete, 'Each entry begins with \'' + textForRecordToolBarBtn + '\' is delete with button in toolbar button');

    }).catch((reason) => {
      throw new Error(reason);
    }).finally(() => {
      done();
    });

  });
});
