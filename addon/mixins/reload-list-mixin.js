/**
 * @module ember-flexberry
 */

import Mixin from '@ember/object/mixin';
import { get } from '@ember/object'
import { merge } from '@ember/polyfills';
import { assert } from '@ember/debug';
import { inject as service } from '@ember/service';
import { isNone } from '@ember/utils';
import { A, isArray } from '@ember/array';

import Builder from 'ember-flexberry-data/query/builder';
import Condition from 'ember-flexberry-data/query/condition';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import { BasePredicate, SimplePredicate, StringPredicate, ComplexPredicate,
  DatePredicate, stringToPredicate } from 'ember-flexberry-data/query/predicate';

/**
 * Mixin for {{#crossLink "DS.Controller"}}Controller{{/crossLink}} to support data reload.
 *
 * @class ReloadListMixin
 * @extends Mixin
 * @public
 */
export default Mixin.create({
  /**
   Service that triggers objectlistview events.

   @property objectlistviewEvents
   @type {Class}
   @default inject()
   */
  objectlistviewEvents: service(),

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
    if (options.filters instanceof ComplexPredicate) {
      var newFilter = A();
      options.filters._predicates.forEach((predicate) => {
        newFilter.push(this._normalizeNeqPredicate(predicate));
      }, this);

      options.filters._predicates = newFilter;
    } else {
      options.filters = this._normalizeNeqPredicate(options.filters);
    }

    let store = this.store;
    assert('Store for data loading is not defined.', store);

    let reloadOptions = options;

    let modelName = reloadOptions.modelName;
    assert('Model name for data loading is not defined.', modelName);

    let projectionName = reloadOptions.projectionName;
    assert('Projection name for data loading is not defined.', projectionName);

    let modelConstructor = store.modelFor(modelName);
    let projection = get(modelConstructor, 'projections')[projectionName];
    if (!projection) {
      throw new Error(`No projection with '${projectionName}' name defined in '${modelName}' model.`);
    }

    let allPredicates = A();

    if (reloadOptions.predicate && !(reloadOptions.predicate instanceof BasePredicate)) {
      throw new Error('Limit predicate is not correct. It has to be instance of BasePredicate.');
    }

    allPredicates.addObject(reloadOptions.predicate);

    if (reloadOptions.filters && !(reloadOptions.filters instanceof BasePredicate)) {
      throw new Error('Incorrect filters. It has to be instance of BasePredicate.');
    }

    allPredicates.addObject(reloadOptions.filters);

    if (reloadOptions.advLimit) {
      const advPredicate = stringToPredicate(reloadOptions.advLimit);
      if (!(advPredicate instanceof BasePredicate)) {
        throw new Error('Incorrect advLimit. It has to be instance of BasePredicate.');
      }

      allPredicates.addObject(advPredicate);
    }

    let perPage = reloadOptions.perPage;
    let page = reloadOptions.page;
    let pageNumber = parseInt(page, 10);
    let perPageNumber = parseInt(perPage, 10);
    assert('page must be greater than zero.', pageNumber > 0);
    assert('perPage must be greater than zero.', perPageNumber > 0);

    let builder = new Builder(store)
      .from(modelName)
      .selectByProjection(projectionName)
      .count();

    if (reloadOptions.hierarchicalAttribute) {
      if (reloadOptions.hierarchyPaging) {
        builder.top(perPageNumber).skip((pageNumber - 1) * perPageNumber);
        builder.orderBy('id asc');
      }

      let hierarchicalPredicate = new SimplePredicate(reloadOptions.hierarchicalAttribute, 'eq', null);
      allPredicates.addObject(hierarchicalPredicate);
    } else {
      builder.top(perPageNumber).skip((pageNumber - 1) * perPageNumber);
    }

    if (isArray(reloadOptions.sorting)) {
      let sorting = reloadOptions.sorting.filter(i => i.direction !== 'none').map(i => `${i.propName} ${i.direction}`).join(',');
      if (sorting) {
        builder.orderBy(sorting);
      }
    }

    const filter = reloadOptions.filter;
    const filterCondition = reloadOptions.filterCondition;
    const filterPredicate = filter ? this._getFilterPredicate(projection, { filter, filterCondition }) : undefined;
    allPredicates.addObject(filterPredicate);
    allPredicates = allPredicates.compact();
    const resultPredicate = allPredicates.length > 1 ?
      new ComplexPredicate(Condition.And, ...allPredicates) :
      allPredicates[0];

    this.get('objectlistviewEvents').setLimitFunction(resultPredicate, reloadOptions.componentName);

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
    @param {Object} attribute Object contains attribute info.
    @param {String} attribute.name Name of attribute, example `name` or `type.name` if it attribute of relationship.
    @param {Object} attribute.options Object with attribute options.
    @param {Boolean} [attribute.options.hidden] Flag, indicate that this hidden attribute.
    @param {Boolean} [attribute.options.displayMemberPath] Flag, indicate that this attribute uses for display relationship.
    @param {String} attribute.type Type of attribute, example `string` or `number`.
    @param {String} filter Pattern for search.
    @param {String} filterCondition Condition for predicate, can be `or` or `and`.
    @return {BasePredicate|null} Object class of `BasePredicate` or `null`, if not need filter.
    @for ListFormRoute
  */
  predicateForAttribute(attribute, filter, filterCondition) {
    if (attribute.options.hidden && !attribute.options.displayMemberPath) {
      return null;
    }

    switch (attribute.type) {
      case 'string': {
        let words = filter.trim().replace(/\s+/g, ' ').split(' ');
        if (filterCondition && words.length > 1) {
          let predicates = words.map(word => new StringPredicate(attribute.name).contains(word));
          return new ComplexPredicate(filterCondition, ...predicates);
        }

        return new StringPredicate(attribute.name).contains(filter);
      }

      case 'number': {
        if (isFinite(filter)) {
          return new SimplePredicate(attribute.name, 'eq', +filter);
        }

        return null;
      }

      case 'decimal': {
        filter = filter.replace(',', '.');
        if (isFinite(filter)) {
          return new SimplePredicate(attribute.name, 'eq', +filter);
        }

        return null;
      }

      case 'boolean': {
        let yes = ['TRUE', 'True', 'true', 'YES', 'Yes', 'yes', 'ДА', 'Да', 'да', '1', '+'];
        let no = ['False', 'False', 'false', 'NO', 'No', 'no', 'НЕТ', 'Нет', 'нет', '0', '-'];

        if (yes.indexOf(filter) > 0) {
          return new SimplePredicate(attribute.name, 'eq', 'true');
        }

        if (no.indexOf(filter) > 0) {
          return new SimplePredicate(attribute.name, 'eq', 'false');
        }

        return null;
      }

      default: {
        return null;
      }
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
    assert('Projection is not defined', modelProjection);

    let predicates = [];
    if (params.filter) {
      let attributes = this._attributesForFilter(modelProjection, this.store);
      attributes.forEach((attribute) => {
        let predicate = this.predicateForAttribute(attribute, params.filter, params.filterCondition);
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
          case 'attr': {
            let options = merge({}, attribute.options);
            options.displayMemberPath = projection.options && projection.options.displayMemberPath === name;
            attributes.push({
              name: name,
              options: options,
              type: get(store.modelFor(projection.modelName), 'attributes').get(name).type,
            });
            break;
          }

          case 'belongsTo': {
            let belongsToAttributes = this._attributesForFilter(attribute, store);
            for (let i = 0; i < belongsToAttributes.length; i++) {
              belongsToAttributes[i].name = `${name}.${belongsToAttributes[i].name}`;
              attributes.push(belongsToAttributes[i]);
            }

            break;
          }

          case 'hasMany':
            break;

          default: {
            throw new Error(`Not supported kind: ${attribute.kind}`);
          }
        }
      }
    }

    return attributes;
  },

  /**
    Generates new predicate for neq value predicate.

    @method _normalizeNeqPredicate
    @param {Object} predicate
    @return {Object} Normalized predicate.
    @private
  */
  _normalizeNeqPredicate(predicate) {
    let result = predicate;
    if (!isNone(predicate) && predicate._operator === 'neq' && predicate._value !== null) {
      let sp1 = predicate;
      let sp2;
      if (predicate instanceof SimplePredicate || predicate instanceof DatePredicate) {
        sp2 = new SimplePredicate(sp1._attributePath, FilterOperator.Eq, null);
      }

      result = sp2 ? new ComplexPredicate(Condition.Or, sp1, sp2) : sp1;
    }

    return result;
  }
});
