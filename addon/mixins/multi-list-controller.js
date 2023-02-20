/**
  @module ember-flexberry
*/

import Ember from 'ember';

import serializeSortingParam from '../utils/serialize-sorting-param';

export default Ember.Mixin.create({
  /**
    Updates columns width in multisettings.

    @method setColumnsWidths
    @param {String} componentName Component name.
    @param {Object} columnWidths Current column widths.
  */
  setColumnsWidths(componentName, columnWidths) {
    let settings = this.get(`multiListSettings.${componentName}`);
    if (settings) {
      settings.set('currentColumnsWidths', columnWidths);
    } else {
      this._super(...arguments);
    }
  },

  /**
    Apply user settings to list by name.

    @method userSettingsApply
    @param {String} componentName Component name.
    @param {Object} sorting Current list's sorting.
    @param {Integer} perPage Current list's perPage value.
  */
  userSettingsApply(componentName, sorting, perPage) {
    let settings = this.get(`multiListSettings.${componentName}`);
    settings.set('perPage', perPage || 5);
    settings.set('sorting', sorting);

    let sort = serializeSortingParam(sorting, settings.get('sortDefaultValue'));
    settings.set('sort', sort);
    this.send('reloadListByName', componentName);
  },

  actions: {
    /**
      This action is called when user click on refresh button.

      @method actions.refreshList
      @param {String} componentName Component name.
    */
    refreshList(componentName) {
      this.send('reloadListByName', componentName);
    },

    /**
      Transition to page with number.

      @method actions.gotoPage
      @param {Number} pageNum Number of page.
      @param {String} componentName Component name.
    */
    gotoPage(pageNum, componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      let num = settings.get('_checkPageNumber').apply(settings, [pageNum]);
      settings.set('page', num);
      this.send('reloadListByName', componentName);
    },

    /**
      Transition to next page.

      @method actions.nextPage
      @param {String} componentName Component name.
    */
    nextPage(componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      let page = settings.get('page');
      let nextPage = settings.get('_checkPageNumber').apply(settings, [page + 1]);
      settings.set('page', nextPage);
      this.send('reloadListByName', componentName);
    },

    /**
      Transition to previous page.

      @method actions.previousPage
      @param {String} componentName Component name.
    */
    previousPage(componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      let page = settings.get('page');
      let prevPage = settings.get('_checkPageNumber').apply(settings, [page - 1]);
      settings.set('page', prevPage);
      this.send('reloadListByName', componentName);
    },

    /**
      Sorting list by column.

      @method actions.sortByColumn
      @param {Object} column Column for sorting.
      @param {String} componentName Component name.
      @param {String} sortPath Path to oldSorting.
    */
    sortByColumn: function(column, componentName, sortPath = 'model.sorting') {
      let settings = this.get(`multiListSettings.${componentName}`);
      let propName = column.propName;
      let oldSorting = settings.get(sortPath);
      let newSorting = Ember.A();
      let sortDirection;
      if (oldSorting) {
        sortDirection = 'asc';
        for (let i = 0; i < oldSorting.length; i++) {
          if (oldSorting[i].propName === propName) {
            sortDirection = this._getNextSortDirection(oldSorting[i].direction);
            break;
          }
        }
      } else {
        sortDirection = 'asc';
      }

      newSorting.push({ propName: propName, direction: sortDirection });

      settings.set('sorting', newSorting);
      settings.set(sortPath, newSorting);

      let sortQueryParam = serializeSortingParam(newSorting, settings.get('sortDefaultValue'));
      settings.set('sort', sortQueryParam);
      this.get('_userSettingsService').setCurrentParams(componentName, settings);
      this.send('reloadListByName', componentName);
    },

    /**
      Add column into end list sorting.

      @method actions.addColumnToSorting
      @param {Object} column Column for sorting.
      @param {String} componentName Component name.
      @param {String} sortPath Path to oldSorting.
    */
    addColumnToSorting: function(column, componentName, sortPath = 'model.sorting') {
      let settings = this.get(`multiListSettings.${componentName}`);
      let propName = column.propName;
      let oldSorting = settings.get(sortPath);
      let newSorting = Ember.A();
      let changed = false;

      for (let i = 0; i < oldSorting.length; i++) {
        if (oldSorting[i].propName === propName) {
          let newDirection = this._getNextSortDirection(oldSorting[i].direction);
          newSorting.pushObject({ propName: propName, direction: newDirection });

          changed = true;
        } else {
          newSorting.pushObject(oldSorting[i]);
        }
      }

      if (!changed) {
        newSorting.pushObject({ propName: propName, direction: 'asc' });
      }

      settings.set('sorting', newSorting);
      settings.set(sortPath, newSorting);

      let sortQueryParam = serializeSortingParam(newSorting, settings.get('sortDefaultValue'));
      settings.set('sort', sortQueryParam);
      this.get('_userSettingsService').setCurrentParams(componentName, settings);
      this.send('reloadListByName', componentName);
    },

    /**
      Show usersettings config dialog.

      @method actions.showConfigDialog
      @param {String} componentName Component name.
      @param {String} settingName Current usersetting name.
      @param {Boolean} isExportExcel Indicates when it's export dialog.
      @param {Boolean} immediateExport Indicates when need export witout config dialog.
    */
    showConfigDialog: function(componentName, settingName, isExportExcel = false, immediateExport = false) {
      let settingsSource = this.get(`multiListSettings.${componentName}`);
      this._showConfigDialog(componentName, settingName, settingsSource, isExportExcel, immediateExport);
    },

    /**
      Save filters and refresh list.

      @method actions.applyFilters
      @param {Object} filters Current list's filters.
      @param {String} componentName Component name.
    */
    applyFilters(filters, componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      settings.set('page', 1);
      settings.set('filters', filters);
      this.send('reloadListByName', componentName);
    },

    /**
      Reset filters and refresh list.

      @method actions.resetFilters
      @param {String} componentName Component name.
    */
    resetFilters(componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      settings.set('page', 1);
      settings.set('filters', null);
      this.send('reloadListByName', componentName);
      this.get('objectlistviewEventsService').resetFiltersTrigger(componentName);
    },

    /**
      Changes current pattern for objects filtering.

      @method filterByAnyMatch
      @param {String} pattern A substring that is searched in objects while filtering.
      @param {String} filterCondition Condition for predicate, can be `or` or `and`.
      @param {String} componentName Component name.
      @param {String} filterProjectionName Name of model projection which should be used for filtering throught search-element on toolbar. Filtering is processed only by properties defined in this projection.
    */
    filterByAnyMatch(pattern, filterCondition, componentName, filterProjectionName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      if (settings.get('filter') !== pattern || settings.get('filterCondition') !== filterCondition) {
        let _this = this;
        Ember.run.later((function() {
          settings.setProperties({
            filterCondition: filterCondition,
            filter: pattern,
            page: 1,
            filterProjectionName: filterProjectionName
          });

          _this.send('reloadListByName', componentName);
        }), 50);
      }
    },

    /**
      Switch hierarchical mode.

      @method actions.switchHierarchicalMode
      @param {String} componentName Component name.
    */
    switchHierarchicalMode(componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      settings.toggleProperty('inHierarchicalMode');
      this.send('reloadListByName', componentName);
    },

    /**
      Switch collapse/expand mode.

      @method actions.switchExpandMode
      @param {String} componentName Component name.
    */
    switchExpandMode(componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      settings.toggleProperty('inExpandMode');
      this.send('reloadListByName', componentName);
    },

    /**
      Saves attribute name and switches the mode if necessary.

      @method actions.saveHierarchicalAttribute
      @param {String} hierarchicalAttribute Attribute name to hierarchy build.
      @param {Boolean} refresh If `true`, then switch hierarchical mode.
      @param {String} componentName Component name.
    */
    saveHierarchicalAttribute(hierarchicalAttribute, refresh, componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      if (refresh) {
        let currentHierarchicalAttribute = settings.get('hierarchicalAttribute');
        if (hierarchicalAttribute !== currentHierarchicalAttribute) {
          settings.set('hierarchicalAttribute', hierarchicalAttribute);
          this.send('switchHierarchicalMode', componentName);
        }
      } else {
        settings.set('hierarchicalAttribute', hierarchicalAttribute);
      }
    },

    /**
      Redirect actions into route.

      @method actions.loadRecords
      @param {String} id Record ID.
      @param {ObjectListViewRowComponent} target Instance of {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}}.
      @param {String} property Property name into {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}}.
      @param {Boolean} firstRunMode Flag indicates that this is the first download of data.
      @param {String} componentName Component name.
    */
    loadRecords(id, target, property, firstRunMode, componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      this.send('loadRecordsById', id, target, property, firstRunMode, settings);
    },
  }
});
