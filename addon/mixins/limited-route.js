/**
  @module ember-flexberry
 */

import Ember from 'ember';

/**
  Mixin for route, that restrictions on the list form.

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

  @class LimitedRoute
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
    Configuration hash for this route's queryParams. [More info](http://emberjs.com/api/classes/Ember.Route.html#property_queryParams).

    @property queryParams
    @type Object
   */
  queryParams: {
    lf: { refreshModel: true },
    filter: { refreshModel: true },
  },

  /**
    Update limit function query parameter and reloads route if needed.

    @param {String} limitFunction New limit function to set.
    @param {Object} params Route parameters (it is used when limit function changes in beforeModel hook).
    @deprecated Use Query Language.
   */
  updateLimitFunction(limitFunction, params) {
    Ember.Logger.error('Method `updateLimitFunction` is deprecated, use Query Language.');
    if (!params) {
      this.transitionTo({ queryParams: limitFunction });
    } else {
      if (params && params.lf !== limitFunction) {
        params.lf = limitFunction;
        this.transitionTo({ queryParams: params });
      }
    }
  },

  /**
    Returns the filter string for data loading.

    @method getFilterString
    @param {String} modelProjection A projection used for data retrieving.
    @param {Object} params The route URL parameters.
    @deprecated Use Query Language.
   */
  getFilterString(modelProjection, params) {
    Ember.Logger.error('Method `getFilterString` is deprecated, use Query Language.');
    let attrToFilterNames = [];
    let projAttrs = modelProjection.attributes;
    for (var attrName in projAttrs) {
      if (projAttrs[attrName].kind === 'attr') {
        attrToFilterNames.push(attrName);
      }
    }

    let finalString = params.lf;
    let filter = params.filter;

    if (typeof filter === 'string' && filter.length > 0) {
      finalString = this._combineFilterWithFilterByAnyMatch(this.store, finalString, filter, modelProjection.modelName, attrToFilterNames);
    }

    return finalString;
  },

  /**
    Combine new filter with current filter.

    @method _combineFilterWithFilterByAnyMatch
    @param {DS.Store} store
    @param {String} currentFilter
    @param {String} matchPattern
    @param {String} modelName
    @param {String} modelFields
    @deprecated Use Query Language.
   */
  _combineFilterWithFilterByAnyMatch(store, currentFilter, matchPattern, modelName, modelFields) {
    Ember.Logger.error('Method `_combineFilterWithFilterByAnyMatch` is deprecated, use Query Language.');
    let containsExpressions = modelFields.map(function(fieldName) {
      let backendFieldName = store.serializerFor(modelName).keyForAttribute(fieldName);
      return 'contains(' + backendFieldName + ', \'' + matchPattern + '\')';
    });

    let newExpression = containsExpressions.join(' and ');
    if (typeof currentFilter === 'string' && currentFilter.length > 0) {
      newExpression = '(' + currentFilter + ') and (' + newExpression + ')';
    }

    return newExpression;
  },
});
