/**
 * @module ember-flexberry
 */

import Ember from 'ember';

import { Query } from 'ember-flexberry-data';
import { SimplePredicate, StringPredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';

const { Builder, Condition, BasePredicate } = Query;

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

    let builder = new Builder(store)
      .from(modelName)
      .selectByProjection(projectionName)
      .count();

    let controller = this.controllerFor(this.routeName);
    let inHierarchicalMode = controller.get('inHierarchicalMode');
    if (inHierarchicalMode) {
      let hierarchicalAttribute = controller.get('hierarchicalAttribute');
      let hierarchicalPredicate = new SimplePredicate(hierarchicalAttribute, 'eq', null);
      limitPredicate = limitPredicate ? new ComplexPredicate(Condition.And, limitPredicate, hierarchicalPredicate) : hierarchicalPredicate;
    } else {
      builder.top(perPageNumber).skip((pageNumber - 1) * perPageNumber);
    }

    let sorting = reloadOptions.sorting.map(i => `${i.propName} ${i.direction}`).join(',');
    if (sorting) {
      builder.orderBy(sorting);
    }

    let filter = reloadOptions.filter;
    let filterPredicate = filter ? this._getFilterPredicate(projection, { filter: filter }) : undefined;
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
    Create predicate for attribute. Can you overload this function for extended logic.

    Default supported attribute types:
    - `string`
    - `number`

    @example
      ```javascript
      // app/routes/example.js
      ...
      // Add support for logical attribute
      predicateForAttribute(attribute, filter) {
        switch (attribute.type) {
          case 'boolean':
            let yes = ['TRUE', 'True', 'true', 'YES', 'Yes', 'yes', 'ДА', 'Да', 'да', '1', '+'];
            let no = ['False', 'False', 'false', 'NO', 'No', 'no', 'НЕТ', 'Нет', 'нет', '0', '-'];

            if (yes.indexOf(filter) > 0) {
              return new SimplePredicate(attribute.name, 'eq', 'true');
            }

            if (no.indexOf(filter) > 0) {
              return new SimplePredicate(attribute.name, 'eq', 'false');
            }

            return null;

          default:
            return this._super(...arguments);
        }
      },
      ...
      ```

    @method predicateForAttribute
    @param {Object} attribute Object format: `{ name, type }`, where `name` - attribute name, `type` - attribute type.
    @param {String} filter Pattern for search.
    @return {BasePredicate|null} Object class of `BasePredicate` or `null`, if not need filter.
    @for ListFormRoute
  */
  predicateForAttribute(attribute, filter) {
    switch (attribute.type) {
      case 'string':
        return new StringPredicate(attribute.name).contains(filter);

      case 'number':
        if (isFinite(filter)) {
          return new SimplePredicate(attribute.name, 'eq', filter);
        }

        return null;

      default:
        return null;
    }
  },

  /**
    It forms the filter predicate for data loading.

    @method _getFilterPredicate
    @param {Object} modelProjection A projection used for data retrieving.
    @param {Object} params Current parameters to form predicate.
    @return {BasePredicate|null} Filter predicate for data loading.
    @private
  */
  _getFilterPredicate: function(modelProjection, params) {
    Ember.assert('Projection is not defined', modelProjection);

    let predicates = [];
    if (params.filter) {
      let attributes = this._attributesForFilter(modelProjection, this.store);
      attributes.forEach((attribute) => {
        let predicate = this.predicateForAttribute(attribute, params.filter);
        if (predicate) {
          predicates.push(predicate);
        }
      });
    }

    return predicates.length ? predicates.length > 1 ? new ComplexPredicate(Condition.Or, ...predicates) : predicates[0] : null;
  },

  /**
    Generates array attributes for filter.

    @method _attributesForFilter
    @param {Object} projection
    @param {DS.Store} store
    @return {Array} Array objects format: `{ name, type }`, where `name` - attribute name, `type` - attribute type.
    @private
  */
  _attributesForFilter(projection, store) {
    let attributes = [];

    for (let name in projection.attributes) {
      if (projection.attributes.hasOwnProperty(name)) {
        let attribute = projection.attributes[name];
        switch (attribute.kind) {
          case 'attr':
            attributes.push({
              name: name,
              type: Ember.get(store.modelFor(projection.modelName), 'attributes').get(name).type,
            });
            break;

          case 'belongsTo':
            if (attribute.options.displayMemberPath) {
              attributes.push({
                name: `${name}.${attribute.options.displayMemberPath}`,
                type: Ember.get(store.modelFor(attribute.modelName), 'attributes').get(attribute.options.displayMemberPath).type,
              });
            }

            break;

          default:
            throw new Error(`Not supported kind: ${attribute.kind}`);
        }
      }
    }

    return attributes;
  },
});
