/* globals findWithAssert, find, equal */
import Ember from 'ember';

export default function checkOlvConfig() {
  Ember.Test.registerAsyncHelper('checkOlvConfig',
    function(app, olvSelector, context, config = []) {
      const olv = findWithAssert(olvSelector, context);
      const helperCells = find('tbody .object-list-view-helper-column-cell', olv);
      const olvMenu = find('tbody .object-list-view-menu', olv);
      config.forEach(prop => {
        switch (prop) {
          case 'refreshButton':
            findWithAssert('.refresh-button', olv);
            break;
          case 'createNewButton':
            findWithAssert('.create-button', olv);
            break;
          case 'deleteButton':
            findWithAssert('.delete-button', olv);
            break;
          case 'colsConfigButton':
            findWithAssert('.cols-config', olv);
            break;
          case 'exportExcelButton':
            findWithAssert('.export-config', olv);
            break;
          case 'advLimitButton':
            findWithAssert('.adv-limit-config', olv);
            break;
          case '_availableHierarchicalMode':
            findWithAssert('.hierarchical-button .sitemap', olv);
            break;
          case 'availableCollExpandMode':
            findWithAssert('.hierarchical-button .expand', olv);
            break;
          case 'enableFilters':
            findWithAssert('.buttons.filter-active', olv);
            break;
          case 'filterButton':
            findWithAssert('.olv-search', olv);
            break;
          case 'defaultSortingButton':
            findWithAssert('.clear-sorting-button', olv);
            break;
          case 'showCheckBoxInRow':
            findWithAssert('.check-all-at-page-button', olv);
            findWithAssert('.check-all-button', olv);
            const checkBoxes = find('.flexberry-checkbox', helperCells);
            equal(helperCells.length, checkBoxes.length, 'Every row have checkbox');
            break;
          case 'showEditButtonInRow':
            const editButtons = find('.object-list-view-row-edit-button', helperCells);
            equal(helperCells.length, editButtons.length, 'Every row have edit button');
            break;
          case 'showPrototypeButtonInRow':
            const protoButtons = find('.object-list-view-row-prototype-button', helperCells);
            equal(helperCells.length, protoButtons.length, 'Every row have prototype button');
            break;
          case 'showDeleteButtonInRow':
            const deleteButtons = find('.object-list-view-row-delete-button', helperCells);
            equal(helperCells.length, deleteButtons.length, 'Every row have delete button');
            break;
          case 'showEditMenuItemInRow':
            const editMenuButtons = find('.edit-menu', olvMenu);
            equal(olvMenu.length, editMenuButtons.length, 'Every row have edit menu button');
            break;
          case 'showPrototypeMenuItemInRow':
            const protoMenuButtons = find('.prototype-menu', olvMenu);
            equal(olvMenu.length, protoMenuButtons.length, 'Every row have prototype menu button');
            break;
          case 'showDeleteMenuItemInRow':
            const deleteMenuButtons = find('.delete-menu', olvMenu);
            equal(olvMenu.length, deleteMenuButtons.length, 'Every row have delete menu button');
            break;
          default:
            Ember.warn(`Helper checkOlvConfig can't check ${prop} config property`);
        }
      });
    }
  );
}
