/**
  @module ember-flexberry
 */

import Mixin from '@ember/object/mixin';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import serializeSortingParam from '../utils/serialize-sorting-param';

/**
  Mixin for route, that sorting on the list form.

  @example
    ```javascript
    // app/controllers/employees.js
    import Controller from '@ember/controller';
    import SortableController from 'ember-flexberry/mixins/sortable-controller'
    export default Controller.extend(SortableController, {
    });
    ```

    ```javascript
    // app/routes/employees.js
    import Route from '@ember/routing/route';
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
  @uses <a href="https://www.emberjs.com/api/ember/release/classes/Mixin">Mixin</a>
 */
export default Mixin.create({
  /**
    Configuration hash for this route's queryParams. [More info](https://www.emberjs.com/api/ember/release/classes/Route/properties/queryParams?anchor=queryParams).

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
  objectlistviewEvents: service(),

  /**
    Apply sorting to result list.

    @method includeSorting
    @param {DS.Model} model
    @param {String} sorting
    @return {DS.Model}
   */
  includeSorting(model, sorting) {
    if (model) {
      model.set('sorting', sorting);
    }

    return model;
  },

  /**
    Sets sorting and reload component content by component name.

    @method setSorting
    @param {String} componentName Component name.
    @param {Array} sorting Sorting object.
  */
  setSorting(componentName, sorting) {
    let sort = serializeSortingParam(A(sorting));
    this.router.transitionTo(this.currentRouteName, { queryParams: { sort: sort } });
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
