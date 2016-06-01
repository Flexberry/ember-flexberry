/**
 * @module ember-flexberry
 */

import Ember from 'ember';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import Condition from 'ember-flexberry-data/query/condition';
import { StringPredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';

/**
 * Mixin for {{#crossLink "DS.Controller"}}Controller{{/crossLink}} to support data reload.
 *
 * @class ReloadListMixin
 * @extends Ember.Mixin
 * @public
 */
export default Ember.Mixin.create({
  /**
   * It reloads data by parameters.

     This method is called to get data for flexberry-objectlistview
     (both on list-form and lookup modal window).

   * @method reloadList
   * @public
   *
   * @param {Object} options Method options.
   * @param {String} [options.modelName] Type of records to load.
   * @param {String} [options.projectionName] Projection name to load data by.
   * @param {String} [options.perPage] Page size.
   * @param {String} [options.page] Current page.
   * @param {String} [options.sorting] Current sorting.
   * @param {String} [options.filter] Current filter.
   * @return {Promise}  A promise, which is resolved with a set of loaded records once the server returns.
   */
  reloadList: function(options) {
    let store = this.store;
    Ember.assert('Store for data loading is not defined.', store);

    let reloadOptions = Ember.merge({
      modelName: undefined,
      projectionName: undefined,
      perPage: undefined,
      page: undefined,
      sorting: undefined,
      filter: undefined
    }, options);

    let modelName = reloadOptions.modelName;
    Ember.assert('Model name for data loading is not defined.', modelName);

    let projectionName = reloadOptions.projectionName;
    Ember.assert('Projection name for data loading is not defined.', projectionName);

    let modelConstructor = store.modelFor(modelName);
    let projection = Ember.get(modelConstructor, 'projections')[projectionName];
    if (!projection) {
      throw new Error(`No projection with '${projectionName}' name defined in '${modelName}' model.`);
    }

    let perPage = reloadOptions.perPage;
    let page = reloadOptions.page;
    let pageNumber = parseInt(page, 10);
    let perPageNumber = parseInt(perPage, 10);
    Ember.assert('page must be greater than zero.', pageNumber > 0);
    Ember.assert('perPage must be greater than zero.', perPageNumber > 0);

    let serializer = store.serializerFor(modelName);
    Ember.assert(`No serializer defined for model '${modelName}'.`, serializer);

    let sorting = reloadOptions.sorting;
    let filter = reloadOptions.filter;

    let builder = new QueryBuilder(store)
      .from(modelName)
      .selectByProjection(projectionName)
      .top(perPageNumber)
      .skip((pageNumber - 1) * perPageNumber)
      .count()
      .orderBy(
        sorting
          .map(i => `${serializer.keyForAttribute(i.propName)} ${i.direction}`)
          .join(',')
      );

    if (filter) {
      let predicate = this.getFilterPredicate(projection, { filter: filter });
      if (predicate) {
        builder.where(predicate);
      }
    }

    return store.query(modelName, builder.build());
  },

  /**
   * It forms the filter predicate for data loading.
   *
   * @method _getFilterPredicate
   * @public
   *
   * @param {String} modelProjection A projection used for data retrieving.
   * @param {Object} params Current parameters to form predicate.
   * @return {BasePredicate} Filter predicate for data loading.
   */
  getFilterPredicate: function(modelProjection, params) {
    Ember.assert('Projection is not defined', modelProjection);

    let attrToFilterNames = [];
    let projAttrs = modelProjection.attributes;
    for (var attrName in projAttrs) {
      if (projAttrs[attrName].kind === 'attr') {
        attrToFilterNames.push(attrName);
      }
    }

    let finalString;
    let filter = params.filter;
    let store = this.store;

    if (typeof filter === 'string' && filter.length > 0) {
      let containsExpressions = attrToFilterNames.map(function(fieldName) {
        var backendFieldName = store.serializerFor(modelProjection.modelName).keyForAttribute(fieldName);
        return new StringPredicate(backendFieldName).contains(filter);
      });

      let newExpression = containsExpressions.length > 1 ? new ComplexPredicate(Condition.Or, ...containsExpressions) : containsExpressions[0];

      // TODO: concat with lf.
      finalString = newExpression;
    }

    return finalString;
  }
});
