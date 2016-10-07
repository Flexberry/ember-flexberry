/**
  @module ember-flexberry
 */

import Ember from 'ember';
import PaginatedControllerMixin from '../mixins/paginated-controller';
import SortableControllerMixin from '../mixins/sortable-controller';
import LimitedControllerMixin from '../mixins/limited-controller';
import FlexberryOlvToolbarMixin from '../mixins/olv-toolbar-controller';
import ColsConfigDialogMixin from '../mixins/colsconfig-dialog-controller';

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
  @extends <a href="http://emberjs.com/api/classes/Ember.Controller.html">Ember.Controller</a>
  @uses PaginatedControllerMixin
  @uses SortableControllerMixin
  @uses LimitedControllerMixin
 */
export default Ember.Controller.extend(PaginatedControllerMixin,
  SortableControllerMixin,
  LimitedControllerMixin,
  FlexberryOlvToolbarMixin,
  FlexberryObjectlistviewHierarchicalControllerMixin,
  ColsConfigDialogMixin, {
  /**
    Controller to show colsconfig modal window.

    @property lookupController
    @type <a href="http://emberjs.com/api/classes/Ember.InjectedProperty.html">Ember.InjectedProperty</a>
    @default Ember.inject.controller('colsconfig-dialog')
  */
  colsconfigController: Ember.inject.controller('colsconfig-dialog'),

  /**
    Method to get type and attributes of component, which will be embeded in object-list-view cell.

    @method getCellComponent
    @param {Object} attr Attribute of projection property related to current table cell.
    @param {String} bindingPath Path to model property related to current table cell.
    @param {Object} modelClass Model class of data record related to current table row.
    @return {Object} Object containing name & properties of component, which will be used to render current table cell
    ({ componentName: 'my-component',  componentProperties: { ... } }).
  */
  getCellComponent(attr, bindingPath, modelClass) {
    let cellComponent = {
      componentName: undefined,
      componentProperties: null
    };

    return cellComponent;
  },

  activateTime: null,
  afterModelTime: null,
  beforeModelTime: null,
  initTime: null,
  modelTime: null,
  renderTemplateTime: null,
  setupControllerTime: null

});
