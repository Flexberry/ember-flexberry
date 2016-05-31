/**
  @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryLookupMixin from '../mixins/flexberry-lookup';
import ErrorableControllerMixin from '../mixins/errorable-controller';
import FlexberryFileControllerMixin from '../mixins/flexberry-file-controller';

const { getOwner } = Ember;

/**
  Base controller for the Edit Forms.

  This class re-exports to the application as `/controllers/edit-form`.
  So, you can inherit from `./edit-form`, even if file `app/controllers/edit-form.js` is not presented in the application.

  Example:
  ```javascript
  // app/controllers/employee.js
  import EditFormController from './edit-form';
  export default EditFormController.extend({
  });
  ```

  If you want to add some common logic on all Edit Forms, you can override `app/controllers/edit-form.js` as follows:
  ```javascript
  // app/controllers/edit-form.js
  import EditFormController from 'ember-flexberry/controllers/edit-form';
  export default EditFormController.extend({
  });
  ```

  @class EditFormController
  @extends <a href="http://emberjs.com/api/classes/Ember.Controller.html">Ember.Controller</a>
  @uses <a href="http://emberjs.com/api/classes/Ember.Evented.html">Ember.Evented</a>
  @uses FlexberryLookupMixin
  @uses ErrorableControllerMixin
  @uses FlexberryFileControllerMixin
 */
