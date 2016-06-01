import Ember from 'ember';

import ListFormController from '../controllers/list-form';

export default ListFormController.extend({
  /**
   * Current opened modal window.
   *
   * @property _openedModalDialog
   * @type JQuery
   * @default undefined
   */
  _openedModalDialog: undefined,

  title: undefined,

  /**
   * Size of Semantic-UI modal.
   * Possible variants: 'small', 'large', 'fullscreen'.
   *
   * @property sizeClass
   * @type String
   * @default 'small'
   */
  sizeClass: 'small',

  /**
   * Current lookup selected record.
   * It is used to highlight selected record.
   *
   * @property currentLookupRow
   * @type DS.Model
   * @default undefined
   */
  currentLookupRow: undefined,

  /**
   * Set of properties to set for list commponent.
   *
   * @property customPropertiesData
   * @type Object
   * @default undefined
   */
  customPropertiesData: undefined,

  /**
   * Type of current loaded data.
   *
   * @property modelType
   * @type String
   * @default undefined
   */
  modelType: undefined,

  /**
   * Name of projection data were loaded by.
   *
   * @property projectionName
   * @type String
   * @default undefined
   */
  projectionName: undefined,

  /**
   * Handler to call when parameters of loaded data changed (filter, currentPage, etc.).
   *
   * @property reloadDataHandler
   * @type Function
   * @default undefined
   */
  reloadDataHandler: undefined,

  /**
   * Context for handler of data reloading call.
   *
   * @property reloadContext
   * @type Object
   * @default undefined
   */
  reloadContext: undefined,

  /**
   * Flag indicates whether to observe query parameters or they are not still initiated..
   *
   * @property reloadObserverIsActive
   * @type Boolean
   * @default false
   */
  reloadObserverIsActive: false,

  /**
   * It observes query parameters changing.
     If query parameter (filter, current page, etc.) is changed then displayed data are reloaded.

   * @method queryParametersChanged
   */
  queryParametersChanged: Ember.observer('filter', 'page', 'perPage', function() {
    if (!this.get('reloadObserverIsActive')) {
      return;
    }

    let reloadDataHandler = this.get('reloadDataHandler');
    if (!reloadDataHandler) {
      throw new Error('No reload handler was defined.');
    }

    let reloadData = {
      relatedToType: this.get('modelType'),
      projectionName: this.get('projectionName'),

      perPage: this.get('perPage'),
      page: this.get('page'),
      sorting: [], // TODO: need value.
      filter: this.get('filter'), // TODO: need value.

      title: this.get('title'),
      sizeClass: this.get('sizeClass'),
      saveTo: this.get('saveTo'),
      currentLookupRow: this.get('currentLookupRow'),
      customPropertiesData: this.get('customPropertiesData')
    };

    reloadDataHandler(this.get('reloadContext'), reloadData);
  }),

  actions: {
    /**
     * Handles olv row clicked.
     * Save selected row to object master property and close modal window
     *
     * @method rowClick
     * @param {Ember.Object} record Row record
     */
    objectListViewRowClick: function (record) {
      this.selectMaster(record);
      this.closeModalDialog();
    },

    /**
     * Handles create modal window action.
     * It saves created window to have opportunity to close it later.
     *
     * @method createdModalDialog
     * @param {JQuery} modalDialog Created modal window.
     */
    createdModalDialog: function(modalDialog) {
      this.set('_openedModalDialog', modalDialog);
    },

    /**
     * Handles correcponding route's willTransition action.
     * It closes modal window if it is opened (if Ember uses hash location type, modal window won't be closed automatically).
     *
     * @method routeWillTransition
     */
    routeWillTransition: function() {
      this.closeModalDialog();
    }
  },

  /**
   * Set master to corresponding property of editing object.
   *
   * @method selectMaster
   * @param {Ember.Object} master Selected master for editing property
   */
  selectMaster: function (master) {
    var saveTo = this.get('saveTo');
    if (!saveTo) {
      throw new Error('Don\'t know where to save - no saveTo data defined.');
    }

    saveTo.model.set(saveTo.propName, master);

    // Manually make record dirty, because ember-data does not do it when relationship changes.
    saveTo.model.makeDirty();
  },

  /**
   * Close current modal window if it exists.
   *
   * @method closeModalDialog
   */
  closeModalDialog: function () {
    let openedDialog = this.get('_openedModalDialog');
    if (openedDialog) {
      openedDialog.modal('hide');
      this.set('_openedModalDialog', undefined);
    }
  },

  /**
   * It clears current controller.
   * It has to be done before each use.
   *
   * @method clear
   * @public
   *
   * @param {Boolean} initialClear Flag indicates whether it is clear on first load or just on reload.
   */
  clear: function(initialClear) {
    this.set('reloadObserverIsActive', false);

    if (initialClear) {
      this.set('_openedModalDialog', undefined);
      this.set('modelProjection', undefined);
      this.set('reloadContext', undefined);
      this.set('reloadDataHandler', undefined);

      this.set('perPage', undefined);
      this.set('page', undefined);
      this.set('sort', undefined);
      this.set('filter', undefined);
    }

    this.set('saveTo', undefined);
    this.set('currentLookupRow', undefined);
    this.set('customPropertiesData', undefined);
    this.set('modelType', undefined);
    this.set('projectionName', undefined);
    return this;
  }
});
