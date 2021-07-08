/**
  @module ember-flexberry
*/

import { Promise } from 'rsvp';

import { assert } from '@ember/debug';
import { computed  } from '@ember/object';
import ObjectListViewComponent from '../object-list-view';

/**
  Mobile version of {{#crossLink "ObjectListViewComponent"}}{{/crossLink}} (with mobile-specific defaults).

  @class Mobile.ObjectListViewComponent
  @extends ObjectListViewComponent
*/
export default ObjectListViewComponent.extend({
  /**
    Flag indicates whether visible selected menu for mobile.

    @private
    @property _selectedMobileMenu
    @type Boolean
    @readOnly
  */
  _selectedMobileMenu: computed('selectedRecords.length', 'allSelect', function() {
    return this.get('selectedRecords.length') > 0 || this.get('allSelect');
  }),

  /**
    Count selected row for mobile menu.

    @private
    @property _selectedCountMobileMenu
    @type Number
    @readOnly
  */
  _selectedCountMobileMenu: computed('selectedRecords.length', 'allSelect', function() {
    if (this.get('allSelect')) {
      return this.get('recordsTotalCount');
    }

    return this.get('selectedRecords.length');
  }),

  /**
    Flag indicates whether allow to resize columns (if `true`) or not (if `false`).

    @property allowColumnResize
    @type Boolean
    @default false
  */
  allowColumnResize: false,

  /**
    Default cell component that will be used to display values in single column.

    @property {Object} singleColumnCellComponent
    @property {String} [singleColumnCellComponent.componentName='object-list-view-single-column-cell']
    @property {String} [singleColumnCellComponent.componentProperties=null]
  */
  singleColumnCellComponent: undefined,

  /**
    Header title of middlee column.

    @property singleColumnHeaderTitle
    @type String
  */
  singleColumnHeaderTitle: undefined,

  /**
    Total columns count (including additional columns).

    @property colspan
    @type Number
    @readOnly
  */
  colspan: computed('columns.length', 'showHelperColumn', 'showMenuColumn', function() {
    let columnsCount = 1;
    if (this.get('showHelperColumn')) {
      columnsCount += 1;
    }

    if (this.get('showMenuColumn')) {
      columnsCount += 1;
    }

    return columnsCount;
  }),

  init() {
    this._super(...arguments);
    this.set('singleColumnCellComponent', {
      componentName: 'object-list-view-single-column-cell',
      componentProperties: null
    });
  },

  /**
    @private
    @property _checkRowsSettingsItems
    @readOnly
  */
  _checkRowsSettingsItems: computed(
    'i18n.locale',
    'userSettingsService.isUserSettingsServiceEnabled',
    'readonly',
    'allSelect',
    'allSelectAtPage',
    function() {
      let i18n = this.get('i18n');
      let readonly = this.get('readonly');
      let allSelect = this.get('allSelect');

      let rootItem = {
        icon: 'dropdown icon',
        iconAlignment: 'right',
        title: '',
        items: [],
        localeKey: ''
      };

      let isUncheckAllAtPage = this.get('allSelectAtPage');
      let checkAllAtPageTitle = isUncheckAllAtPage ? i18n.t('components.olv-toolbar.uncheck-all-at-page-button-text') :
      i18n.t('components.olv-toolbar.check-all-at-page-button-text');
      let checkAllAtPageTitleKey = isUncheckAllAtPage ? 'components.olv-toolbar.uncheck-all-at-page-button-text' :
      'components.olv-toolbar.check-all-at-page-button-text';

      let checkAllTitle = allSelect ? i18n.t('components.olv-toolbar.uncheck-all-button-text') :
      i18n.t('components.olv-toolbar.check-all-button-text');
      let checkAllTitleKey = allSelect ? 'components.olv-toolbar.uncheck-all-button-text' :
      'components.olv-toolbar.check-all-button-text';

      if (!readonly) {
        if (!allSelect) {
          rootItem.items.push({
            title: checkAllAtPageTitle,
            localeKey: checkAllAtPageTitleKey
          });
        }

        let classNames = this.get('classNames');
        if (classNames && classNames.indexOf('groupedit-container') === -1) {
          rootItem.items.push({
            title: checkAllTitle,
            localeKey: checkAllTitleKey
          });
        }
      }

      return this.get('userSettingsService').isUserSettingsServiceEnabled ? [rootItem] : [];
    }
  ),

  actions: {
    /**
      Delete selected rows.

      @method actions.deleteSelectedRow
    */
    deleteSelectedRow() {
      let confirmDeleteRows = this.get('confirmDeleteRows');
      let possiblePromise = null;

      if (confirmDeleteRows) {
        assert('Error: confirmDeleteRows must be a function.', typeof confirmDeleteRows === 'function');

        possiblePromise = confirmDeleteRows();

        if ((!possiblePromise || !(possiblePromise instanceof Promise))) {
          return;
        }
      }

      if (possiblePromise || (possiblePromise instanceof Promise)) {
        possiblePromise.then(() => {
          this._confirmDeleteRows();
        });
      } else {
        this._confirmDeleteRows();
      }
    },

    /**
      Clear selected rows.

      @method actions.clearSelectedRecords
    */
    clearSelectedRecords() {
      if (this.get('allSelect')) {
        this.send('checkAll');
      } else {
        const contentWithKeys = this.get('contentWithKeys');
        this.get('selectedRecords').map((record) => contentWithKeys.findBy('data', record)).forEach((modelWithKey) => {
          modelWithKey.set('selected', false);
          this.send('selectRow', modelWithKey, { checked: false });
        });
      }
    },
  },

  /**
    @private
    @method _confirmDeleteRows
  */
  _confirmDeleteRows() {
    let componentName = this.get('componentName');

    if (!this.get('allSelect')) {
      this._deleteRows(componentName, true);
    } else {
      let filterQuery = {
        predicate: this.get('currentController.filtersPredicate'),
        modelName: this.get('modelProjection.modelName')
      };

      this._deleteAllRows(componentName, filterQuery);
    }
  },
});
