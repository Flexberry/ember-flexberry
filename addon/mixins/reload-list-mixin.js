/**
 * @module ember-flexberry
 */

import Ember from 'ember';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import Condition from 'ember-flexberry-data/query/condition';
import { BasePredicate, StringPredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';

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
   * @param {String} [options.predicate] Predicate to limit records.
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
      filter: undefined,
      filters: undefined,
      predicate: undefined,
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

    let limitPredicate = reloadOptions.predicate;
    if (limitPredicate && !(limitPredicate instanceof BasePredicate)) {
      throw new Error('Limit predicate is not correct. It has to be instance of BasePredicate.');
    }

    let filtersPredicate = reloadOptions.filters;
    if (filtersPredicate && !(filtersPredicate instanceof BasePredicate)) {
      throw new Error('Incorrect filters. It has to be instance of BasePredicate.');
    }

    if (filtersPredicate) {
      limitPredicate = limitPredicate ? new ComplexPredicate(Condition.And, limitPredicate, filtersPredicate) : filtersPredicate;
    }

    let perPage = reloadOptions.perPage;
    let page = reloadOptions.page;
    let pageNumber = parseInt(page, 10);
    let perPageNumber = parseInt(perPage, 10);
    Ember.assert('page must be greater than zero.', pageNumber > 0);
    Ember.assert('perPage must be greater than zero.', perPageNumber > 0);

    let builder = new QueryBuilder(store)
      .from(modelName)
      .selectByProjection(projectionName)
      .top(perPageNumber)
      .skip((pageNumber - 1) * perPageNumber)
      .count();

    let sorting = reloadOptions.sorting.map(i => `${i.propName} ${i.direction}`).join(',');
    if (sorting) {
      builder.orderBy(sorting);
    }

    let filter = reloadOptions.filter;
    let filterPredicate = filter ? this.getFilterPredicate(projection, { filter: filter }) : undefined;
    let resultPredicate = (limitPredicate && filterPredicate) ?
                          new ComplexPredicate(Condition.And, limitPredicate, filterPredicate) :
                          (limitPredicate ?
                            limitPredicate :
                            (filterPredicate ?
                              filterPredicate :
                              undefined));

    if (resultPredicate) {
      builder.where(resultPredicate);
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

    let store = this.store;
    let modelConstructor = store.modelFor(modelProjection.modelName);

    let attrToFilterNames = [];
    let projAttrs = modelProjection.attributes;
    for (var attrName in projAttrs) {
      // TODO: it has to work not only with own string attributes.
      if (projAttrs[attrName].kind === 'attr' &&
          Ember.get(modelConstructor, 'attributes').get(attrName).type === 'string') {
        attrToFilterNames.push(attrName);
      }
    }

    let finalString;
    let filter = params.filter;

    if (typeof filter === 'string' && filter.length > 0) {
      let containsExpressions = attrToFilterNames.map(function(fieldName) {
        return new StringPredicate(fieldName).contains(filter);
      });

      let newExpression = containsExpressions.length > 1 ? new ComplexPredicate(Condition.Or, ...containsExpressions) : containsExpressions[0];

      // TODO: concat with lf.
      finalString = newExpression;
    }

    return finalString;
  }
});
