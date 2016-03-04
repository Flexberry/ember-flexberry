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
     */
    rowClick: function(record) {
      let recordId = record.get('id');
      let modelName = record.constructor.modelName;
      this.controller.set('modelNoRollBack', true);

      let flexberryDetailInteractionService = this.get('flexberryDetailInteractionService');
      flexberryDetailInteractionService.pushValue(
        'modelCurrentAgregatorPathes', this.controller.get('modelCurrentAgregatorPathes'), this.get('router.url'));
      flexberryDetailInteractionService.set('modelSelectedDetail', record);
      flexberryDetailInteractionService.pushValue(
        'modelCurrentAgregators', this.controller.get('modelCurrentAgregators'), this.controller.get('model'));

      if (recordId) {
        this.transitionTo(modelName, record.get('id'));
      } else {
        let newModelPath = this.newRoutePath(modelName);
        this.transitionTo(newModelPath);
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
