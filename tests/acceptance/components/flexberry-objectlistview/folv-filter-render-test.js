import Ember from 'ember';
import { executeTest } from './execute-folv-test';

executeTest('check filter renders', (store, assert) => {
  assert.expect(34);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-filter';

  Ember.run(() => {
    visit(path);
    andThen(function() {
      assert.equal(currentPath(), path);

      let $filterButtonDiv = Ember.$('.buttons.filter-active');
      let $filterButton = $filterButtonDiv.children('button');
      let $filterRemoveButton = $filterButtonDiv.children('.removeFilter-button');
      let $filterButtonIcon = $filterButton.children('i');

      let $table = Ember.$('.object-list-view');
      let $tableTbody = $table.children('tbody');
      let $tableRows = $tableTbody.children('tr');

      // Check filtre button div.
      assert.strictEqual($filterButtonDiv.prop('tagName'), 'DIV', 'Filtre button\'s wrapper is a <div>');
      assert.strictEqual($filterButtonDiv.hasClass('ui icon buttons'), true, 'Filtre button\'s wrapper has \'ui icon buttons\' css-class');
      assert.strictEqual($filterButtonDiv.hasClass('filter-active'), true, 'Filtre button\'s wrapper has \'filter-active\' css-class');
      assert.strictEqual($filterButtonDiv.length === 1, true, 'Component has filter button');

      // Check filtre button.
      assert.strictEqual($filterButton.length === 1, true, 'Filtre button has inner button block');
      assert.strictEqual($filterButton.hasClass('ui button'), true, 'Filtre button\'s wrapper has \'ui button\' css-class');
      assert.strictEqual($filterButton[0].title, 'Добавить фильтр', 'Filtre button has title');
      assert.strictEqual($filterButton.prop('tagName'), 'BUTTON', 'Component\'s inner button block is a <button>');

      // Check button's icon <i>.
      assert.strictEqual($filterButtonIcon.length === 1, true, 'Filtre button\'s title has icon block');
      assert.strictEqual($filterButtonIcon.prop('tagName'), 'I', 'Filtre button\'s icon block is a <i>');
      assert.strictEqual($filterButtonIcon.hasClass('filter icon'), true, 'Filtre button\'s icon block has \'filter icon\' css-class');

      // Check filtre remove button.
      assert.strictEqual($filterRemoveButton.length === 0, true, 'Component hasn\'t remove filter button');

      // Check filtre row.
      assert.strictEqual($tableRows .length === 5, true, 'Filtre row aren\'t active');

      let $objectListView = Ember.$('.object-list-view');

      // Activate filtre row.
      $filterButton.click();

      $tableRows = $tableTbody.children('tr');

      // Check filtre row afther filter active.
      assert.strictEqual($tableRows.length === 7, true, 'Filtre row aren\'t active');

      // Select an existing item.
      let filterOperation = Ember.$('.flexberry-dropdown')[0];
      Ember.$(filterOperation).dropdown('set selected', 'eq');

      // Add filtre value.
      let firstObjectFilterValue = $objectListView.find('.ember-text-field')[0];
      fillIn(firstObjectFilterValue, 'A value that will never be told');

      let done = assert.async();
      window.setTimeout(() => {

        // Apply filter.
        let refreshButton = Ember.$('.refresh-button')[0];
        refreshButton.click();

        let done1 = assert.async();
        window.setTimeout(() => {
          $filterButtonDiv = Ember.$('.buttons.filter-active');
          $filterButton = $filterButtonDiv.children('.button.active');
          $filterButtonIcon = $filterButton.children('i');
          $filterRemoveButton = $filterButtonDiv.children('.removeFilter-button');
          let $filterRemoveButtonIcon = $filterRemoveButton.children('i');

          // Check filtre button div.
          assert.strictEqual($filterButtonDiv.prop('tagName'), 'DIV', 'Filtre button\'s wrapper is a <div>');
          assert.strictEqual($filterButtonDiv.hasClass('ui icon buttons'), true, 'Filtre button\'s wrapper has \'ui icon buttons\' css-class');
          assert.strictEqual($filterButtonDiv.hasClass('filter-active'), true, 'Filtre button\'s wrapper has \'filter-active\' css-class');
          assert.strictEqual($filterButtonDiv.length === 1, true, 'Component has filter button');

          // Check filtre button.
          assert.strictEqual($filterButton.length === 1, true, 'Filtre button has inner button block');
          assert.strictEqual($filterButton.hasClass('ui button'), true, 'Filtre button\'s wrapper has \'ui button\' css-class');
          assert.strictEqual($filterButton[0].title, 'Добавить фильтр', 'Filtre button has title');
          assert.strictEqual($filterButton.prop('tagName'), 'BUTTON', 'Component\'s inner button block is a <button>');

          // Check button's icon <i>.
          assert.strictEqual($filterButtonIcon.length === 1, true, 'Filtre button\'s title has icon block');
          assert.strictEqual($filterButtonIcon.prop('tagName'), 'I', 'Filtre button\'s icon block is a <i>');
          assert.strictEqual($filterButtonIcon.hasClass('filter icon'), true, 'Filtre button\'s icon block has \'filter icon\' css-class');

          // Check filtre remove button.
          assert.strictEqual($filterRemoveButton.length === 1, true, 'Filtre remove button has inner button block');
          assert.strictEqual($filterRemoveButton.hasClass('ui button'), true, 'Filtre remove button\'s wrapper has \'ui button\' css-class');
          assert.strictEqual($filterRemoveButton[0].title, 'Сбросить фильтр', 'Filtre remove button has title');
          assert.strictEqual($filterRemoveButton.prop('tagName'), 'BUTTON', 'Component\'s inner button block is a <button>');

          // Check remove button's icon <i>.
          assert.strictEqual($filterRemoveButtonIcon.length === 1, true, 'Filtre button\'s title has icon block');
          assert.strictEqual($filterRemoveButtonIcon.prop('tagName'), 'I', 'Filtre button\'s icon block is a <i>');
          assert.strictEqual($filterRemoveButtonIcon.hasClass('remove icon'), true, 'Filtre button\'s icon block has \'remove icon\' css-class');

          // Deactivate filtre row.
          $filterButton.click();

          let done2 = assert.async();
          window.setTimeout(() => {
            $tableRows = $tableTbody.children('tr');

            // Check filtre row afther filter deactivate.
            assert.strictEqual($tableRows.length === 1, true, 'Filtre row aren\'t deactivate');
            done2();
          }, 100);
          done1();
        }, 1000);
        done();
      }, 100);
    });
  });
});
