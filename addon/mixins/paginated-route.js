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
  @uses <a href="https://www.emberjs.com/api/ember/release/classes/Mixin">Mixin</a>
 */
export default Mixin.create({
  /**
    Configuration hash for this route's queryParams. [More info](https://www.emberjs.com/api/ember/release/classes/Route/properties/queryParams?anchor=queryParams).

    @property queryParams
    @type Object
   */
  queryParams: {
    page: { refreshModel: true },
    perPage: { refreshModel: true },
  },
});
