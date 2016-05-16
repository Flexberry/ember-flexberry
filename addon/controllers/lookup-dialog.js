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
   * Possible variants: small, large, fullscreen.
   *
   * @property sizeClass
   * @type String
   * @default small
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

  modelType: undefined,

  projectionName: undefined,

  projection: undefined,

  reloadDataHandler: undefined,

  reloadContext: undefined,

  reloadObserverIsActive: false,

  queryParametersChanged: Ember.observer('filter', function() {
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
      projection: this.get('modelProjection'),

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
    rowClick: function (record) {
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
   */
  clear: function() {
    this.set('_openedModalDialog', undefined);
    this.set('saveTo', undefined);
    this.set('modelProjection', undefined);
    this.set('currentLookupRow', undefined);
    this.set('customPropertiesData', undefined);
    this.set('reloadDataHandler', undefined);
    this.set('perPage', undefined);
    this.set('page', undefined);
    this.set('sort', undefined);
    this.set('modelType', undefined);
    this.set('projectionName', undefined);
    this.set('projection', undefined);
    this.set('reloadContext', undefined);
    this.set('reloadObserverIsActive', false);
    return this;
  }
});
