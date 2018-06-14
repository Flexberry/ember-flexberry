/**
  @module ember-flexberry
 */

import Mixin from '@ember/object/mixin';

/*
  Mixin for route, that pagination support.

  @example
    ```javascript
    // app/controllers/employees.js
    import Controller from '@ember/controller';
    import PaginatedController from 'ember-flexberry/mixins/paginated-controller'
    export default Controller.extend(PaginatedController, {
    });
    ```

    ```javascript
    // app/routes/employees.js
    import Route from '@ember/routing/route';
    import PaginatedRoute from 'ember-flexberry/mixins/paginated-route'
    export default Route.extend(PaginatedRoute, {
    });
    ```

    ```handlebars
    <!-- app/templates/employees.hbs -->
    ...
    {{flexberry-objectlistview
      ...
      pages=pages
      perPageValue=perPageValue
      perPageValues=perPageValues
      hasPreviousPage=hasPreviousPage
      hasNextPage=hasNextPage
      previousPage=(action 'previousPage')
      gotoPage=(action 'gotoPage')
      nextPage=(action 'nextPage')
      ...
    }}
    ...
    ```

  @class PaginatedRoute
  @uses <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
 */
export default Mixin.create({
  /**
    Configuration hash for this route's queryParams. [More info](http://emberjs.com/api/classes/Ember.Route.html#property_queryParams).

    @property queryParams
    @type Object
   */
  queryParams: {
    page: { refreshModel: true },
    perPage: { refreshModel: true },
  },
});
