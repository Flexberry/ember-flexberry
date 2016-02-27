/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import ErrorableControllerMixin from '../mixins/errorable-controller';
import FlexberryLookupMixin from '../mixins/flexberry-lookup-mixin';

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
 */
export default Ember.Controller.extend(Ember.Evented, FlexberryLookupMixin, ErrorableControllerMixin, {
  /**
   * Query parameters.
   */
  queryParams: ['readonly'],

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
   * Controller to show lookup modal window.
   *
   * @property lookupController
   * @type Ember.InjectedProperty
   * @default undefined
   */
  lookupController: Ember.inject.controller('lookup-dialog'),

  /**
   * Model change handler.
   * TODO: refactor
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

      this.save().then(() => {
        this._onSaveActionFulfilled();
      }).catch((errorData) => {
        this._onSaveActionRejected(errorData);
      });
    },

    delete: function() {
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
      return this._processSavedDetails();
    });
  },

  delete: function() {
    return this.get('model').destroyRecord();
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
    if (attr.kind === 'attr' && modelAttr && modelAttr.type) {
      switch (modelAttr.type) {
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
          var modelAttrType = getOwner(this)._lookupFactory('transform:' + modelAttr.type);

          // Handle enums (extended from transforms/enum-base.js).
          if (modelAttrType && modelAttrType.isEnum) {
            cellComponent.componentName = 'flexberry-dropdown';
            cellComponent.componentProperties = {
              items: modelAttrType.create().getAvailableValuesArray()
            };
          }

          break;
      }
    }

    return cellComponent;
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
    alert(this.get('i18n').t('edit-form.saved-message'));
  },

  /**
   * On save model fail handler.
   */
  _onSaveActionRejected: function(errorData) {
    this.rejectError(errorData, this.get('i18n').t('save-failed-message'));
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
    this.rejectError(errorData, this.get('i18n').t('delete-failed-message'));
  },

  /**
   * On model 'preSave' event handler.
   */
  _onModelPreSave: null
});
