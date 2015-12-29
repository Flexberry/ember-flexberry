import Ember from 'ember';
import ErrorableControllerMixin from '../mixins/errorable-controller';
import LookupFieldMixin from '../components/lookup-field/lookup-field-mixin';

export default Ember.Controller.extend(Ember.Evented, LookupFieldMixin, ErrorableControllerMixin, {

  // lookup settings
  lookupSettings: {
    controllerName: 'lookup-dialog',
    template: 'lookup-dialog',
    contentTemplate: 'lookup-dialog-content',
    loaderTemplate: 'loading',
    modalWindowWidth: 750,
    modalWindowHeight:600
  },

  // Get query parameters.
  queryParams: {
    readOnlyQueryMode: 'readonly'
  },

  // Query parameter for readonly.
  readOnlyQueryMode: null,

  // Get if current form opened only for reading.
  readonly: Ember.computed('readOnlyQueryMode', function() {
    var formMode = this.get('readOnlyQueryMode');
    return formMode && String(formMode).toLowerCase() === 'true';
  }),

  // Message to show if user tries to do something with readonly form.
  readonlyMessage: 'Form was opened only for reading.',

  actions: {
    save: function() {
      if (this.get('readonly')) {
        alert(this.get('readonlyMessage'));
        return;
      }

      var _this = this;

      // Trigger 'presave' event, and  give handlers possibility to add aync operations promises.
      var presaveEventArgs = {
        promises: [],
        model: _this.get('model')
      };
      _this.trigger('modelPreSave', presaveEventArgs);

      // Promises array could be totally changed in event handlers, we should prevent possible errors.
      presaveEventArgs.promises = Ember.isArray(presaveEventArgs.promises) ? presaveEventArgs.promises : [];
      presaveEventArgs.promises = presaveEventArgs.promises.filter(function(item, index, array) {
        return item instanceof  Ember.RSVP.Promise;
      });

      // Wait for all promises to be resolved.
      Ember.RSVP.all(presaveEventArgs.promises).then(function(values) {
        _this.send('dismissErrorMessages');
        _this.get('model').save().then(
          _this._onSaveActionFulfilled.bind(_this),
          _this._onSaveActionRejected.bind(_this));
      }, function(reason) {
        _this._onSaveActionRejected.call(_this, reason);
      });
    },

    delete: function() {
      if (this.get('readonly')) {
        alert(this.get('readonlyMessage'));
        return;
      }

      if (confirm('Are you sure you want to delete that record?')) {
        this.send('dismissErrorMessages');
        let model = this.get('model');
        model.destroyRecord().then(
          this._onDeleteActionFulfilled.bind(this),
          this._onDeleteActionRejected.bind(this));
      }
    },

    close: function() {
      this.transitionToParentRoute();
    }
  },

  transitionToParentRoute: function() {
    // TODO: нужно учитывать пэйджинг.
    // Без сервера не обойтись, наверное. Нужно определять, на какую страницу редиректить.
    // Либо редиректить на что-то типа /{parentRoute}/page/whichContains/{object id}, а контроллер/роут там далее разрулит, куда дальше послать редирект.
    let routeName = this.get('parentRoute') || Ember.String.pluralize(this.get('model.constructor.modelName'));
    this.transitionToRoute(routeName);
  },

  _processSavedDetails: function() {
    var _this = this;
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
            }
            else if (!detailModels[i].get('isDeleted')) {
              detailModels[i].send('becameClean');
            }
            else if (detailModels[i].get('isDeleted')) {
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
    Ember.RSVP.all(deletePromises).then(function(values) {
      return _this.store.findRecord(modelName, id, {
        reload: true,
        projection: modelProjName
      });
    },
    function(reason) {
      _this._onSaveActionRejected.call(_this, reason);
    });
    return this.store.findRecord(modelName, id, {
      reload: true,
      projection: modelProjName
    });
  },

  _onSaveActionFulfilled: function() {
    this._processSavedDetails().then(function() {
      alert('Saved.');
    });
  },

  _onSaveActionRejected: function(errorData) {
    this.rejectError(errorData, 'Save failed.');
  },

  _onDeleteActionFulfilled: function() {
    this.transitionToParentRoute();
  },

  _onDeleteActionRejected: function(errorData) {
    this.rejectError(errorData, 'Delete failed.');
  },

  getCellComponent: function(attr, bindingPath) {
    // TODO: return different components by attr type.
    return 'object-list-view-input-cell';
  }
});
