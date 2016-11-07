/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Mixin for {{#crossLink "DS.Route"}}Route{{/crossLink}}
  to support work with {{#crossLink "FlexberryObjectlistviewComponent"}}{{/crossLink}}.

  @class FlexberryObjectlistviewRouteMixin
  @extends Ember.Mixin
  @public
*/
export default Ember.Mixin.create({
  actions: {
    /**
      Table row click handler.

      @method actions.objectListViewRowClick
      @public

      @param {Ember.Object} record Record related to clicked table row
    */
    objectListViewRowClick(record, editFormRoute) {
      let recordId = record.get('id') || record.get('data.id');
      this.transitionTo(editFormRoute, recordId);
    },

    /**
      This action is called when user click on refresh button.

      @method actions.refreshList
      @public
    */
    refreshList() {
      this.refresh();
    },

    saveAgregator(agregatorModel) {
      return false;
    }
  },

  /**
    It forms the limit predicate for loaded data.

    By default it returns `undefined`.
    In order to set specific limit predicate, this method have to be overriden on applied-specific route.

    @example
      ``` js
      // app/routes/limit-function-example.js
      import Ember from 'ember';
      import ListFormRoute from 'ember-flexberry/routes/list-form';
      import { Query } from 'ember-flexberry-data';

      const { StringPredicate } = Query;

      export default ListFormRoute.extend({
        modelProjection: 'FolvWithLimitFunctionExampleView',

        modelName: 'ember-flexberry-dummy-suggestion',

        objectListViewLimitPredicate: function(options) {
          let methodOptions = Ember.merge({
            modelName: undefined,
            projectionName: undefined,
            params: undefined
          }, options);

          if (methodOptions.modelName === this.get('modelName') &&
              methodOptions.projectionName === this.get('modelProjection')) {
            let currentPerPageValue = methodOptions.params ? methodOptions.params.perPage : undefined;
            let limitFunction = (currentPerPageValue && currentPerPageValue % 2 === 0) ?
                                new StringPredicate('address').contains('S') :
                                new StringPredicate('address').contains('п');
            return limitFunction;
          }

          return undefined;
        }
      });

      ```
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
