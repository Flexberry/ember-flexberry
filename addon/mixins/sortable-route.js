/**
  @module ember-flexberry
 */

import Ember from 'ember';
import serializeSortingParam from '../utils/serialize-sorting-param';

/**
  Mixin for route, that sorting on the list form.

  @example
    ```javascript
    // app/controllers/employees.js
    import Ember from 'ember';
    import SortableController from 'ember-flexberry/mixins/sortable-controller'
    export default Ember.Controller.extend(SortableController, {
    });
    ```

    ```javascript
    // app/routes/employees.js
    import Ember from 'ember';
    import SortableRoute from 'ember-flexberry/mixins/sortable-route'
    export default Ember.Route.extend(SortableRoute, {
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
export default Ember.Mixin.create({
  /**
    Configuration hash for this route's queryParams. [More info](http://emberjs.com/api/classes/Ember.Route.html#property_queryParams).

    @property queryParams
    @type Object
   */
  queryParams: {
    sort: { refreshModel: true }
  },

  /**
    Service that triggers objectlistview events.

    @property objectlistviewEvents
    @type Service
  */
  objectlistviewEvents: Ember.inject.service(),

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

  /**
    Sets sorting and reload component content by component name.

    @method setSorting
    @param {String} componentName Component name.
    @param {Array} sorting Sorting object.
  */
  setSorting(componentName, sorting) {
    let sort = serializeSortingParam(Ember.A(sorting));
    this.transitionTo(this.currentRouteName, { queryParams: { sort: sort } });
  },

  setupController() {
    this._super(...arguments);

    this.get('objectlistviewEvents').on('setSorting', this, this.setSorting);
  },

  resetController() {
    this._super(...arguments);

    this.get('objectlistviewEvents').off('setSorting', this, this.setSorting);
  }
});
