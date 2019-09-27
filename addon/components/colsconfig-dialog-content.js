import $ from 'jquery';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { isBlank, isNone } from '@ember/utils';
import { getOwner } from '@ember/application';
import { scheduleOnce } from '@ember/runloop';
import FlexberryBaseComponent from './flexberry-base-component';
import serializeSortingParam from '../utils/serialize-sorting-param';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import ODataAdapter from 'ember-flexberry-data/query/odata-adapter';

/**
 * Columns configuration dialog Content component.
 *
 * @class ColsconfigDialogContentComponent
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  /**
   Columns configiration menu.

   @property colsConfigMenu
   @type {Class}
   @default service()
   */
  colsConfigMenu: service(),

  /**
   Service that triggers objectlistview events.

   @property objectlistviewEventsService
   @type {Class}
   @default service()
   */
  objectlistviewEventsService: service('objectlistview-events'),

  /**
    Service for managing the state of the application.

    @property appState
    @type AppStateService
  */
  appState: service(),

  /**
    Current store.

    @property store
    @type {Object}
    @default undefined
  */
  store: undefined,

  init: function() {
    this._super(...arguments);
    if (!this.get('model.colDescs')) {
      return;
    }

    this.set('store', this.get('model.store'));
    this.set('model.colDescs', A(this.get('model.colDescs')));
  },

  didRender: function() {
    this._super(...arguments);
    let exportParams = this.get('model.exportParams') || {};
    if (exportParams.isExportExcel && exportParams.immediateExport) {
      exportParams.immediateExport = false;
      this.actions.apply.call(this);
    }
  },

  didInsertElement: function() {
    this._super(...arguments);
    this.$('.sort-direction-dropdown').each((index, element) => {
      $(element).dropdown({
        onChange: (value) => {
          this.send('setSortOrder', index, element, value);
        }
      });
      $(element).dropdown('set selected', this.get(`model.colDescs.${index}.sortOrder`));
    });
  },

  actions: {
    /**
     Invert column visibility (On/Off)

     @method actions.invertVisibility
     @param {Integer} n Row number.
     */
    invertVisibility: function(n) {
      let newHideState = !this.get(`model.colDescs.${n}.hide`);
      this.set(`model.colDescs.${n}.hide`, newHideState);
    },

    /**
     Set sort order and priority for column.

     @method actions.setSortOrder
     @param {Integer} index Row number.
     @param {Object} element Dropdown.
     @param {String} value Selected value.
     */
    setSortOrder: function(index, element, value) {
      let currentValue = this.get(`model.colDescs.${index}.sortOrder`);
      if (currentValue !== parseInt(value)) {
        if (value === '0') {
          this.set(`model.colDescs.${index}.sortPriority`, undefined);
          this.set(`model.colDescs.${index}.sortOrder`, undefined);
        } else {
          let sortPriority = this.get(`model.colDescs.${index}.sortPriority`);
          if (isNone(sortPriority)) {
            sortPriority = this.get('model.colDescs').filter(c => c.sortPriority).length + 1;
            this.set(`model.colDescs.${index}.sortPriority`, sortPriority);
          }

          this.set(`model.colDescs.${index}.sortOrder`, parseInt(value));
        }
      }
    },

    /**
     Move row upward in list.

     @method actions.rowUp
     @param {Integer} n Row number.
     */
    rowUp: function(n) {
      let array = this.get('model.colDescs');
      let row = array[n];

      array.removeObject(row);
      array.insertAt(n - 1, row);
    },

    /**
     Move row downward.

     @method actions.rowDown
     @param {Integer} n Row number.
     */
    rowDown: function(n) {
      let array = this.get('model.colDescs');
      let row = array[n];

      array.removeObject(row);
      array.insertAt(n + 1, row);
    },

    /**
     Apply specified usersettings.

     @method actions.apply
    */
    apply: function() {
      this.get('appState').loading();
      if (!this.get('model.exportParams.isExportExcel')) {
        let colsConfig = this._getSettings();

        let savePromise = this._getSavePromise(undefined, colsConfig);

        /* eslint-disable no-unused-vars */
        savePromise.then(
          record => {
            let sort = serializeSortingParam(colsConfig.sorting);
            this.get('appState').reset();
            let mainController = this.get('currentController.mainControler');
            let userSettingsApplyFunction = mainController.get('userSettingsApply');
            if (userSettingsApplyFunction instanceof Function) {
              userSettingsApplyFunction.apply(mainController, [this.get('model.componentName'), colsConfig.sorting, colsConfig.perPage]);
            } else {
              mainController.set('sort', sort);
              mainController.set('perPage', colsConfig.perPage || 5);
              let router = getOwner(this).lookup('router:main');
              router.router.refresh();
            }
          }
        ).catch((reason) => {
          this.currentController.send('handleError', reason);
        });
        /* eslint-enable no-unused-vars */

        this.get('close')(colsConfig);
      } else {
        let store = this.get('store.onlineStore') || this.get('store');
        let modelName = this.get('model.modelName');
        let adapter = store.adapterFor(modelName);
        let currentQuery = this._getCurrentQuery();
        adapter.query(store, modelName, currentQuery).then((result) => {
          let blob = new Blob([result], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let anchor = $('.download-anchor');
          if (!isBlank(anchor)) {
            if (window.navigator.msSaveOrOpenBlob) {
              let downloadFunction = function() {
                window.navigator.msSaveOrOpenBlob(blob, 'list.xlsx');
              };

              anchor.on('click', downloadFunction);
              anchor.get(0).click();
              anchor.off('click', downloadFunction);
            } else {
              let downloadUrl = URL.createObjectURL(blob);
              anchor.prop('href', downloadUrl);
              anchor.prop('download', 'list.xlsx');
              anchor.get(0).click();
            }
          }
        }).catch((reason) => {
          this.get('close')(); // close modal window
          this.currentController.send('handleError', reason);
        }).finally(() => {
          this.get('appState').reset();
        });
      }
    },

    /**
      Save specified usersettings.

      @method actions.saveColsSetting
    */
    saveColsSetting: function() {
      let settingName = this.get('model.settingName');
      if (settingName.length <= 0) {
        this.set('currentController.message.type', 'warning');
        this.set('currentController.message.visible', true);
        this.set('currentController.message.caption', this.get('i18n').t('components.colsconfig-dialog-content.enter-setting-name'));
        this.set('currentController.message.message', '');
        this._scrollToBottom();
        return;
      }

      let colsConfig = this._getSettings();
      let savePromise = this._getSavePromise(settingName, colsConfig);
      this.get('colsConfigMenu').addNamedSettingTrigger(settingName, this.get('model.componentName'));

      savePromise.then(
        () => {
          this.set('currentController.message.type', 'success');
          this.set('currentController.message.visible', true);
          this.set('currentController.message.caption', this.get('i18n').t('components.colsconfig-dialog-content.setting') +
            settingName +
            this.get('i18n').t('components.colsconfig-dialog-content.is-saved'));
          this.set('currentController.message.message', '');
          this._scrollToBottom();
        },
        error => {
          this.set('currentController.message.type', 'error');
          this.set('currentController.message.visible', true);
          this.set('currentController.message.caption', this.get('i18n').t('components.colsconfig-dialog-content.have-errors'));
          this.set('currentController.message.message', JSON.stringify(error));
          this._scrollToBottom();
          this.get('close')(colsConfig); // close modal window
          this.currentController.send('handleError', error);
        }
      );
    },

    /* eslint-disable no-unused-vars */
    handleError(error) {
      this._super(...arguments);
      return true;
    }
    /* eslint-enable no-unused-vars */

  },

  /**
    Scrolling content to bottom.

    @method _scrollToBottom
  */
  _scrollToBottom() {
    scheduleOnce('afterRender', this, function() {
      let scrollBlock = this.$('.flexberry-colsconfig.content');
      scrollBlock.animate({ scrollTop: scrollBlock.prop('scrollHeight') }, 1000);
    });
  },

  /**
    Gets current query for export excel.

    @method _getCurrentQuery
  */
  _getCurrentQuery: function() {
    let settings = this._getSettings();
    let sortString = '';
    let modelName = this.get('model.modelName');
    settings.sorting.map(sort => {
      sortString += `${sort.propName} ${sort.direction},`;
    });
    sortString = sortString.slice(0, -1);
    let store = this.get('store.onlineStore') || this.get('store');
    let builder = new QueryBuilder(store, modelName);
    let adapter = new ODataAdapter('123', store);
    let exportParams = this.get('model.exportParams') || {};
    builder.selectByProjection(exportParams.projectionName, true);
    let colsOrder = settings.colsOrder.filter(({ hide }) => !hide)
      .map(column => adapter._getODataAttributeName(modelName, column.propName).replace(/\//g, '.') + '/' + column.name || column.propName)
      .join();
    if (sortString) {
      builder.orderBy(sortString);
    }

    let limitFunction = this.get('objectlistviewEventsService').getLimitFunction(this.get('model.componentName'));
    if (limitFunction) {
      builder.where(limitFunction);
    }

    if (exportParams.isExportExcel) {
      builder.ofDataType('blob');
      let customQueryParams = { colsOrder: colsOrder, exportExcel: exportParams.isExportExcel,
        detSeparateRows: exportParams.detSeparateRows, detSeparateCols: exportParams.detSeparateCols };
      builder.withCustomParams(customQueryParams);
    }

    let query = builder.build();

    return query;
  },

  /* eslint-disable no-unused-vars */
  _getSavePromise: function(settingName, colsConfig) {
    let componentName = this.get('model.componentName');
    let isExportExcel = this.get('model.exportParams.isExportExcel');

    return this.get('userSettingsService').saveUserSetting(componentName, settingName, colsConfig, isExportExcel)
    .then(result => {
      this.get('colsConfigMenu').updateNamedSettingTrigger(componentName);
    });
  },
  /* eslint-enable no-unused-vars */

  _getSettings: function() {
    let colsOrder = [];
    let sortSettings = [];
    let widthSetting = [];

    let colDescs = this.get('model.colDescs');
    colDescs.forEach((colDesc) => {
      colsOrder.push({ propName: colDesc.propName, hide: colDesc.hide, name: colDesc.name.toString() });
      if (!isNone(colDesc.sortPriority)) {
        sortSettings.push({ propName: colDesc.propName, sortOrder: colDesc.sortOrder, sortPriority: colDesc.sortPriority });
      }

      if (this.get('model.saveColWidthState') && !isNaN(colDesc.columnWidth)) {
        widthSetting.push({ propName: colDesc.propName, width: parseInt(colDesc.columnWidth) });
      }
    }, this);

    sortSettings = sortSettings.sort((a, b) => a.sortPriority - b.sortPriority);
    sortSettings = sortSettings.map((s) => { return { propName: s.propName, direction:  s.sortOrder > 0 ? 'asc' : 'desc' }; });

    let perPage = parseInt(this.get('model.perPageValue'));

    if (isNaN(perPage) || perPage <= 0) {
      perPage = 5;
    }

    let colsConfig = { colsOrder: colsOrder, sorting: sortSettings, perPage: perPage };
    if (this.get('model.saveColWidthState')) {
      colsConfig.columnWidths = widthSetting;
    }

    let exportParams = this.get('model.exportParams') || {};
    if (exportParams.isExportExcel) {
      colsConfig.detSeparateRows = exportParams.detSeparateRows;
      colsConfig.detSeparateCols = exportParams.detSeparateCols;
    }

    return colsConfig;
  }
});
