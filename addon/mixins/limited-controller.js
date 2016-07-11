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
    Defines which query parameters the controller accepts. [More info.](http://emberjs.com/api/classes/Ember.Controller.html#property_queryParams).

    @property queryParams
    @type Array
    @default ['lf', 'filter']
   */
  queryParams: ['filter'],

  /**
    String with search query.

    @property filter
    @type String
    @default null
   */
  filter: null,

  actions: {
    /**
      Changes current pattern for objects filtering.

      @method filterByAnyMatch
      @param {String} pattern A substring that is searched in objects while filtering.
    */
    filterByAnyMatch(pattern) {
      if (this.get('filter') !== pattern) {
        this.setProperties({
          filter: pattern,
          page: 1
        });
      }
    },
  },
});
