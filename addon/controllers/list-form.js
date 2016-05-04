/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import PaginatedControllerMixin from '../mixins/paginated-controller';
import SortableControllerMixin from '../mixins/sortable-controller';
import LimitedControllerMixin from '../mixins/limited-controller';
import FlexberryOlvToolbarMixin from '../mixins/olv-toolbar-mixin';


/**
 * Base controller for the List Forms.

  This class re-exports to the application as `/controllers/list-form`.
  So, you can inherit from `./list-form`, even if file `app/controllers/list-form.js`
  is not presented in the application.

  Example:
  ```js
  // app/controllers/employees.js
  import ListFormController from './list-form';
  export default ListFormController.extend({
  });
  ```

  If you want to add some common logic on all List Forms, you can define
  (actually override) `app/controllers/list-form.js` as follows:
  ```js
  // app/controllers/list-form.js
  import ListFormController from 'ember-flexberry/controllers/list-form';
  export default ListFormController.extend({
  });
  ```

 * @class ListFormController
 * @extends Ember.Controller
 * @uses PaginatedControllerMixin
 * @uses SortableControllerMixin
 * @uses LimitedControllerMixin
 */
export default Ember.Controller.extend(PaginatedControllerMixin, SortableControllerMixin, LimitedControllerMixin, FlexberryOlvToolbarMixin, {
});
