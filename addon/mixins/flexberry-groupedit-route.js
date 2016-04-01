import Ember from 'ember';

export default Ember.Mixin.create({
  /**
   * Service that triggers groupedit events.
   *
   * @property groupEditEventsService
   * @type Service
   */
  groupEditEventsService: Ember.inject.service('objectlistview-events'),

  /**
   * Service that lets interact between agregator's and detail's form.
   *
   * @property flexberryDetailInteractionService
   * @type Service
   */
  flexberryDetailInteractionService: Ember.inject.service('detail-interaction'),

  activate() {
    this._super(...arguments);

    this.get('groupEditEventsService').on('olvRowAdded', this, this._rowAdded);
    this.get('groupEditEventsService').on('olvRowDeleted', this, this._rowDeleted);
    this.get('groupEditEventsService').on('olvRowsChanged', this, this._rowChanged);
  },

  deactivate() {
    this._super(...arguments);

    this.get('groupEditEventsService').off('olvRowAdded', this, this._rowAdded);
    this.get('groupEditEventsService').off('olvRowDeleted', this, this._rowDeleted);
    this.get('groupEditEventsService').off('olvRowsChanged', this, this._rowChanged);
  },

  /**
   * It forms path for new model's route.
   *
   * @method newRoutePath
   *
   * @param {String} ordinalPath The path to model's route.
   * @return {String} The path to new model's route.
   */
  newRoutePath: function(ordinalPath) {
    return ordinalPath + '.new';
  },

  actions: {
    /**
     * Table row click handler.
     * It sets `modelNoRollBack` to `true` at current controller, redirects to detail's route, save necessary data to service.
     *
     * @param {Ember.Object} record Record related to clicked table row.
     * @param {Object} options Record related to clicked table row.
     * @param {Boolean} [options.saveBeforeRouteLeave] Flag: indicates whether to save current model before going to the detail's route.
     * @param {Boolean} [options.editOnSeparateRoute] Flag: indicates whether to edit detail on separate route.
     * @param {String} [options.modelName] Clicked detail model name (used to create record if record is undefined).
     * @param {Array} [options.detailArray] Current detail array (used to add record to if record is undefined).
     * @param {Boolean} [options.editFormRoute] Path to detail's form.
     */
    rowClick: function(record, options) {
      let methodOptions = {
        saveBeforeRouteLeave: false,
        editOnSeparateRoute: false,
        modelName: undefined,
        detailArray: undefined,
        editFormRoute: undefined
      };
      methodOptions = Ember.merge(methodOptions, options);
      let editOnSeparateRoute = methodOptions.editOnSeparateRoute;
      let saveBeforeRouteLeave = methodOptions.saveBeforeRouteLeave;

      if (!editOnSeparateRoute) {
        return;
      }

      let editFormRoute = methodOptions.editFormRoute;
      if (!editFormRoute) {
        throw new Error('Detail\'s edit form route is undefined.');
      }

      if (saveBeforeRouteLeave) {
        this.controller.save().then(() => {
          this.transitionTo(editFormRoute, record);
        }).catch((errorData) => {
          this.rejectError(errorData, this.get('i18n').t('edit-form.save-failed-message'));
        });
      } else {
        this.transitionTo(editFormRoute, record);
      }
    }
  },

  /**
   * Event handler for "row has been selected" event in groupedit.
   *
   * @method _rowAdded
   * @private
   *
   * @param {String} componentName The name of flexberry-groupedit component.
   * @param {Model} record The model corresponding to added row in groupedit.
   */
  _rowAdded: function(componentName, record) {
    // Manually make record dirty, because ember-data does not do it when relationship changes.
    this.controller.get('model').makeDirty();
  },

  /**
   * Event handler for "row has been deleted" event in groupedit.
   *
   * @method _rowDeleted
   * @private
   *
   * @param {String} componentName The name of flexberry-groupedit component.
   * @param {DS.Model} record The model corresponding to deleted row in groupedit.
   */
  _rowDeleted: function(componentName, record) {
    // Manually make record dirty, because ember-data does not do it when relationship changes.
    this.controller.get('model').makeDirty();
  },

  /**
   * Event handler for "model(s) corresponding to some row(s) was changed" event in groupedit.
   *
   * @method _rowChanged
   * @private
   *
   * @param {String} componentName The name of flexberry-groupedit component.
   */
  _rowChanged: function(componentName) {
    // Manually make record dirty, because ember-data does not do it when relationship changes.
    this.controller.get('model').makeDirty();
  }
});
