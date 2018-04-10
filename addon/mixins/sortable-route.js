/**
  @module ember-flexberry
 */

import Mixin from '@ember/object/mixin';

/**
  Mixin for route, that sorting on the list form.

  @example
    ```javascript
    // app/controllers/employees.js
    import Ember from 'ember';
    import SortableController from 'ember-flexberry/mixins/sortable-controller'
    export default Controller.extend(SortableController, {
    });
    ```

    ```javascript
    // app/routes/employees.js
    import Ember from 'ember';
    import SortableRoute from 'ember-flexberry/mixins/sortable-route'
    export default Route.extend(SortableRoute, {
    });
    ```

    ```handlebars
    <!-- app/templates/employees.hbs -->
    ...
    {{flexberry-objectlistview
      ...
      orderable=true
      sortByColumn=(action 'sortByColumn')
      addColumnToSorting=(action 'addColumnToSorting')
      ...
    }}
    ...
    ```

  @class SortableRoute
  @uses <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
 */
export default Mixin.create({
  /**
    Configuration hash for this route's queryParams. [More info](http://emberjs.com/api/classes/Ember.Route.html#property_queryParams).

    @property queryParams
    @type Object
   */
  queryParams: {
    sort: { refreshModel: true }
  },

  /**
    Apply sorting to result list.

    @method includeSorting
    @param {DS.Model} model
    @param {String} sorting
    @return {DS.Model}
   */
  includeSorting(model, sorting) {
    model.set('sorting', sorting);
    return model;
  },
});
