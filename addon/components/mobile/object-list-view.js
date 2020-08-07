/**
  @module ember-flexberry
*/

import Ember from 'ember';
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
  _selectedMobileMenu: Ember.computed('selectedRecords.length', 'allSelect', function() {
    return this.get('selectedRecords.length') > 0 || this.get('allSelect');
  }),

  /**
    Count selected row for mobile menu.
    @property _selectedCountMobileMenu
    @type Number
    @readOnly
  */
  _selectedCountMobileMenu: Ember.computed('selectedRecords.length', 'allSelect', function() {
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
  singleColumnCellComponent: {
    componentName: 'object-list-view-single-column-cell',
    componentProperties: null
  },

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
  colspan: Ember.computed('columns.length', 'showHelperColumn', 'showMenuColumn', function() {
    let columnsCount = 1;
    if (this.get('showHelperColumn')) {
      columnsCount += 1;
    }

    if (this.get('showMenuColumn')) {
      columnsCount += 1;
    }

    return columnsCount;
  }),

  /**
    @property checkRowsSettingsItems
    @readOnly
  */
  checkRowsSettingsItems: Ember.computed(
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
        icon: 'icon-guideline-check-menu icon',
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
      @public
    */
    deleteSelectedRow() {
      let confirmDeleteRows = this.get('confirmDeleteRows');
      if (confirmDeleteRows) {
        Ember.assert('Error: confirmDeleteRows must be a function.', typeof confirmDeleteRows === 'function');
        if (!confirmDeleteRows()) {
          return;
        }
      }

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

    /**
      Clear selected rows.
      @method actions.clearSelectedRecords
      @public
    */
    clearSelectedRecords() {
      if (this.get('allSelect')) {
        this.send('checkAll');
      }

      let componentName = this.get('componentName');
      let contentWithKeys = this.get('contentWithKeys');
      let selectedRecords = this.get('selectedRecords');
      let selectedRows = contentWithKeys.filterBy('selected', true);
      for (let i = 0; i < selectedRows.length; i++) {
        let recordWithKey = selectedRows[i];
        let selectedRow = this._getRowByKey(recordWithKey.key);

        if (selectedRow.hasClass('active')) {
          selectedRow.removeClass('active');
        }

        selectedRecords.removeObject(recordWithKey.data);
        recordWithKey.set('selected', false);

        this.get('objectlistviewEventsService').rowSelectedTrigger(componentName, recordWithKey.data, selectedRecords.length, false, recordWithKey);
      }
    },
  }
});
