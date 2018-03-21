import Ember from 'ember';
import { executeTest} from './execute-folv-test';
import { Query } from 'ember-flexberry-data';

executeTest('check configurate selected rows', (store, assert, app) => {
  assert.expect(8);
  let path = 'components-examples/flexberry-objectlistview/selected-rows';
  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let count;

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let builder = new Query.Builder(store).from(modelName);
    store.query(modelName, builder.build()).then((result) => {
      let arr = result.toArray();
      count = arr.length;
    }).then(function() {
      let $folvContainer = Ember.$('.object-list-view-container');
      let $checkAllButtton = Ember.$('.check-all-button', $folvContainer).first();
      let $checkAllAtPageButton = Ember.$('.check-all-at-page-button', $folvContainer).first();
      let $row = Ember.$('table.object-list-view tbody tr', $folvContainer);
      let controller = app.__container__.lookup('controller:' + currentRouteName());

      let $firstCell = Ember.$('.flexberry-checkbox', $row[0]);
      let $secondCell = Ember.$('.flexberry-checkbox', $row[1]);

      // Сheck first record.
      $firstCell.click();
      assert.equal(controller.countSelectedRows, 1, 'First row is checked');

      // Сheck second record.
      $secondCell.click();
      assert.equal(controller.countSelectedRows, 2, 'Second row is checked');

      // Uncheck second record.
      $firstCell.click();
      assert.equal(controller.countSelectedRows, 1, 'First row is checked');

      // Сheck all record at page.
      $checkAllAtPageButton.click();
      assert.equal(controller.countSelectedRows, 5, 'First row is checked');

      // Uncheck all record at page.
      $checkAllAtPageButton.click();
      assert.equal(controller.countSelectedRows, 0, 'First row is checked');

      // Сheck fist reccord and all record.
      $firstCell.click();
      $checkAllButtton.click();
      assert.equal(controller.countSelectedRows, count, 'First row is checked');

      // Uncheck all record.
      $checkAllButtton.click();
      assert.equal(controller.countSelectedRows, 0, 'First row is checked');
    });
  });
});
