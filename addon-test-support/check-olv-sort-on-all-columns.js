import { registerAsyncHelper } from '@ember/test';
import { getHeaderSort } from './utils/check-olv-sort-function';

registerAsyncHelper('checkOlvSortOnAllColumns',
  function(app, olvSelector, context, assert) {
    const helpers = app.testHelpers;
    const olv = helpers.findWithAssert(olvSelector, context);
    const headCells = helpers.find('thead .dt-head-left', olv).toArray();

    if (headCells.length > 0) {
      helpers.click('.ui.clear-sorting-button');
      helpers.andThen(() => {
        checkColumns(headCells, 0, olv, helpers, assert);
      });
    } else {
      throw new Error(`Helper checkOlvSortOnAllColumns can't check empty list`);
    }
  }
);

let checkColumns = function(headCells, index, olv, helpers, assert) {
  const headCell = headCells[index];

  helpers.triggerEvent(headCell, 'click', { ctrlKey: true });
  helpers.andThen(() => {
    const sortValue = getHeaderSort(olv, index, helpers);
    assert.equal('▲', sortValue.icon, 'Sorting icon is not correct');
    assert.equal(index + 1, sortValue.index, 'Sorting index is not correct');

    helpers.triggerEvent(headCell, 'click', { ctrlKey: true });
    helpers.andThen(() => {
      const sortValue = getHeaderSort(olv, index, helpers);
      assert.equal('▼', sortValue.icon, 'Sorting icon is not correct');
      assert.equal(index + 1, sortValue.index, 'Sorting index is not correct');

      if (index !== headCells.length - 1) {
        checkColumns(headCells, index + 1, olv, helpers, assert);
      }
    });
  });
};
