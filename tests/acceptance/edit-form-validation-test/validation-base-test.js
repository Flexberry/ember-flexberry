import Ember from 'ember';
import { executeTest} from './execute-folv-test';

executeTest('test checking', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $folvContainer = Ember.$('.object-list-view-container');
    let $row = Ember.$('table.object-list-view tbody tr', $folvContainer).first();

    // Мark first record.
    let $firstCell = Ember.$('.object-list-view-helper-column-cell', $row);
    let $checkboxInRow = Ember.$('.flexberry-checkbox', $firstCell);

    $checkboxInRow.click();
    andThen(() => {
      let recordIsChecked = ($checkboxInRow[0].className.indexOf('checked') >= 0);
      assert.ok(recordIsChecked, 'First row is checked');
    });
  });
});