export default Ember.Controller.extend(Ember.Evented, FlexberryLookupMixin, ErrorableControllerMixin, FlexberryFileControllerMixin, {
  /**
    Flag to enable return to agregator's path if possible.

    @property returnToAgregatorRoute
    @type Boolean
    @default false
   */
  returnToAgregatorRoute: false,

  /**
    Route name corresponding list form.

    @property parentRoute
    @type String
   */
  parentRoute: undefined,

  /**
    Indicates whether the current form is opened only for reading.

    @property readonly
    @type Boolean
    @default false
   */
  readonly: false,

  /**
    Readonly HTML attribute following to the `readonly` query param. According to the W3C standard, returns 'readonly' if `readonly` is `true` and `undefined` otherwise.

    TODO: Add unit test.

    @property readonlyAttr
    @type String|undefined
    @default undefined
    @readOnly
   */
  readonlyAttr: Ember.computed('readonly', function() {
    return this.get('readonly') ? 'readonly' : undefined;
  }),

  /**
    Object with settings for modal window.

    Structure object:
    - **controllerName** - Controller name, default: 'lookup-dialog'.
    - **template** - Template name modal window, default: 'lookup-dialog'.
    - **contentTemplate** - Template name that rendering after loading data, default: 'lookup-dialog-content'.
    - **loaderTemplate** - Template name that will be visible while loading data, default: 'loading'.

    @property lookupSettings
    @type Object
   */
  lookupSettings: {
    controllerName: 'lookup-dialog',
    template: 'lookup-dialog',
    contentTemplate: 'lookup-dialog-content',
    loaderTemplate: 'loading'
  },

  /**
    If `true`, all details will be deleted along with the main model.

    @property destroyHasManyRelationshipsOnModelDestroy
    @type Boolean
    @default false
   */
  destroyHasManyRelationshipsOnModelDestroy: false,

  /**
    Controller to show lookup modal window.

    @property lookupController
    @type Ember.Controller
    @default LookupDialog
   */
  lookupController: Ember.inject.controller('lookup-dialog'),

  /**
    Flag to cancel rollback of model on controller resetting.
    Flag is set for interaction of agregator's and detail's routes.

    @property modelNoRollBack
    @type Boolean
    @default false
   */
  modelNoRollBack: false,

  /**
    Defines which query parameters the controller accepts. [More info.](http://emberjs.com/api/classes/Ember.Controller.html#property_queryParams).

    @property queryParams
    @type Array
    @default ['readonly']
   */
  queryParams: ['readonly'],

  actions: {
    /**
      Default action for button 'Save'.
      You can override this action to add custom logic.

      Example:
      ```javascript
      // app/controllers/your-controller.js
      ...
      actions: {
        ...
        save() {
          if (confirm('You sure?')) {
            this.save();
          }
        }
        ...
      }
      ...
      onSaveActionFulfilled() {
        alert('Save successful!');
      }
      ...
      onSaveActionRejected() {
        alert('Save failed!');
      }
      ...
      ```

      @method actions.save
     */
    save() {
      this.save();
    },

    /**
      Default action for button 'Save and close'.
      You can override this action to add custom logic.

      Example:
      ```javascript
      // app/controllers/your-controller.js
      ...
      actions: {
        ...
        saveAndClose() {
          if (confirm('You sure?')) {
            this.save(true);
          }
        }
        ...
      }
      ...
      onSaveActionFulfilled() {
        alert('Save successful!');
      }
      ...
      onSaveActionRejected() {
        alert('Save failed!');
      }
      ...
      ```

      @method actions.saveAndClose
     */
    saveAndClose() {
      this.save(true);
    },

    /**
      Default action for button 'Delete'.
      You can override this action to add custom logic.

      Example:
      ```javascript
      // app/controllers/your-controller.js
      ...
      actions: {
        ...
        delete() {
          if (confirm('You sure?')) {
            this.delete();
          }
        }
        ...
      }
      ...
      onDeleteActionFulfilled() {
        alert('Successful delete!');
        this.close();
      }
      ...
      onDeleteActionRejected() {
        alert('Failed delete!');
      }
      ...
      ```

      @method actions.delete
     */
    delete() {
      this.delete();
    },

    /**
      Default action for button 'Close'.
      You can override this action to add custom logic.

      Example:
      ```javascript
      // app/controllers/your-controller.js
      ...
      actions: {
        ...
        close() {
          if (confirm('You sure?')) {
            this.close();
          }
        }
        ...
      }
      ...
      ```

      @method actions.close
     */
    close() {
      this.close();
    },
  },

  /**
    Save object.

    @method save
    @param {boolean} close If `true`, then save and close.
    @return {Promise}
   */
  save(close) {
    this.send('dismissErrorMessages');
    return this.get('model').save().then((model) => {
      return this._saveHasManyRelationships(model).then(() => {
        this.onSaveActionFulfilled();
        if (close) {
          this.close();
        }
      }).catch((errorData) => {
        this.onSaveActionRejected(errorData);
      });
    }).catch((errorData) => {
      this.onSaveActionRejected(errorData);
    });
  },

  /**
    Delete object, if successful transition to parent route.

    @method delete
    @return {Promise}
   */
  delete() {
    this.send('dismissErrorMessages');
    var model = this.get('model');
    if (this.get('destroyHasManyRelationshipsOnModelDestroy')) {
      return this._destroyHasManyRelationships(model).then(() => {
        return model.destroyRecord().then(() => {
          this.onDeleteActionFulfilled();
        }).catch((errorData) => {
          this.onDeleteActionRejected(errorData);
        });
      }).catch((errorData) => {
        this.onDeleteActionRejected(errorData);
      });
    } else {
      return model.destroyRecord().then(() => {
        this.onDeleteActionFulfilled();
      }).catch((errorData) => {
        this.onDeleteActionRejected(errorData);
      });
    }
  },

  /**
    Сlose edit form and transition to parent route.

    @method close
   */
  close() {
    this.transitionToParentRoute();
  },

  /**
    This method is called after successful save.
    You can override this method to add actions after save.

    ```javascript
    onSaveActionFulfilled() {
      alert('Save successful!');
    }
    ```

    @method onSaveActionFulfilled.
   */
  onSaveActionFulfilled() {
  },

  /**
    This method is called if save ended with error.
    You can override this method to add actions after unsuccessful save.

    ```javascript
    onSaveActionRejected() {
      alert('Save failed!');
    }
    ```

    @method onSaveActionRejected.
    @param {Object} errorData Info of error.
   */
  onSaveActionRejected(errorData) {
    this.rejectError(errorData, this.get('i18n').t('edit-form.save-failed-message'));
  },

  /**
    This method is called after delete object.
    You can override this method to add actions after deleted.

    ```javascript
    onDeleteActionFulfilled() {
      alert('Successful delete!');
      this.close();
    }
    ```

    @method onDeleteActionFulfilled.
   */
  onDeleteActionFulfilled() {
    this.close();
  },

  /**
    This method is called if delete ended with error.
    You can override this method to add actions after unsuccessful deleted.

    ```javascript
    onDeleteActionRejected() {
      alert('Failed delete!');
    }
    ```

    @method onDeleteActionRejected.
    @param {Object} errorData Info of error.
   */
  onDeleteActionRejected(errorData) {
    this.rejectError(errorData, this.get('i18n').t('edit-form.delete-failed-message'));
  },

  /**
    Method transition to parent route (corresponding list form).

    @method transitionToParentRoute
   */
  transitionToParentRoute() {
    // TODO: нужно учитывать пэйджинг.
    // Без сервера не обойтись, наверное. Нужно определять, на какую страницу редиректить.
    // Либо редиректить на что-то типа /{parentRoute}/page/whichContains/{object id}, а контроллер/роут там далее разрулит, куда дальше послать редирект.
    let parentRoute = this.get('parentRoute');
    Ember.assert('Parent route must be defined.', parentRoute);
    this.transitionToRoute(parentRoute);
  },

  /**
    Method to get type and attributes of component, which will be embeded in object-list-view cell.

    @method getCellComponent
    @param {Object} attr Attribute of projection property related to current table cell.
    @param {String} bindingPath Path to model property related to current table cell.
    @param {DS.Model} modelClass Model class of data record related to current table row.
    @return {Object} Object containing name & properties of component, which will be used to render current table cell ({ componentName: 'my-component',  componentProperties: { ... } }).
   */
  getCellComponent(attr, bindingPath, modelClass) {
    let cellComponent = {
      componentName: 'flexberry-textbox',
      componentProperties: null
    };

    if (attr.kind === 'belongsTo') {
      cellComponent.componentName = 'flexberry-lookup';
      return cellComponent;
    }

    let modelAttr = !Ember.isNone(modelClass) ? Ember.get(modelClass, 'attributes').get(bindingPath) : null;
    if (!(attr.kind === 'attr' && modelAttr && modelAttr.type)) {
      return cellComponent;
    }

    let modelAttrOptions = Ember.get(modelAttr, 'options');

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
        let transformInstance = getOwner(this).lookup('transform:' + modelAttr.type);
        let transformClass = !Ember.isNone(transformInstance) ? transformInstance.constructor : null;

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
    Rollback dirty hasMany relationships in the `model` recursively.
    This method invokes by `resetController` in the `edit-form` route.

    @method rollbackHasManyRelationships
    @param {DS.Model} model Record with hasMany relationships.
   */
  rollbackHasManyRelationships: function(model) {
    model.eachRelationship((name, desc) => {
      if (desc.kind === 'hasMany') {
        model.get(name).filterBy('hasDirtyAttributes', true).forEach((record) => {
          this.rollbackHasManyRelationships(record);
          record.rollbackAttributes();
        });
      }
    });
  },

  /**
    Save dirty hasMany relationships in the `model` recursively.
    This method invokes by `save` method.

    @method _saveHasManyRelationships
    @param {DS.Model} model Record with hasMany relationships.
    @return {Promise} A promise that will be resolved to array of saved records.
    @private
   */
  _saveHasManyRelationships(model) {
    let promises = Ember.A();
    model.eachRelationship((name, desc) => {
      if (desc.kind === 'hasMany') {
        model.get(name).filterBy('hasDirtyAttributes', true).forEach((record) => {
          let promise = record.save().then((record) => {
            return this._saveHasManyRelationships(record).then(() => {
              return record;
            });
          });

          promises.pushObject(promise);
        });
      }
    });

    return Ember.RSVP.all(promises);
  },

  /**
    Destroy (delete and save) all hasMany relationships in the `model` recursively.
    This method invokes by `delete` method.

    @method _destroyHasManyRelationships
    @param {DS.Model} model Record with hasMany relationships.
    @return {Promise} A promise that will be resolved to array of destroyed records.
   */
  _destroyHasManyRelationships(model) {
    let promises = Ember.A();
    model.eachRelationship((name, desc) => {
      if (desc.kind === 'hasMany') {
        model.get(name).forEach((record) => {
          let promise = this._destroyHasManyRelationships(record).then(() => {
            return record.destroyRecord();
          });

          promises.pushObject(promise);
        });
      }
    });

    return Ember.RSVP.all(promises);
  },
});
