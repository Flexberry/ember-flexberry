/**
  @module ember-flexberry
*/

import Ember from 'ember';
import { Query } from 'ember-flexberry-data';

const { Condition, SimplePredicate, ComplexPredicate } = Query;

/**
  Mixin for edit-form-controller for ObjectListView support.

  @class FlexberryObjectlistviewOnEditFormControllerMixin
  @extends Ember.Mixin
  @public
*/
export default Ember.Mixin.create({
  /**
    Name of related to FOLV edit form route.

    @property folvEditFormRoute
    @type String
    @default undefined
   */
  folvEditFormRoute: undefined,

  /**
    Name of FOLV model.

    @property folvModelName
    @type String
    @default undefined
   */
  folvModelName: undefined,

  /**
    Name of FOLV projection.

    @property folvProjection
    @type String
    @default undefined
   */
  folvProjection: undefined,

  /**
    Total count of FOLV records.

    @property recordsTotalCount
    @type Number
    @readOnly
  */
  recordsTotalCount: Ember.on('init', Ember.computed('customFolvContent', function() {
    let customFolvContent = this.get('customFolvContent');
    if (customFolvContent) {
      if (customFolvContent instanceof Ember.RSVP.Promise) {
        customFolvContent.then((records) => {
          this.set('recordsTotalCount', records.meta.count);
        }, this);
      } else {
        return customFolvContent.meta.count;
      }
    }
  })),

  /**
    Content of FOLV on this edit form.

    @property customFolvContent
    @type Promise
    @readOnly
  */
  customFolvContentObserver: Ember.observer('perPage', 'page', 'sorting', 'filter', 'filters', function() {
    Ember.run.once(this, 'getCustomContent');
  }),

  getCustomContent() {
    let _this = this;
    let folvModelName = this.get('folvModelName');
    let folvProjection = this.get('folvProjection');
    let filtersPredicate = this._filtersPredicate();
    let perPage = this.get('perPage');
    let page = this.get('page');
    let sorting = this.get('sorting');
    let filter = this.get('filter');
    let filterCondition = this.get('filterCondition');
    let params = {};
    params.perPage = perPage;
    params.page = page;
    params.sorting = sorting;
    params.filter = filter;
    params.filterCondition = filterCondition;
    let limitPredicate =
      this.objectListViewLimitPredicate({ modelName: folvModelName, projectionName: folvProjection, params: params });
    if (folvModelName && folvProjection) {
      let queryParameters = {
        modelName: folvModelName,
        projectionName: folvProjection,
        perPage: perPage,
        page: page,
        sorting: sorting,
        filter: filter,
        filterCondition: filterCondition,
        filters: filtersPredicate,
        predicate: limitPredicate,

        //hierarchicalAttribute: hierarchicalAttribute,
      };
      return this.reloadList(queryParameters)
      .then(records => {
        _this.set('customFolvContent', records);
      });
    }

    _this.set('customFolvContent', undefined);
  },

  customFolvContent: undefined,

  sort: undefined,

  sorting: [],

  sortObserver: Ember.on('init', Ember.observer('sort', function() {
    let sorting = this.get('sort');

    if (sorting) {
      sorting = this.deserializeSortingParam(sorting);
    }

    this.set('sorting', sorting || []);
  })),

  /**
    Dictionary with sorting data related to properties.

    @property computedSorting
    @type Object
    @readOnly
  */
  computedSorting: Ember.computed('sorting', function() {
    let sorting = this.get('sorting');
    let result = {};

    if (sorting) {
      for (let i = 0; i < sorting.length; i++) {
        let propName = sorting[i].propName;
        let sortDef = {
          sortAscending: sorting[i].direction === 'asc' ? true : false,
          sortNumber: i + 1
        };
        result[propName] = sortDef;
      }
    }

    return result;
  }),

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

  /**
    Return predicate to filter through.

    @example
      ```javascript
      // app/routes/example.js
      ...
      predicateForFilter(filter) {
        if (filter.type === 'string' && filter.condition === 'like') {
          return new StringPredicate(filter.name).contains(filter.pattern);
        }

        return this._super(...arguments);
      },
      ...
      ```

    @method predicateForFilter
    @param {Object} filter Object (`{ name, condition, pattern }`) with parameters for filter.
    @return {BasePredicate|null} Predicate to filter through.
  */
  predicateForFilter(filter) {
    switch (filter.type) {
      case 'string':
      case 'number':
      case 'boolean':
        return new SimplePredicate(filter.name, filter.condition, filter.pattern);

      default:
        return null;
    }
  },

  /**
    Return predicate for `QueryBuilder` or `undefined`.

    @method _filtersPredicate
    @return {BasePredicate|undefined} Predicate for `QueryBuilder` or `undefined`.
    @private
  */
  _filtersPredicate() {
    let filters = this.get('filters');
    if (filters) {
      let predicates = [];
      for (let filter in filters) {
        if (filters.hasOwnProperty(filter)) {
          let predicate = this.predicateForFilter(filters[filter]);
          if (predicate) {
            predicates.push(predicate);
          }
        }
      }

      return predicates.length ? predicates.length > 1 ? new ComplexPredicate(Condition.And, ...predicates) : predicates[0] : undefined;
    }

    return undefined;
  },

  /**
    It forms the limit predicate for FOLV loaded data on edit form.

    By default it returns `undefined`.
    In order to set specific limit predicate, this method have to be overriden on applied-specific controller.

  @method objectListViewLimitPredicate
  @public

  @param {Object} options Method options
  @param {String} [options.modelName] Type of records to load
  @param {String} [options.projectionName] Projection name to load data by
  @param {String} [options.params] Current route query parameters
  @return {BasePredicate} The predicate to limit loaded data
  */
  objectListViewLimitPredicate(options) {
    return undefined;
  }
});
