/**
  @module ember-flexberry
*/

import Ember from 'ember';

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
  customFolvContent: Ember.computed('perPage', 'page', 'sorting', function() {
    let folvModelName = this.get('folvModelName');
    let folvProjection = this.get('folvProjection');
    if (folvModelName && folvProjection) {
      let queryParameters = {
        modelName: folvModelName,
        projectionName: folvProjection,
        perPage: this.get('perPage'),
        page: this.get('page'),
        sorting: this.get('sorting'),

        //filter: params.filter,
        //filterCondition: this.get('controller.filterCondition'),
        //filters: filtersPredicate,
        //predicate: limitPredicate,
        //hierarchicalAttribute: hierarchicalAttribute,
      };
      return this.reloadList(queryParameters);
    }

    return undefined;
  }),

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
});
