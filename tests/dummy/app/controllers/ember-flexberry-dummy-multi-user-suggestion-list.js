import Ember from 'ember';
import ListFormController from 'ember-flexberry/controllers/list-form';
import ReloadListMixin from 'ember-flexberry/mixins/reload-list-mixin';
import ListParameters from 'ember-flexberry/objects/list-parameters';
import serializeSortingParam from 'ember-flexberry/utils/serialize-sorting-param';

export default ListFormController.extend(ReloadListMixin, {
  /**
    Service for managing the state of the application.

    @property appState
    @type AppStateService
  */
  appState: Ember.inject.service(),

  reloadListByName(componentName) {
    this.get('appState').loading();
    let queryParameters = new ListParameters(this.get(`multiListSettings.${componentName}`));
    queryParameters.set('filters', this._filtersPredicate(componentName));
    if (!queryParameters.get('inHierarchicalMode')) {
      queryParameters.set('hierarchicalAttribute', null);
    }

    this.reloadList(queryParameters).then(result => {
      this.set(`model.${componentName}`, result);
      let settings = this.get(`multiListSettings.${componentName}`);
      settings.set('model', result);
      settings.set('model.sorting', settings.get('sorting'));
    }, this).finally(() => {
      this.get('appState').reset();
    }, this);
  },

  setColumnsWidths(componentName, columnWidths) {
    let settings = this.get(`multiListSettings.${componentName}`);
    settings.set('currentColumnsWidths', columnWidths);
  },

  userSettingsApply(componentName, sorting, perPage) {
    let settings = this.get(`multiListSettings.${componentName}`);
    settings.set('perPage', perPage || 5);
    settings.set('sorting', sorting);

    let sort = serializeSortingParam(sorting, settings.get('sortDefaultValue'));
    settings.set('sort', sort);
    this.reloadListByName(componentName);
  },

  actions: {
    /**
      This action is called when user click on refresh button.

      @method actions.refreshList
      @public
    */
    refreshList(componentName) {
      this.reloadListByName(componentName);
    },

    /**
      Transition to page with number.

      @method actions.gotoPage
      @param {Number} pageNum Number of page.
    */
    gotoPage(pageNum, componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      let num = settings.get('_checkPageNumber').apply(settings, [pageNum]);
      settings.set('page', num);
      this.reloadListByName(componentName);
    },

    /**
      Transition to next page.

      @method actions.nextPage
    */
    nextPage(componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      let page = settings.get('page');
      let nextPage = settings.get('_checkPageNumber').apply(settings, [page + 1]);
      settings.set('page', nextPage);
      this.reloadListByName(componentName);
    },

    /**
      Transition to previous page.

      @method actions.previousPage
    */
    previousPage(componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      let page = settings.get('page');
      let prevPage = settings.get('_checkPageNumber').apply(settings, [page - 1]);
      settings.set('page', prevPage);
      this.reloadListByName(componentName);
    },

    /**
      Sorting list by column.

      @method actions.sortByColumn
      @param {Object} column Column for sorting.
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
      this.reloadListByName(componentName);
    },

    /**
      Add column into end list sorting.

      @method actions.addColumnToSorting
      @param {Object} column Column for sorting.
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
      this.reloadListByName(componentName);
    },

    showConfigDialog: function(componentName, settingName, isExportExcel = false, immediateExport = false) {
      let settingsSource = this.get(`multiListSettings.${componentName}`);
      this._showConfigDialog(componentName, settingName, settingsSource, isExportExcel, immediateExport);
    },

    /**
      Save filters and refresh list.

      @method actions.applyFilters
      @param {Object} filters
    */
    applyFilters(filters, componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      settings.set('page', 1);
      settings.set('filters', filters);
      this.reloadListByName(componentName);
    },

    /**
      Reset filters and refresh list.

      @method actions.resetFilters
      @param {String} componentName The name of objectlistview component.
    */
    resetFilters(componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      settings.set('page', 1);
      settings.set('filters', null);
      this.reloadListByName(componentName);
      this.get('objectlistviewEventsService').resetFiltersTrigger(componentName);
    },

    /**
      Changes current pattern for objects filtering.

      @method filterByAnyMatch
      @param {String} pattern A substring that is searched in objects while filtering.
      @param {String} filterCondition Condition for predicate, can be `or` or `and`.
    */
    filterByAnyMatch(pattern, filterCondition, componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      if (settings.get('filter') !== pattern || settings.get('filterCondition') !== filterCondition) {
        let _this = this;
        Ember.run.later((function() {
          settings.setProperties({
            filterCondition: filterCondition,
            filter: pattern,
            page: 1
          });

          _this.reloadListByName(componentName);
        }), 50);
      }
    },

    /**
      Switch hierarchical mode.

      @method actions.switchHierarchicalMode
    */
    switchHierarchicalMode(componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      settings.toggleProperty('inHierarchicalMode');
      this.reloadListByName(componentName);
    },

    /**
      Switch collapse/expand mode.

      @method actions.switchExpandMode
    */
    switchExpandMode(componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      settings.toggleProperty('inExpandMode');
      this.reloadListByName(componentName);
    },

    /**
      Saves attribute name and switches the mode if necessary.

      @method actions.saveHierarchicalAttribute
      @param {String} hierarchicalAttribute Attribute name to hierarchy build.
      @param {Boolean} [refresh] If `true`, then switch hierarchical mode.
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
      @param {ObjectListViewRowComponent} Instance of {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}}.
      @param {String} property Property name into {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}}.
      @param {Boolean} Flag indicates that this is the first download of data.
    */
    loadRecords(id, target, property, firstRunMode, componentName) {
      let settings = this.get(`multiListSettings.${componentName}`);
      this.send('loadRecordsById', id, target, property, firstRunMode, settings);
    },
  },
});
