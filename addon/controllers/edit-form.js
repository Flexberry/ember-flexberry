import Ember from 'ember';
import ErrorableControllerMixin from '../mixins/errorable-controller';
import FlexberryLookupMixin from '../mixins/flexberry-lookup-mixin';

/**
 * Edit form base controller.
 */
export default Ember.Controller.extend(Ember.Evented, FlexberryLookupMixin, ErrorableControllerMixin, {
  /**
   * Query parameters.
   */
  queryParams: ['readonly'],

  /**
   * Indicates whether the current form is opened only for reading.
   */
  readOnly: false,

  /**
   * Lookup settings.
   */
  lookupSettings: {
    controllerName: 'lookup-dialog',
    template: 'lookup-dialog',
    contentTemplate: 'lookup-dialog-content',
    loaderTemplate: 'loading',
    modalWindowWidth: 750,
    modalWindowHeight: 600
  },

  /**
   * Controller to show lookup modal window.
   *
   * @property lookupController
   * @type Ember.InjectedProperty
   * @default undefined
   */
  lookupController: Ember.inject.controller('lookup-dialog'),

  /**
   * Model change handler.
   */
  modelChange: Ember.observer('model', function() {
    // Unsubscribe from previous model 'preSave' event.
    var onModelPreSave = this.get('_onModelPreSave');
    if (!(Ember.isNone(onModelPreSave) || Ember.isNone(this._previousModel) || Ember.isNone(this._previousModel.off))) {
      this._previousModel.off('preSave', onModelPreSave);
    }

    // Remember new model as previous.
    var model = this.get('model');
    if (model !== this._previousModel) {
      this._previousModel = model;
    }

    if (!(Ember.isNone(model) || Ember.isNone(model.on))) {
      // Trigger 'modelPreSave' event on controller, to allow components to handle model's 'preSave' event.
      onModelPreSave = function(e) {
        e.model = model;
        this.trigger('modelPreSave', e);
      }.bind(this);

      model.on('preSave', onModelPreSave);
      this.set('_onModelPreSave', onModelPreSave);
    }
  }),

  /**
   * Actions handlers.
   */
  actions: {
    save: function() {
      this.send('dismissErrorMessages');

      this.get('model').save().then(() => {
        return this._processSavedDetails();
      }).then(() => {
        this._onSaveActionFulfilled();
      }).catch((errorData) => {
        this._onSaveActionRejected(errorData);
      });
    },

    delete: function() {
      if (confirm('Are you sure you want to delete that record?')) {
        this.send('dismissErrorMessages');

        this.get('model').destroyRecord().then(
          this._onDeleteActionFulfilled.bind(this),
          this._onDeleteActionRejected.bind(this)
        );
      }
    },

    close: function() {
      this.transitionToParentRoute();
    }
  },

  /**
   * Method to transit to parent's route (previous route).
   */
  transitionToParentRoute: function() {
    // TODO: нужно учитывать пэйджинг.
    // Без сервера не обойтись, наверное. Нужно определять, на какую страницу редиректить.
    // Либо редиректить на что-то типа /{parentRoute}/page/whichContains/{object id}, а контроллер/роут там далее разрулит, куда дальше послать редирект.
    let routeName = this.get('parentRoute') || Ember.String.pluralize(this.get('model.constructor.modelName'));
    this.transitionToRoute(routeName);
  },

  /**
   * Method to get type of object list view cell.
   */
  getCellComponent: function(attr, bindingPath) {
    // TODO: return different components by attr type.
    return 'object-list-view-input-cell';
  },

  /**
   * On save model success handler.
   */
  _processSavedDetails: function() {
    var modelsToDelete = Ember.A();
    var deletePromises = Ember.A();
    var attributes = this.get('modelProjection').attributes;
    for (var attrName in attributes) {
      if (!attributes.hasOwnProperty(attrName)) {
        continue;
      }

      var attr = attributes[attrName];
      if (attr.kind === 'hasMany') {
        var detailModels = this.get('model').get(attrName).toArray();

        // var changedModels = detailModels.filterBy('hasDirtyAttributes', true);
        for (var i = 0; i < detailModels.length; i++) {
          if (detailModels[i].get('hasDirtyAttributes')) {
            if (detailModels[i].get('isNew')) {
              modelsToDelete.pushObject(detailModels[i]);
            } else if (detailModels[i].get('isDeleted')) {
              deletePromises.pushObject(detailModels[i].save());
            }
          }
        }
      }
    }

    modelsToDelete.forEach(function(item) {
      item.deleteRecord();
    });
    modelsToDelete.clear();

    var modelName = this.get('model').constructor.modelName;
    var id = this.get('model').id;
    var modelProjName = this.get('modelProjectionName');
    return Ember.RSVP.all(deletePromises).then((values) => {
      return this.store.findRecord(modelName, id, {
        reload: true,
        projection: modelProjName
      });
    });
  },

  _onSaveActionFulfilled: function() {
    alert('Saved.');
  },

  /**
   * On save model fail handler.
   */
  _onSaveActionRejected: function(errorData) {
    this.rejectError(errorData, 'Save failed.');
  },

  /**
   * On delete model success handler.
   */
  _onDeleteActionFulfilled: function() {
    this.transitionToParentRoute();
  },

  /**
   * On delete model fail handler.
   */
  _onDeleteActionRejected: function(errorData) {
    this.rejectError(errorData, 'Delete failed.');
  },

  /**
   * On model 'preSave' event handler.
   */
  _onModelPreSave: null
});
