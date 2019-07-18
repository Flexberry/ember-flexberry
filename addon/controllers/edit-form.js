/**
  @module ember-flexberry
*/

import Ember from 'ember';
import Errors from 'ember-validations/errors';
import FlexberryLookupMixin from '../mixins/flexberry-lookup-controller';
import ErrorableControllerMixin from '../mixins/errorable-controller';
import FlexberryFileControllerMixin from '../mixins/flexberry-file-controller';
import needSaveCurrentAgregator from '../utils/need-save-current-agregator';
import getCurrentAgregator from '../utils/get-current-agregator';
import PaginatedControllerMixin from '../mixins/paginated-controller';
import SortableControllerMixin from '../mixins/sortable-controller';
import LimitedControllerMixin from '../mixins/limited-controller';
import FlexberryOlvToolbarMixin from '../mixins/olv-toolbar-controller';
import FlexberryObjectlistviewHierarchicalControllerMixin from '../mixins/flexberry-objectlistview-hierarchical-controller';

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
export default Ember.Controller.extend(
Ember.Evented,
FlexberryLookupMixin,
ErrorableControllerMixin,
FlexberryFileControllerMixin,
PaginatedControllerMixin,
SortableControllerMixin,
LimitedControllerMixin,
FlexberryOlvToolbarMixin,
FlexberryObjectlistviewHierarchicalControllerMixin, {
  /**
    Controller to show colsconfig modal window.

    @property lookupController
    @type <a href="http://emberjs.com/api/classes/Ember.InjectedProperty.html">Ember.InjectedProperty</a>
    @default Ember.inject.controller('colsconfig-dialog')
  */
  colsconfigController: Ember.inject.controller('colsconfig-dialog'),

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
    Parent route record ID.

    @property parentRouteRecordId
    @type String
  */
  parentRouteRecordId: undefined,

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
    Service for managing the state of the application.

    @property appState
    @type AppStateService
  */
  appState: Ember.inject.service(),

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

  /**
    Object with default developer user settings.

    @property defaultDeveloperUserSettings
    @type Object
    @default undefined
  */
  defaultDeveloperUserSettings: undefined,

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
      @param {Boolean} skipTransition If `true`, then transition during close form process will be skipped after save.
    */
    saveAndClose(skipTransition) {
      this.save(true, skipTransition);
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
              this.delete(false);
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
      @param {Boolean} skipTransition If `true`, then transition during close form process will be skipped after delete.
    */
    delete(skipTransition) {
      this.delete(skipTransition);
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
      @param {Boolean} skipTransition If `true`, then transition during close form process will be skipped.
      @param {Boolean} rollBackModel Flag: indicates whether to set flag to roll back model after route leave (if `true`) or not (if `false`).
    */
    close(skipTransition, rollBackModel) {
      this.close(skipTransition, rollBackModel);
    },

    /**
      Hook that executes before deleting all records on all pages.
      Need to be overriden in corresponding application controller.
    */
    beforeDeleteAllRecords(modelName, data) {
      data.cancel = true;
      Ember.assert(`Please specify 'beforeDeleteAllRecords' action for '${this.componentName}' list compoenent in corresponding controller`);
    },

    /**
      Sorting list by column.

      @method actions.sortByColumn
      @param {Object} column Column for sorting.
    */
    sortByColumn: function(column, componentName) {
      this._super.apply(this, [column, componentName, 'sorting']);
    },

    /**
      Add column into end list sorting.

      @method actions.addColumnToSorting
      @param {Object} column Column for sorting.
    */
    addColumnToSorting: function(column, componentName) {
      this._super.apply(this, [column, componentName, 'sorting']);
    },
  },

  /**
    Save object.

    @method save
    @param {Boolean} close If `true`, then save and close.
    @param {Boolean} skipTransition If `true`, then transition after save process will be skipped.
    @return {Promise}
  */
  save(close, skipTransition) {
    this.send('dismissErrorMessages');

    this.onSaveActionStarted();
    this.get('appState').loading();

    const afterSaveModelFunction = () => {
      this.get('appState').success();
      this.onSaveActionFulfilled();
      if (close) {
        this.get('appState').reset();
        this.close(skipTransition);
      } else if (!skipTransition) {
        const routeName = this.get('routeName');
        if (routeName.indexOf('.new') > 0) {
          const qpars = {};
          const queryParams = this.get('queryParams');
          queryParams.forEach(function(item) {
            qpars[item] = this.get(item);
          }, this);
          let transitionQuery = {};
          transitionQuery.queryParams = qpars;
          transitionQuery.queryParams.recordAdded = true;
          const parentParameters = {
            parentRoute: this.get('parentRoute'),
            parentRouteRecordId: this.get('parentRouteRecordId')
          };
          transitionQuery.queryParams.parentParameters = parentParameters;
          this.transitionToRoute(routeName.slice(0, -4), this.get('model'), transitionQuery);
        }
      }
    };

    let savePromise;
    const model = this.get('model');

    // This is possible when using offline mode.
    const agragatorModel = getCurrentAgregator.call(this);
    if (needSaveCurrentAgregator.call(this, agragatorModel)) {
      savePromise = this._saveHasManyRelationships(model).then((result) => {
        const errors = Ember.A(result || []).filterBy('state', 'rejected');
        if (!Ember.isEmpty(errors)) {
          return Ember.RSVP.reject(errors);
        }

        return agragatorModel.save();
      });
    } else {
      const unsavedModels = this._getModelWithHasMany(model).filterBy('hasDirtyAttributes');
      savePromise = unsavedModels.length > 1 ? this.get('store').batchUpdate(unsavedModels) : model.save();
    }

    return savePromise.then(afterSaveModelFunction).catch((errorData) => {
      this.get('appState').error();
      this.onSaveActionRejected(errorData);
      return Ember.RSVP.reject(errorData);
    }).finally((data) => {
      this.onSaveActionAlways(data);
    });
  },

  /**
    Delete object, if successful transition to parent route.

    @method delete
    @param {Boolean} skipTransition If `true`, then transition during close form process will be skipped after delete.
    @return {Promise}
  */
  delete(skipTransition) {
    this.send('dismissErrorMessages');

    this.onDeleteActionStarted();
    this.get('appState').loading();

    let model = this.get('model');
    let deletePromise = null;
    let deleteOperation = () => {
      let agragatorModel = getCurrentAgregator.call(this);
      if (needSaveCurrentAgregator.call(this, agragatorModel)) {
        return agragatorModel.save().then(() => {
          this.onDeleteActionFulfilled(skipTransition);
        });
      } else {
        this.onDeleteActionFulfilled(skipTransition);
      }
    };

    if (this.get('destroyHasManyRelationshipsOnModelDestroy')) {
      deletePromise = this.destroyHasManyRelationships(model).then(() => {
        return model.destroyRecord().then(deleteOperation);
      });
    } else {
      deletePromise = model.destroyRecord().then(deleteOperation);
    }

    deletePromise.catch((errorData) => {
      model.rollbackAll();
      this.get('appState').error();
      this.onDeleteActionRejected(errorData);
    }).finally((data) => {
      this.onDeleteActionAlways(data);
    });

    return deletePromise;
  },

  /**
    Сlose edit form and transition to parent route.

    @method close
    @param {Boolean} skipTransition If `true`, then transition during close form process will be skipped.
    @param {Boolean} rollBackModel Flag: indicates whether to set flag to roll back model after route leave (if `true`) or not (if `false`).
  */
  close(skipTransition, rollBackModel) {
    this.get('appState').reset();
    this.onCloseActionStarted();
    if (!skipTransition) {
      this.transitionToParentRoute(skipTransition, rollBackModel);
    }
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
    Ember.$('.ui.form .full.height').scrollTop(0);
    if (!(errorData instanceof Errors)) {
      this.send('handleError', errorData);
    }
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
        this.close(false);
      }
      ```
    @method onDeleteActionFulfilled.
    @param {Boolean} skipTransition If `true`, then transition during close form process (default behavior) will be skipped.
  */
  onDeleteActionFulfilled(skipTransition) {
    this.close(skipTransition);
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
    this.send('error', errorData);
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
    @param {Boolean} skipTransition If `true`, then transition will be skipped.
  */
  transitionToParentRoute(skipTransition) {
    if (!skipTransition) {
      // TODO: нужно учитывать пэйджинг.
      // Без сервера не обойтись, наверное. Нужно определять, на какую страницу редиректить.
      // Либо редиректить на что-то типа /{parentRoute}/page/whichContains/{object id}, а контроллер/роут там далее разрулит, куда дальше послать редирект.
      let parentRoute = this.get('parentRoute');
      Ember.assert('Parent route must be defined.', parentRoute);
      let parentRouteRecordId = this.get('parentRouteRecordId');
      if (Ember.isNone(parentRouteRecordId)) {
        this.transitionToRoute(parentRoute);
      } else {
        this.transitionToRoute(parentRoute, parentRouteRecordId);
      }
    }
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
        cellComponent.componentName = 'flexberry-simpledatetime';
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
    Service that lets interact between agregator's and detail's form.

    @property flexberryDetailInteractionService
    @type Ember.Service
    @readOnly
    @private
  */
  _flexberryDetailInteractionService: Ember.inject.service('detail-interaction'),

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
            return this._saveHasManyRelationships(record).then((result) => {
              if (result && Ember.isArray(result) && result.length > 0) {
                let arrayWrapper = Ember.A();
                arrayWrapper.addObjects(result);
                let errors = arrayWrapper.filterBy('state', 'rejected');
                return errors.length > 0 ? Ember.RSVP.reject(errors) : record;
              } else {
                return record;
              }
            });
          });

          promises.pushObject(promise);
        });
      }
    });

    return Ember.RSVP.allSettled(promises);
  },

  /**
    Returns an array with the model and all its `hasMany` relationships, obtained recursively, for each model.

    @method _getModelWithHasMany
    @param {DS.Model} model The object model.
    @return {Ember.NativeArray} An array with the model and all its `hasMany` relationships.
  */
  _getModelWithHasMany(model) {
    const models = Ember.A([model]);

    model.eachRelationship((name, desc) => {
      if (desc.kind === 'hasMany') {
        const hasMany = model.get(name);
        models.addObjects(hasMany);
        hasMany.map(this._getModelWithHasMany, this).forEach((hasMany) => {
          models.addObjects(hasMany);
        });
      }
    });

    return models;
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

    return Ember.RSVP.allSettled(promises);
  },
});
