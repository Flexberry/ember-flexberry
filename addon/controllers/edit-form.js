/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryLookupMixin from '../mixins/flexberry-lookup-controller';
import ErrorableControllerMixin from '../mixins/errorable-controller';
import FlexberryFileControllerMixin from '../mixins/flexberry-file-controller';

const { getOwner } = Ember;

/**
  Base controller for the Edit Forms.

  This class re-exports to the application as `/controllers/edit-form`.
  So, you can inherit from `./edit-form`, even if file `app/controllers/edit-form.js` is not presented in the application.

  @example
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
    Route name corresponding this edit form.

    @property routeName
    @type String
  */
  routeName: undefined,

  /**
    Indicates whether the current form is opened only for reading.

    @property readonly
    @type Boolean
    @default false
  */
  readonly: false,

  /**
    State form. A form is in different states: loading, success, error.

    @property state
    @type String
  */
  state: undefined,

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

  /**
    Object with developer user settings.

    @property developerUserSettings
    @type Object
    @default undefined
  */
  developerUserSettings: undefined,

  actions: {
    /**
      Default action for button 'Save'.
      You can override this action to add custom logic.

      @example
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

      @example
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

      @example
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

      @example
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
    @param {Boolean} close If `true`, then save and close.
    @return {Promise}
  */
  save(close) {
    this.send('dismissErrorMessages');

    this.onSaveActionStarted();
    this.set('state', 'loading');

    let savePromise = this.get('model').save().then((model) => {
      return this._saveHasManyRelationships(model).then(() => {
        this.set('state', 'success');
        this.onSaveActionFulfilled();
        if (close) {
          this.set('state', '');
          this.close();
        } else {
          let routeName = this.get('routeName');
          if (routeName.indexOf('.new') > 0) {
            let qpars = {};
            let queryParams = this.get('queryParams');
            queryParams.forEach(function(item, i, params) {
              qpars[item] = this.get(item);
            }, this);
            let transitionQuery = {};
            transitionQuery.queryParams = qpars;
            this.transitionToRoute(routeName.slice(0, -4), this.get('model'), transitionQuery);
          }
        }
      });
    }).catch((errorData) => {
      this.set('state', 'error');
      this.onSaveActionRejected(errorData);
    }).finally((data) => {
      this.onSaveActionAlways(data);
    });

    return savePromise;
  },

  /**
    Delete object, if successful transition to parent route.

    @method delete
    @return {Promise}
  */
  delete() {
    this.send('dismissErrorMessages');

    this.onDeleteActionStarted();
    this.set('state', 'loading');

    let model = this.get('model');
    let deletePromise = null;
    if (this.get('destroyHasManyRelationshipsOnModelDestroy')) {
      deletePromise = this.destroyHasManyRelationships(model).then(() => {
        return model.destroyRecord().then(() => {
          this.onDeleteActionFulfilled();
        });
      });
    } else {
      deletePromise = model.destroyRecord().then(() => {
        this.onDeleteActionFulfilled();
      });
    }

    deletePromise.catch((errorData) => {
      model.rollbackAttributes();
      this.set('state', 'error');
      this.onDeleteActionRejected(errorData);
    }).finally((data) => {
      this.onDeleteActionAlways(data);
    });

    return deletePromise;
  },

  /**
    Сlose edit form and transition to parent route.

    @method close
  */
  close() {
    this.set('state', '');
    this.onCloseActionStarted();
    this.transitionToParentRoute();
  },

  /**
    This method will be invoked before save operation will be called.
    Override this method to add some custom logic on save operation start.

    @example
      ```javascript
      onSaveActionStarted() {
        alert('Save operation started!');
      }
      ```
    @method onSaveActionStarted.
  */
  onSaveActionStarted() {
  },

  /**
    This method will be invoked when save operation successfully completed.
    Override this method to add some custom logic on save operation success.

    @example
      ```javascript
      onSaveActionFulfilled() {
        alert('Save operation succeed!');
      }
      ```
    @method onSaveActionFulfilled.
  */
  onSaveActionFulfilled() {
  },

  /**
    This method will be invoked when save operation completed, but failed.
    Override this method to add some custom logic on save operation fail.

    @example
      ```javascript
      onSaveActionRejected() {
        alert('Save operation failed!');
      }
      ```
    @method onSaveActionRejected.
    @param {Object} errorData Data about save operation fail.
  */
  onSaveActionRejected(errorData) {
    this.rejectError(errorData, this.get('i18n').t('forms.edit-form.save-failed-message'));
  },

  /**
    This method will be invoked always when save operation completed,
    regardless of save promise's state (was it fulfilled or rejected).
    Override this method to add some custom logic on save operation completion.

    @example
      ```js
      onSaveActionAlways(data) {
        alert('Save operation completed!');
      }
      ```

    @method onSaveActionAlways.
    @param {Object} data Data about completed save operation.
  */
  onSaveActionAlways(data) {
  },

  /**
    This method will be invoked before delete operation will be called.
    Override this method to add custom logic on delete operation start.

    @example
      ```javascript
      onDeleteActionStarted() {
        alert('Delete operation started!');
      }
      ```
    @method onDeleteActionStarted.
  */
  onDeleteActionStarted() {
  },

  /**
    This method will be invoked when delete operation successfully completed.
    Override this method to add some custom logic on delete operation success.

    @example
      ```javascript
      onDeleteActionFulfilled() {
        alert('Delete operation succeed!');
        this.close();
      }
      ```
    @method onDeleteActionFulfilled.
  */
  onDeleteActionFulfilled() {
    this.close();
  },

  /**
    This method will be invoked when delete operation completed, but failed.
    Override this method to add some custom logic on delete operation fail.

    @example
      ```javascript
      onDeleteActionRejected() {
        alert('Delete operation failed!');
      }
      ```
    @method onDeleteActionRejected.
    @param {Object} errorData Data about delete operation fail.
  */
  onDeleteActionRejected(errorData) {
    this.rejectError(errorData, this.get('i18n').t('forms.edit-form.delete-failed-message'));
  },

  /**
    This method will be invoked always when delete operation completed,
    regardless of save promise's state (was it fulfilled or rejected).
    Override this method to add some custom logic on delete operation completion.

    @example
      ```js
      onDeleteActionAlways(data) {
        alert('Delete operation completed!');
      }
      ```

    @method onSaveActionAlways.
    @param {Object} data Data about completed save operation.
  */
  onDeleteActionAlways(data) {
  },

  /**
    This method will be invoked before close method will be called.
    Override this method to add custom logic on close method start.

    @example
      ```javascript
      onCloseActionStarted() {
        alert('Form will be closed right now!');
      }
      ```
    @method onDeleteActionStarted.
  */
  onCloseActionStarted() {
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
      cellComponent.componentName = undefined;
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
        cellComponent.componentProperties = { inputClass: 'fluid' };
        break;
      default:

        // Current cell type is possibly custom transform.
        let transformInstance = getOwner(this).lookup('transform:' + modelAttr.type);
        let transformClass = !Ember.isNone(transformInstance) ? transformInstance.constructor : null;

        // Handle enums (extended from transforms/flexberry-enum.js).
        if (transformClass && transformClass.isEnum) {
          cellComponent.componentName = 'flexberry-dropdown';
          cellComponent.componentProperties = {
            items: transformInstance.get('captions'),
            class: 'compact fluid'
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
    @deprecated Use `rollbackHasMany` from model.
  */
  rollbackHasManyRelationships(model) {
    Ember.deprecate(`This method deprecated, use 'rollbackHasMany' from model.`);
    model.rollbackHasMany();
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
