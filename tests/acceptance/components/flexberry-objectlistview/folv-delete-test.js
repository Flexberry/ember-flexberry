import Ember from 'ember';
import { executeTest, loadingList } from './execute-folv-test';

executeTest('check delete and checked', (store, assert, app) => {
  assert.expect(4);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  visit(path + '?perPage=1000');
  andThen(() => {
    assert.equal(currentPath(), path);
    let textForRecord = 'AcceptanceTest';

    // add records for deleting
    Ember.run(() => {
      for (var i = 1; i < 10; i++) {
        let newRecord = store.createRecord('ember-flexberry-dummy-suggestion-type', { name: textForRecord + i });
        newRecord.save();
      }
    });

    let olvContainerClass = '.object-list-view-container';
    let trTableClass = 'table.object-list-view tbody tr';

    let $folvContainer = Ember.$(olvContainerClass);
    let $rows = () => { return Ember.$(trTableClass, $folvContainer).toArray(); } ;

    var recordIsChecked = $rows().reduce(function(sum, current) {
      let nameRecord = Ember.$.trim(current.children[1].innerText);
      let $firstCell = current.children[0].children[1];
      let checkboxInRow = $firstCell.children[0].children[0];
      let checked = true;
      if (nameRecord.indexOf(textForRecord) >= 0){
        checkboxInRow.click();
        checked = (checkboxInRow.className.indexOf('checked') >= 0);
      };
      return sum && checked;
    }, true);

    assert.ok(recordIsChecked, 'Each entry begins with \''+textForRecord+'\' is checked');

    let timeout = 500;
    Ember.run.later((function() {
      let $toolBar = Ember.$('.ui.secondary.menu')[0];
      let $deleteButton = $toolBar.children[2];

      let done = assert.async();
      loadingList($deleteButton, olvContainerClass, trTableClass).then(($list) => {
        function everyRecordIsDelete(element, index, array) {
          let nameRecord = Ember.$.trim(element.children[1].innerText);
          return nameRecord.indexOf(textForRecord) < 0;
        };
        let recordsIsDelete = $rows().every(everyRecordIsDelete);
        assert.ok(recordsIsDelete, 'Each entry begins with \''+textForRecord+'\' is delete');

      }).catch((reason) => {
        throw new Error(reason);
      }).finally(() => {
        done();
      });

    }), timeout);

  });
});
