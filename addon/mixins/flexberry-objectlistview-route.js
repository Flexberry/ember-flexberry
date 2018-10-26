/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';
import { merge } from '@ember/polyfills';

/**
  Mixin for {{#crossLink "DS.Route"}}Route{{/crossLink}}
  to support work with {{#crossLink "FlexberryObjectlistviewComponent"}}{{/crossLink}}.

  @class FlexberryObjectlistviewRouteMixin
  @extends Mixin
  @public
*/
export default Mixin.create({
  actions: {
    /**
      Table row click handler.

      @method actions.objectListViewRowClick
      @public

      @param {EmberObject} record Record related to clicked table row
    */
    objectListViewRowClick(record, options) {
      let methodOptions = {
        saveBeforeRouteLeave: false,
        editOnSeparateRoute: false,
        onEditForm: false,
        modelName: undefined,
        detailArray: undefined,
        editFormRoute: undefined,
        readonly: false,
        goToEditForm: undefined,
        customParameters: undefined
      };
      methodOptions = merge(methodOptions, options);
      let goToEditForm = methodOptions.goToEditForm;
      if (goToEditForm === false) {
        return;
      }

      let saveBeforeRouteLeave = methodOptions.saveBeforeRouteLeave;
      let onEditForm = methodOptions.onEditForm;
      let editFormRoute = methodOptions.editFormRoute;
      let transitionOptions = {
        queryParams: {
          modelName: methodOptions.modelName,
          customParameters:  methodOptions.customParameters
        }
      };
      if (!editFormRoute) {
        throw new Error('Detail\'s edit form route is undefined.');
      }

      let recordId = record.get('id') || record.get('data.id');
      let thisRouteName = this.get('router.currentRouteName');
      if (!onEditForm) {
        this.transitionTo(editFormRoute, recordId, transitionOptions)
        .then((newRoute) => {
          if (newRoute) {
            newRoute.controller.set('parentRoute', thisRouteName);
          }
        });
      } else {
        if (saveBeforeRouteLeave) {
          this.controller.save(false, true).then(() => {
            this.transitionTo(editFormRoute, recordId, transitionOptions)
            .then((newRoute) => {
              newRoute.controller.set('parentRoute', thisRouteName);
            });
          }).catch((errorData) => {
            this.controller.rejectError(errorData, this.get('i18n').t('forms.edit-form.save-failed-message'));
          });
        } else {
          this.transitionTo(editFormRoute, recordId, transitionOptions)
          .then((newRoute) => {
            newRoute.controller.set('parentRoute', thisRouteName);
          });
        }
      }
    },

    /**
      This action is called when user click on refresh button.

      @method actions.refreshList
      @public
    */
    refreshList() {
      this.refresh();
    },

    /* eslint-disable no-unused-vars */
    saveAgregator(agregatorModel) {
      return false;
    }
    /* eslint-enable no-unused-vars */
  },

  /**
    It forms the limit predicate for loaded data.

    By default it returns `undefined`.
    In order to set specific limit predicate, this method have to be overriden on applied-specific route.

    @example
      ``` js
      // app/routes/limit-function-example.js
      import ListFormRoute from 'ember-flexberry/routes/list-form';
      import { StringPredicate } from 'ember-flexberry-data/query/predicate';

      export default ListFormRoute.extend({
        modelProjection: 'FolvWithLimitFunctionExampleView',

        modelName: 'ember-flexberry-dummy-suggestion',

        objectListViewLimitPredicate: function(options) {
          let methodOptions = merge({
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
  /* eslint-disable no-unused-vars */
  objectListViewLimitPredicate(options) {
    return undefined;
  }
  /* eslint-enable no-unused-vars */
});
