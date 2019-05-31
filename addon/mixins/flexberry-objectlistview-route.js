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
  /**
    Path for using modal content template

    @property _modalContentTemplatePath
    @type String
    @default 'components-examples/flexberry-objectlistview/edit-form-with-detail-edit'
    @private
  */
  _modalContentTemplatePath: 'components-examples/flexberry-objectlistview/edit-form-with-detail-edit',

  /**
    Path for using modal content controller

    @property _modalContentControllerPath
    @type String
    @default 'components-examples/flexberry-objectlistview/edit-form-with-detail-edit'
    @private
  */
  _modalContentControllerPath: 'components-examples/flexberry-objectlistview/edit-form-with-detail-edit',

  /**
    Name of modal content model projection

    @property _modalContentModelProjection
    @type String
    @default 'SuggestionTypeE'
    @private
  */
  _modalContentModelProjectionName: 'SuggestionTypeE',

  actions: {
    /**
      Table row click handler.

      @method actions.objectListViewRowClick
      @public

      @param {Ember.Object} record Record related to clicked table row
    */
    objectListViewRowClick(record, options) {
      let methodOptions = {
        saveBeforeRouteLeave: false,
        editOnSeparateRoute: false,
        onEditForm: false,
        modelName: undefined,
        detailArray: undefined,
        editFormRoute: undefined,
        editInModal: true,
        readonly: false,
        goToEditForm: undefined,
        customParameters: undefined
      };

      methodOptions = Ember.merge(methodOptions, options);
      let goToEditForm = methodOptions.goToEditForm;
      if (goToEditForm === false) {
        return;
      }
      if (methodOptions.editInModal) {
        this.openEditModalDialog(record);
      } else {
        let saveBeforeRouteLeave = methodOptions.saveBeforeRouteLeave;
        let onEditForm = methodOptions.onEditForm;
        let editFormRoute = methodOptions.editFormRoute;
        let recordId = record.get('id') || record.get('data.id');
        let thisRouteName = this.get('router.currentRouteName');
        let thisRecordId = this.get('currentModel.id');
        let transitionOptions = {
          queryParams: {
            modelName: methodOptions.modelName,
            customParameters:  methodOptions.customParameters,
            parentParameters: {
              parentRoute: thisRouteName,
              parentRouteRecordId: thisRecordId
            }
          }
        };
        if (!editFormRoute) {
          throw new Error('Detail\'s edit form route is undefined.');
        }

        if (!onEditForm) {
          this.transitionTo(editFormRoute, recordId, transitionOptions);
        } else {
          if (saveBeforeRouteLeave) {
            this.controller.save(false, true).then(() => {
              this.transitionTo(editFormRoute, recordId, transitionOptions);
            }).catch((errorData) => {
              this.controller.rejectError(errorData, this.get('i18n').t('forms.edit-form.save-failed-message'));
            });
          } else {
            this.transitionTo(editFormRoute, recordId, transitionOptions);
          }
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
  },

  openEditModalDialog(record) {
    this.send('showModalDialog', 'editrecord-dialog');

    let loadingParams = {
      view: 'editrecord-dialog',
      outlet: 'editrecord-modal-content',
    };

    let modalContentControllerPath = this.get('_modalContentControllerPath');
    let modalContentController = this.controllerFor(modalContentControllerPath);

    let modelClass = record.constructor;
    let modelProjName = this.get('_modalContentModelProjectionName');
    let proj = modelClass.projections.get(modelProjName);
    modalContentController.set('modelProjection', proj);
    modalContentController.set('isModal', true);

    this.send('showModalDialog', 'components-examples/flexberry-objectlistview/edit-form-with-detail-edit', 
      { controller: modalContentController, model: record }, loadingParams);   
  }
});
