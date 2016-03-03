import Ember from 'ember';

export default Ember.Mixin.create({
  /**
   * Service that triggers groupedit events.
   *
   * @property groupEditEventsService
   * @type Service
   */
  groupEditEventsService: Ember.inject.service('objectlistview-events'),

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
