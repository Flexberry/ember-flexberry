import Ember from 'ember';
import { executeTest } from './execute-folv-test';

executeTest('check filter', (store, assert) => {
  assert.expect(1);
  let path = 'components-examples/flexberry-objectlistview/custom-filter';

  // Add records for paging.
  Ember.run(() => {
    visit(path);
    andThen(function() {
      assert.equal(currentPath(), path);

      let $filterButtonDiv = Ember.$('.buttons.filter-active');
      let $filterButton = $filterButtonDiv.children('button');
      let $objectListView = Ember.$('.object-list-view');

      // Activate filtre row.
      $filterButton.click();

      // Select an existing item.
      let filterOperation = Ember.$('.flexberry-dropdown')[0];
      Ember.$(filterOperation).dropdown('set selected', 'eq');

      // Add filtre value.
      let firstObjectFilterValue = $objectListView.find('.ember-text-field')[0];
      fillIn(firstObjectFilterValue, 'dfg');

      let done = assert.async();

      window.setTimeout(() => {
        // Apply filter.
        let refreshButton = Ember.$('.refresh-button')[0];
        refreshButton.click();

        let done1 = assert.async();
        window.setTimeout(() => {
          done1();
        }, 10000);
        done();
      }, 100);
    });
  });
});
