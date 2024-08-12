/**
  @module ember-flexberry
 */

import Controller, { inject } from '@ember/controller';
import { isNone } from '@ember/utils';
import { assert } from '@ember/debug';
import { service } from '@ember/service';
import PaginatedControllerMixin from '../mixins/paginated-controller';
import SortableControllerMixin from '../mixins/sortable-controller';
import LimitedControllerMixin from '../mixins/limited-controller';
import FlexberryOlvToolbarMixin from '../mixins/olv-toolbar-controller';
import ColsConfigDialogMixin from '../mixins/colsconfig-dialog-controller';
import ErrorableControllerMixin from '../mixins/errorable-controller';

import FlexberryObjectlistviewHierarchicalControllerMixin from '../mixins/flexberry-objectlistview-hierarchical-controller';

/**
  Base controller for the List Forms.

  This class re-exports to the application as `/controllers/list-form`.
  So, you can inherit from `./list-form`, even if file `app/controllers/list-form.js` is not presented in the application.

  Example:
  ```javascript
  // app/controllers/employees.js
  import ListFormController from './list-form';
  export default ListFormController.extend({
  });
  ```

  If you want to add some common logic on all List Forms, you can override `app/controllers/list-form.js` as follows:
  ```javascript
  // app/controllers/list-form.js
  import ListFormController from 'ember-flexberry/controllers/list-form';
  export default ListFormController.extend({
  });
  ```

  @class ListFormController
  @extends <a href="https://emberjs.com/api/ember/release/classes/Controller">Controller</a>
  @uses PaginatedControllerMixin
  @uses SortableControllerMixin
  @uses LimitedControllerMixin
 */
export default Controller.extend(PaginatedControllerMixin,
  SortableControllerMixin,
  LimitedControllerMixin,
  FlexberryOlvToolbarMixin,
  FlexberryObjectlistviewHierarchicalControllerMixin,
  ColsConfigDialogMixin,
  ErrorableControllerMixin, {
  /**
    Controller to show colsconfig modal window.

    @property lookupController
    @type <a href="https://www.emberjs.com/api/ember/release/functions/@ember%2Fcontroller/inject">Ember.InjectedProperty</a>
    @default controller('colsconfig-dialog')
  */
  colsconfigController: inject('colsconfig-dialog'),

  router: service(),

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

  /**
    State form. A form is in different states: loading, success, error.

    @property state
    @type String
  */
  state: undefined,

  actions: {
    /**
      Hook that executes before deleting all records on all pages.
      Need to be overriden in corresponding application controller.
    */
    beforeDeleteAllRecords(modelName, data) {
      data.cancel = true;
      assert(`Please specify 'beforeDeleteAllRecords' action for '${this.componentName}' list compoenent in corresponding controller`);
    },

    /**
      Table row click handler.

      @method actions.objectListViewRowClick
      @public

      @param {EmberObject} record Record related to clicked table row
    */
    rowClick(record, options) {
      this.send("objectListViewRowClick", record, options);
    }
  },

  /**
    Method to get type and attributes of component, which will be embeded in object-list-view cell.

    @method getCellComponent
    @param {Object} attr Attribute of projection property related to current table cell.
    @param {String} bindingPath Path to model property related to current table cell.
    @param {Object} modelClass Model class of data record related to current table row.
    @return {Object} Object containing name & properties of component, which will be used to render current table cell
    ({ componentName: 'my-component',  componentProperties: { ... } }).
  */
  /* eslint-disable no-unused-vars */
  getCellComponent(attr, bindingPath, modelClass) {
    let cellComponent = {
      componentName: undefined,
      componentProperties: null
    };

    return cellComponent;
  },
  /* eslint-enable no-unused-vars */

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
      }
      ```
    @method onDeleteActionFulfilled.
  */
  onDeleteActionFulfilled() {
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
  onDeleteActionRejected(errorData, record) {
    if (!isNone(record)) {
      this.rejectError(errorData, `Unable to delete a record: ${record.toString()}.`);
    }
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
  /* eslint-disable no-unused-vars */
  onDeleteActionAlways(data) {
  }
  /* eslint-enable no-unused-vars */
});
