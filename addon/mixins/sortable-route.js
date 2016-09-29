/**
  @module ember-flexberry
 */

import Ember from 'ember';

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
    Convert string with sorting parameters to object.

    Expected string type: '+Name1-Name2...', where: '+' and '-' - sorting direction, 'NameX' - property name for soring.

    @method deserializeSortingParam
    @param {String} paramString String with sorting parameters.
    @returns {Array} Array objects type: { propName: 'NameX', direction: 'asc|desc' }
   */
  deserializeSortingParam(paramString) {
    let result = [];
    while (paramString) {
      let order = paramString.charAt(0);
      let direction = order === '+' ? 'asc' :  order === '-' ? 'desc' : null;
      paramString = paramString.substring(1, paramString.length);
      let nextIndices = this._getNextIndeces(paramString);
      let nextPosition = Math.min.apply(null, nextIndices);
      let propName = paramString.substring(0, nextPosition);
      paramString = paramString.substring(nextPosition);

      if (direction) {
        result.push({
          propName: propName,
          direction: direction
        });
      }
    }

    return result;
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

  /**
    Return index start next sorting parameters.

    @method _getNextIndeces
    @param {String} paramString
    @return {Number}
    @private
   */
  _getNextIndeces(paramString) {
    let nextIndices = ['+', '-', '!'].map(function(element) {
      let pos = paramString.indexOf(element);
      return pos === -1 ? paramString.length : pos;
    });

    return nextIndices;
  },
});
