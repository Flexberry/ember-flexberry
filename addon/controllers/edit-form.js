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

  _onSaveActionFulfilled: function() {
    alert('Saved.');
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
