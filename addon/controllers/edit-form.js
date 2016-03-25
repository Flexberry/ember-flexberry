/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import ErrorableControllerMixin from '../mixins/errorable-controller';
import FlexberryLookupMixin from '../mixins/flexberry-lookup-mixin';
import FlexberryFileControllerMixin from '../mixins/flexberry-file-controller';

const { getOwner } = Ember;

/**
 * Base controller for the Edit Forms.

   This class re-exports to the application as `/controllers/edit-form`.
   So, you can inherit from `./edit-form`, even if file `app/controllers/edit-form.js`
   is not presented in the application.

   Example:
   ```js
   // app/controllers/employee.js
   import EditFormController from './edit-form';
   export default EditFormController.extend({
   });
   ```

   If you want to add some common logic on all Edit Forms, you can define
   (actually override) `app/controllers/edit-form.js` as follows:
    ```js
    // app/controllers/edit-form.js
    import EditFormController from 'ember-flexberry/controllers/edit-form';
    export default EditFormController.extend({
    });
    ```

 * @class EditFormController
 * @extends Ember.Controller
 * @uses Ember.Evented
 * @uses FlexberryLookupMixin
 * @uses ErrorableControllerMixin
 * @uses FlexberryFileControllerMixin
 */
export default Ember.Controller.extend(
  Ember.Evented, FlexberryLookupMixin, ErrorableControllerMixin, FlexberryFileControllerMixin, {
  /**
   * Query parameters.
   */
  queryParams: ['readonly'],

  /**
   * Flag to enable return to agregator's path if possible.
   *
   * @property returnToAgregatorRoute
   * @type Boolean
   * @default false
   */
  returnToAgregatorRoute: false,

  /**
   * Indicates whether the current form is opened only for reading.
   *
   * @property readonly
   * @type Boolean
   * @default false
   */
  readonly: false,

  // TODO: add unit test.
  /**
   * Readonly attribute for HTML components following to the `readonly` query param. According to the W3C standard, returns 'readonly' if `readonly` is `true` and `undefined` otherwise.
   *
   * @property readonlyAttr
   * @type String|undefined
   * @default undefined
   * @readOnly
   */
  readonlyAttr: Ember.computed('readonly', function() {
    return this.get('readonly') ? 'readonly' : undefined;
  }),

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
   * If `true`, all details will be deleted along with the main model.
   *
   * @property destroyHasManyRelationshipsOnModelDestroy
   * @type Boolean
   * @default false
   */
  destroyHasManyRelationshipsOnModelDestroy: false,

  /**
   * Controller to show lookup modal window.
   *
   * @property lookupController
   * @type Ember.InjectedProperty
   * @default undefined
   */
  lookupController: Ember.inject.controller('lookup-dialog'),

  /**
   * Flag to cancel rollback of model on controller resetting.
   * Flag is set for interaction of agregator's and detail's routes.
   *
   * @property modelNoRollBack
   * @type Boolean
   * @default false
   */
  modelNoRollBack: false,

  /**
   * Actions handlers.
   */
  actions: {
    save: function() {
      this.send('dismissErrorMessages');

      this.save().then(() => {
        this._onSaveActionFulfilled();
      }).catch((errorData) => {
        this._onSaveActionRejected(errorData);
      });
    },

    saveAndClose: function() {
      this.send('dismissErrorMessages');

      this.save().then(() => {
        this._onSaveActionFulfilled();
        this.send('close');
      }).catch((errorData) => {
        this._onSaveActionRejected(errorData);
      });
    },

    delete: function() {
      // TODO: with agregator.
      if (confirm('Are you sure you want to delete that record?')) {
        this.send('dismissErrorMessages');

        this.delete().then(
          this._onDeleteActionFulfilled.bind(this),
          this._onDeleteActionRejected.bind(this)
        );
      }
    },

    close: function() {
      this.transitionToParentRoute();
    }
  },

  save: function() {
    return this.get('model').save().then(() => {
      return this.saveHasManyRelationships();
    });
  },

  delete: function() {
    if (this.get('destroyHasManyRelationshipsOnModelDestroy')) {
      return this.destroyHasManyRelationships().then(() => {
        return this.get('model').destroyRecord();
      });
    } else {
      return this.get('model').destroyRecord();
    }
  },

  /**
   * Method to transit to parent's route (previous route).
   * If `parentRoute` is set, transition to defined path.
   * Otherwise transition to corresponding list.
   *
   * @method transitionToParentRoute.
   */
  transitionToParentRoute: function() {
    // TODO: нужно учитывать пэйджинг.
    // Без сервера не обойтись, наверное. Нужно определять, на какую страницу редиректить.
    // Либо редиректить на что-то типа /{parentRoute}/page/whichContains/{object id}, а контроллер/роут там далее разрулит, куда дальше послать редирект.
    let routeName = this.get('parentRoute') || Ember.String.pluralize(this.get('model.constructor.modelName'));
    this.transitionToRoute(routeName);
  },

  /**
   * Method to get type and attributes of component,
   * which will be embeded in object-list-view cell.
   *
   * @method getCellComponent.
   * @param {Object} attr Attribute of projection property related to current table cell.
   * @param {String} bindingPath Path to model property related to current table cell.
   * @param {DS.Model} modelClass Model class of data record related to current table row.
   * @return {Object} Object containing name & properties of component, which will be used to render current table cell.
   * { componentName: 'my-component',  componentProperties: { ... } }.
   */
  getCellComponent: function(attr, bindingPath, modelClass) {
    var cellComponent = {
      componentName: 'flexberry-textbox',
      componentProperties: null
    };

    if (attr.kind === 'belongsTo') {
      cellComponent.componentName = 'flexberry-lookup';
      return cellComponent;
    }

    var modelAttr = !Ember.isNone(modelClass) ? Ember.get(modelClass, 'attributes').get(bindingPath) : null;
    if (!(attr.kind === 'attr' && modelAttr && modelAttr.type)) {
      return cellComponent;
    }

    var modelAttrOptions = Ember.get(modelAttr, 'options');

    // Handle order attributes (they must be readonly).
    if (modelAttrOptions && modelAttrOptions.isOrderAttribute) {
      cellComponent.componentName = 'object-list-view-cell';
    }

    switch (modelAttr.type) {
      case 'string':
      case 'number':
        break;
      case 'boolean':
        cellComponent.componentName = 'flexberry-checkbox';
        break;
      case 'date':
        cellComponent.componentName = 'flexberry-datepicker';
        break;
      case 'file':
        cellComponent.componentName = 'flexberry-file';
        break;
      default:

        // Current cell type is possibly custom transform.
        var transformInstance = getOwner(this).lookup('transform:' + modelAttr.type);
        var transformClass = !Ember.isNone(transformInstance) ? transformInstance.constructor : null;

        // Handle enums (extended from transforms/flexberry-enum.js).
        if (transformClass && transformClass.isEnum) {
          cellComponent.componentName = 'flexberry-dropdown';
          cellComponent.componentProperties = {
            items: transformInstance.get('captions')
          };
        }

        break;
    }

    return cellComponent;
  },

  /**
   * Save dirty hasMany relationships in the `model`.
   * This method invokes by `save` method.
   *
   * @method saveHasManyRelationships
   * @return {DS.Model} Current `model`.
   */
  saveHasManyRelationships: function() {
    let model = this.get('model');
    let promises = Ember.A();
    model.eachRelationship((name, desc) => {
      if (desc.kind === 'hasMany') {
        model.get(name).filterBy('hasDirtyAttributes', true).forEach((record) => {
          promises.pushObject(record.save());
        });
      }
    });

    return Ember.RSVP.all(promises).then((savedRecords) => {
      return model;
    });
  },

  /**
   * Rollback dirty hasMany relationships in the `model`.
   * This method invokes by `resetController` in the `edit-form` route.
   *
   * @method rollbackHasManyRelationships
   * @public
   *
   * @param {DS.Model} processedModel Model to rollback its relations (controller's model will be used if undefined).
   */
  rollbackHasManyRelationships: function(processedModel) {
    let model = processedModel ? processedModel : this.get('model');
    let promises = Ember.A();
    model.eachRelationship((name, desc) => {
      if (desc.kind === 'hasMany') {
        model.get(name).filterBy('hasDirtyAttributes', true).forEach((record) => {
          promises.pushObject(record.rollbackAttributes());
        });
      }
    });
  },

  /**
   * Destroy (delete and save) all hasMany relationships in the `model`.
   * This method invokes by `delete` method.
   *
   * @method destroyHasManyRelationships
   * @return {DS.Model} Current `model`.
   */
  destroyHasManyRelationships: function() {
    let model = this.get('model');
    let promises = Ember.A();
    model.eachRelationship((name, desc) => {
      if (desc.kind === 'hasMany') {
        model.get(name).forEach((record) => {
          promises.pushObject(record.destroyRecord());
        });
      }
    });

    return Ember.RSVP.all(promises).then((destroyedRecords) => {
      return model;
    });
  },

  _onSaveActionFulfilled: function() {
    alert(this.get('i18n').t('edit-form.saved-message'));
  },

  /**
   * On save model fail handler.
   */
  _onSaveActionRejected: function(errorData) {
    this.rejectError(errorData, this.get('i18n').t('edit-form.save-failed-message'));
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
    this.rejectError(errorData, this.get('i18n').t('edit-form.delete-failed-message'));
  }
});
