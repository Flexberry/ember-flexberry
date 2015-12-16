import Ember from 'ember';
import ErrorableControllerMixin from '../mixins/errorable-controller';
import LookupFieldMixin from '../components/lookup-field/lookup-field-mixin';

export default Ember.Controller.extend(LookupFieldMixin, ErrorableControllerMixin, {

  // lookup settings
  lookupSettings: {
    controllerName: 'lookup-dialog',
    template: 'lookup-dialog',
    contentTemplate: 'lookup-dialog-content',
    loaderTemplate: 'loading',
    modalWindowWidth: 750,
    modalWindowHeight:600
  },

  actions: {
    save: function() {
      this.send('dismissErrorMessages');
      let model = this.get('model');
      model.save().then(
        this._onSaveActionFulfilled.bind(this),
        this._onSaveActionRejected.bind(this));
    },

    delete: function() {
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
