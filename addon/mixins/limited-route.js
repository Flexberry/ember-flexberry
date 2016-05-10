import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: {
    lf: { refreshModel: true },
    filter: { refreshModel: true }
  },

  lf: null,

  filter: null,

  /**
   * Update limit function query parameter and reloads route if needed.
   *
   * @param {String} limitFunction New limit function to set.
   * @param {Object} params Route parameters (it is used when limit function changes in beforeModel hook).
   */
  updateLimitFunction: function(limitFunction, params) {
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
   * Returns the filter string for data loading.
   *
   * @method getFilterString
   * @param {String} modelProjection A projection used for data retrieving.
   * @param {Object} params The route URL parameters.
   */
  getFilterString: function(modelProjection, params) {
    var attrToFilterNames = [];
    var projAttrs = modelProjection.attributes;
    for (var attrName in projAttrs) {
      if (projAttrs[attrName].kind === 'attr') {
        attrToFilterNames.push(attrName);
      }
    }

    var finalString = params.lf;
    var filter = params.filter;

    if (typeof filter === 'string' && filter.length > 0) {
      finalString = combineFilterWithFilterByAnyMatch(this.store, finalString, filter, modelProjection.modelName, attrToFilterNames);
    }

    return finalString;
  }
});

function combineFilterWithFilterByAnyMatch(store, currentFilter, matchPattern, modelName, modelFields) {
  var containsExpressions = modelFields.map(function(fieldName) {
    var backendFieldName = store.serializerFor(modelName).keyForAttribute(fieldName);
    return 'contains(' + backendFieldName + ', \'' + matchPattern + '\')';
  });

  var newExpression = containsExpressions.join(' and ');
  if (typeof currentFilter === 'string' && currentFilter.length > 0) {
    newExpression = '(' + currentFilter + ') and (' + newExpression + ')';
  }

  return newExpression;
}
