/**
  @module ember-flexberry
 */

import Ember from 'ember';

/**
  Mixin for controller, that restrictions on the list form.

  Example:
  ```javascript
  // app/controllers/employees.js
  import Ember from 'ember';
  import LimitedController from 'ember-flexberry/mixins/limited-controller'
  export default Ember.Controller.extend(LimitedController, {
    ...
  });
  ```

  ```javascript
  // app/routes/employees.js
  import Ember from 'ember';
  import LimitedRoute from 'ember-flexberry/mixins/limited-route'
  export default Ember.Route.extend(LimitedRoute, {
    ...
  });
  ```

  ```handlebars
  <!-- app/templates/employees.hbs -->
  ...
  {{flexberry-objectlistview
    ...
    filterButton=true
    filterText=filter
    filterByAnyMatch=(action 'filterByAnyMatch')
    ...
  }}
  ...
  ```

  @class LimitedController
  @uses <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
 */
export default Ember.Mixin.create({
  /**
    Function with limits.

    @property lf
    @type String
    @default null
   */
  lf: null,

  /**
    String with search query.

    @property filter
    @type String
    @default null
   */
  filter: null,

  /**
    Defines which query parameters the controller accepts. [More info.](http://emberjs.com/api/classes/Ember.Controller.html#property_queryParams).

    @property queryParams
    @type Array
    @default ['lf', 'filter']
   */
  queryParams: ['lf', 'filter'],

  actions: {
    /**
      Changes current pattern for objects filtering.

      @method filterByAnyMatch
      @param {String} pattern A substring that is searched in objects while filtering.
      @deprecated Use Query Language.
     */
    filterByAnyMatch(pattern) {
      Ember.Logger.error('Method `filterByAnyMatch` is deprecated, use Query Language.');
      if (this.get('filter') !== pattern) {
        this.set('filter', pattern);
      }
    },
  },

  /**
    Update current limit function.

    @method updateLimitFunction
    @param {String} limitFunction New limit function.
    @deprecated Use Query Language.
   */
  updateLimitFunction(limitFunction) {
    Ember.Logger.error('Method `updateLimitFunction` is deprecated, use Query Language.');
    if (this.get('lf') !== limitFunction) {
      // Changing lf value reloads route automatically.
      this.set('lf', limitFunction);
    }
  },
});
