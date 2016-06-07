import Ember from 'ember';

/**
  Mixin for {{#crossLink "DS.Route"}}Route{{/crossLink}}
  to support work with {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.

  @class FlexberryGroupeditRouteMixin
  @extends Ember.Mixin
  @public
 */
export default Ember.Mixin.create({
  /**
    Service that triggers {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}} events.

    @private
    @readOnly
    @property _groupEditEventsService
    @type Service
    @default ObjectlistviewEventsService
   */
  _groupEditEventsService: Ember.inject.service('objectlistview-events'),

  /**
    Service that lets interact between agregator's and detail's form.

    @readOnly
    @property flexberryDetailInteractionService
    @type Service
    @default DetailInteractionService
   */
  flexberryDetailInteractionService: Ember.inject.service('detail-interaction'),

  actions: {
    /**
      {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}} row click handler.
      It sets `modelNoRollBack` to `true` at current controller, redirects to detail's route, save necessary data to service.

      @method actions.groupEditRowClick
      @param {Ember.Object} record Record related to clicked table row.
      @param {Object} [options] Record related to clicked table row.
      @param {Boolean} options.saveBeforeRouteLeave Flag: indicates whether to save current model before going to the detail's route.
      @param {Boolean} options.editOnSeparateRoute Flag: indicates whether to edit detail on separate route.
      @param {String} options.modelName Clicked detail model name (used to create record if record is undefined).
      @param {Array} options.detailArray Current detail array (used to add record to if record is undefined).
      @param {Boolean} options.editFormRoute Path to detail's form.
     */
    groupEditRowClick(record, options) {
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

      let _this = this;
      let editFormRoute = methodOptions.editFormRoute;
      if (!editFormRoute) {
        throw new Error('Detail\'s edit form route is undefined.');
      }

      let goToOtherRouteFunction = function() {
        if (!record)
        {
          let modelName = methodOptions.modelName;
          if (!modelName) {
            throw new Error('Detail\'s model name is undefined.');
          }

          let detailArray = methodOptions.detailArray;
          var modelToAdd = _this.store.createRecord(modelName, {});
          detailArray.addObject(modelToAdd);
          record = modelToAdd;
        }

        let recordId = record.get('id');
        _this.controller.set('modelNoRollBack', true);

        let flexberryDetailInteractionService = _this.get('flexberryDetailInteractionService');
        flexberryDetailInteractionService.pushValue(
          'modelCurrentAgregatorPathes', _this.controller.get('modelCurrentAgregatorPathes'), _this.get('router.url'));
        flexberryDetailInteractionService.set('modelSelectedDetail', record);
        flexberryDetailInteractionService.set('saveBeforeRouteLeave', saveBeforeRouteLeave);
        flexberryDetailInteractionService.pushValue(
          'modelCurrentAgregators', _this.controller.get('modelCurrentAgregators'), _this.controller.get('model'));

        if (recordId) {
          _this.transitionTo(editFormRoute, record.get('id'));
        } else {
          let newModelPath = _this.newRoutePath(editFormRoute);
          _this.transitionTo(newModelPath);
        }
      };

      if (saveBeforeRouteLeave) {
        this.controller.save().then(() => {
          goToOtherRouteFunction();
        }).catch((errorData) => {
          this.rejectError(errorData, this.get('i18n').t('edit-form.save-failed-message'));
        });
      } else {
        goToOtherRouteFunction();
      }
    }
  },

  /**
    This hook is executed when the router enters the route. It is not executed when the model for the route changes.

    It is used to subscribe on {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}} events.

    @method activate
   */
  activate() {
    this._super(...arguments);

    this.get('_groupEditEventsService').on('olvRowAdded', this, this._rowAdded);
    this.get('_groupEditEventsService').on('olvRowDeleted', this, this._rowDeleted);
    this.get('_groupEditEventsService').on('olvRowsChanged', this, this._rowChanged);
  },

  /**
    This hook is executed when the router completely exits this route. It is not executed when the model for the route changes.

    It is used to unsubscribe from {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}} events.

    @method deactivate
   */
  deactivate() {
    this._super(...arguments);

    this.get('_groupEditEventsService').off('olvRowAdded', this, this._rowAdded);
    this.get('_groupEditEventsService').off('olvRowDeleted', this, this._rowDeleted);
    this.get('_groupEditEventsService').off('olvRowsChanged', this, this._rowChanged);
  },

  /**
    It forms path for new model's route.

    @method newRoutePath
    @param {String} ordinalPath The path to model's route.
    @return {String} The path to new model's route.
   */
  newRoutePath(ordinalPath) {
    return ordinalPath + '.new';
  },

  /**
    Event handler for "row has been selected" event in {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.

    @method _rowAdded
    @private

    @param {String} componentName The name of {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.
    @param {Model} record The model corresponding to added row in {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.
   */
  _rowAdded(componentName, record) {
    // Manually make record dirty, because ember-data does not do it when relationship changes.
    this.controller.get('model').makeDirty();
  },

  /**
    Event handler for "row has been deleted" event in {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.

    @method _rowDeleted
    @private

    @param {String} componentName The name of {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.
    @param {DS.Model} record The model corresponding to deleted row in {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.
   */
  _rowDeleted(componentName, record) {
    // Manually make record dirty, because ember-data does not do it when relationship changes.
    this.controller.get('model').makeDirty();
  },

  /**
    Event handler for "model(s) corresponding to some row(s) was changed" event in {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.

    @method _rowChanged
    @private

    @param {String} componentName The name of {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}}.
   */
  _rowChanged(componentName) {
    // Manually make record dirty, because ember-data does not do it when relationship changes.
    this.controller.get('model').makeDirty();
  }
});
