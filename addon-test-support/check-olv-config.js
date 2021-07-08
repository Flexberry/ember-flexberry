import { registerAsyncHelper } from '@ember/test';

registerAsyncHelper('checkOlvConfig',
  function(app, olvSelector, context, assert, config = []) {
    const helpers = app.testHelpers;
    const olv = helpers.findWithAssert(olvSelector, context);
    const helperCells = helpers.find('tbody .object-list-view-helper-column-cell', olv);
    const olvMenu = helpers.find('tbody .object-list-view-menu', olv);
    let checkBoxes;
    let editButtons;
    let protoButtons;
    let deleteButtons;
    let editMenuButtons;
    let protoMenuButtons;
    let deleteMenuButtons;
    config.forEach(prop => {
      switch (prop) {
        case 'refreshButton':
          helpers.findWithAssert('.refresh-button', olv);
          break;
        case 'createNewButton':
          helpers.findWithAssert('.create-button', olv);
          break;
        case 'deleteButton':
          helpers.findWithAssert('.delete-button', olv);
          break;
        case 'colsConfigButton':
          helpers.findWithAssert('.cols-config', olv);
          break;
        case 'exportExcelButton':
          helpers.findWithAssert('.export-config', olv);
          break;
        case 'advLimitButton':
          helpers.findWithAssert('.adv-limit-config', olv);
          break;
        case '_availableHierarchicalMode':
          helpers.findWithAssert('.hierarchical-button .sitemap', olv);
          break;
        case 'availableCollExpandMode':
          helpers.findWithAssert('.hierarchical-button .expand', olv);
          break;
        case 'enableFilters':
          helpers.findWithAssert('.buttons.filter-active', olv);
          break;
        case 'filterButton':
          helpers.findWithAssert('.olv-search', olv);
          break;
        case 'defaultSortingButton':
          helpers.findWithAssert('.clear-sorting-button', olv);
          break;
        case 'showCheckBoxInRow':
          helpers.findWithAssert('.check-all-at-page-button', olv);
          helpers.findWithAssert('.check-all-button', olv);
          checkBoxes = helpers.find('.flexberry-checkbox', helperCells);
          assert.equal(helperCells.length, checkBoxes.length, 'Every row have checkbox');
          break;
        case 'showEditButtonInRow':
          editButtons = helpers.find('.object-list-view-row-edit-button', helperCells);
          assert.equal(helperCells.length, editButtons.length, 'Every row have edit button');
          break;
        case 'showPrototypeButtonInRow':
          protoButtons = helpers.find('.object-list-view-row-prototype-button', helperCells);
          assert.equal(helperCells.length, protoButtons.length, 'Every row have prototype button');
          break;
        case 'showDeleteButtonInRow':
          deleteButtons = helpers.find('.object-list-view-row-delete-button', helperCells);
          assert.equal(helperCells.length, deleteButtons.length, 'Every row have delete button');
          break;
        case 'showEditMenuItemInRow':
          editMenuButtons = helpers.find('.edit-menu', olvMenu);
          assert.equal(olvMenu.length, editMenuButtons.length, 'Every row have edit menu button');
          break;
        case 'showPrototypeMenuItemInRow':
          protoMenuButtons = helpers.find('.prototype-menu', olvMenu);
          assert.equal(olvMenu.length, protoMenuButtons.length, 'Every row have prototype menu button');
          break;
        case 'showDeleteMenuItemInRow':
          deleteMenuButtons = helpers.find('.delete-menu', olvMenu);
          assert.equal(olvMenu.length, deleteMenuButtons.length, 'Every row have delete menu button');
          break;
        default:
          throw new Error(`Helper checkOlvConfig can't check ${prop} config property`);
      }
    });
  }
);
