import Ember from 'ember';

export default Ember.Mixin.create({
  /**
   * Service that triggers groupedit events.
   *
   * @property groupEditEventsService
   * @type Service
   */
  groupEditEventsService: Ember.inject.service('groupedit-events'),
  deletedRecords: null,

  activate() {
    this._super(...arguments);

    this.get('groupEditEventsService').on('groupEditRowAdded', this, this._rowAdded);
    this.get('groupEditEventsService').on('groupEditRowDeleted', this, this._rowDeleted);
    this.get('groupEditEventsService').on('groupEditRowsChanged', this, this._rowChanged);

    if (!this.get('deletedRecords')) {
      this.set('deletedRecords', Ember.A());
    } else {
      this.get('deletedRecords').clear();
    }
  },

  deactivate() {
    this._super(...arguments);

    this.get('groupEditEventsService').off('groupEditRowAdded', this, this._rowAdded);
    this.get('groupEditEventsService').off('groupEditRowDeleted', this, this._rowDeleted);
    this.get('groupEditEventsService').off('groupEditRowsChanged', this, this._rowChanged);
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
    if (record.get('id')) {
      this.get('deletedRecords').pushObject({
        model: record.constructor.modelName,
        id: record.get('id')
      });
    }

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
