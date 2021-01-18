/**
  @module ember-flexberry
*/

import Ember from 'ember';

import ReloadListMixin from '../mixins/reload-list-mixin';
import { Query } from 'ember-flexberry-data';
import serializeSortingParam from '../utils/serialize-sorting-param';

const { BasePredicate } = Query;

/**
  Mixin for {{#crossLink "DS.Controller"}}Controller{{/crossLink}} to support work with modal windows at lookups.

  @class FlexberryLookupMixin
  @uses <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
  @uses ReloadListMixin
*/
export default Ember.Mixin.create(ReloadListMixin, {
  /**
    Lookup settings for modal window.
    It has to be overriden on controller where this mixin is used.

    @property lookupSettings
    @type Object
  */
  lookupSettings: {
    /**
      Name of controller that handles modal window.
      Controller with the same name has to be injected to property `lookupController`.

      @property controllerName
      @type String
    */
    controllerName: undefined,

    /**
      Name of template for modal window itself (not content of modal window).

      @property template
      @type String
    */
    template: undefined,

    /**
      Name of template for content of modal window.

      @property contentTemplate
      @type String
    */
    contentTemplate: undefined,

    /**
      Name of template for content of loading modal window.

      @property loaderTemplate
      @type String
    */
    loaderTemplate: undefined,

    /**
      Object with settings for modal window.

      @property modalDialogSettings
      @type Object
    */
    modalDialogSettings: {

      /**
        Modal detachable param.
        If set to false will prevent the modal from being moved to inside the dimmer.

        @property detachable
        @type Boolean
        @default false
      */
      detachable: false,

      /**
        Modal context param.
        Selector or jquery object specifying the area to dim.

        @property context
        @type String
        @default '.ember-application > .ember-view'
      */
      context: '.ember-application > .ember-view'
    }
  },

  /**
    Controller to show modal window.

    @property lookupController
    @type Ember.Controller
  */
  lookupController: undefined,

  /**
    Default number of records per page on lookup window list.

    @property lookupModalWindowPerPage
    @type Number
    @default 5
  */
  lookupModalWindowPerPage: 5,

  /**
    Service that triggers lookup events.

    @property lookupEventsService
    @type Service
  */
  lookupEventsService: Ember.inject.service('lookup-events'),

  actions: {
    /**
      Handles action from lookup choose action.
      It opens modal window where availible values are shown.

      In order to customize content of all lookup modal window there is such a way:
      1. Create template with necessary content and set unique name for it (for example 'customlookupform.hbs');
      2. Override lookup setting `lookupSettings.contentTemplate` on controller level (for example 'customlookupform');
      3. If there has to be specific logic or properties on controller for template,
         current lookup controller can be overriden (it is 'lookup-dialog' for edit forms),
         new name can be set on lookup setting `lookupSettings.controllerName`
         and new controller can be injected as `lookupController`
         (if the controller was extended and not reopened).

      @method actions.showLookupDialog
      @param {Object} chooseData Lookup parameters (projection name, relation name, etc).
    */
    showLookupDialog(chooseData) {
      let lookupController = this.get('lookupController');
      let options = Ember.$.extend(true, {
        projection: undefined,
        relationName: undefined,
        title: undefined,
        predicate: undefined,
        modelToLookup: undefined,
        lookupWindowCustomPropertiesData: undefined,
        componentName: undefined,
        folvComponentName: undefined,
        notUseUserSettings: undefined,
        perPage: this.get('lookupModalWindowPerPage'),
        sorting: undefined,
        hierarchicalAttribute: lookupController.get('hierarchicalAttribute'),
        updateLookupAction: undefined
      }, chooseData);

      let disableHierarchy = Ember.get(options, 'lookupWindowCustomPropertiesData.disableHierarchicalMode');
      lookupController.set('disableHierarchicalMode', !Ember.isNone(disableHierarchy));

      let customInHierarchicalMode = Ember.get(options, 'lookupWindowCustomPropertiesData.inHierarchicalMode');
      lookupController.set('inHierarchicalMode', customInHierarchicalMode);

      lookupController.set('developerUserSettings', this.get('developerUserSettings'));

      let projectionName = options.projection;
      Ember.assert('ProjectionName is undefined.', projectionName);

      let limitPredicate = options.predicate;
      if (limitPredicate && !(limitPredicate instanceof BasePredicate)) {
        throw new Error('Limit predicate is not correct. It has to be instance of BasePredicate.');
      }

      let relationName = options.relationName;
      let title = options.title;
      let modelToLookup = options.modelToLookup;
      let lookupWindowCustomPropertiesData = options.lookupWindowCustomPropertiesData;
      let componentName = options.componentName;
      let folvComponentName = options.folvComponentName;
      let customHierarchicalAttribute = Ember.get(options, 'lookupWindowCustomPropertiesData.hierarchicalAttribute');
      let hierarchicalAttribute = Ember.isNone(options.hierarchicalAttribute) ? customHierarchicalAttribute : options.hierarchicalAttribute;
      let hierarchyPaging = Ember.get(options, 'lookupWindowCustomPropertiesData.hierarchyPaging');
      const updateLookupAction = options.updateLookupAction;

      let userSettingsService = this.get('userSettingsService');
      userSettingsService.createDefaultUserSetting(folvComponentName);

      let model = modelToLookup ? modelToLookup : this.get('model');
      let sorting = userSettingsService.getCurrentSorting(folvComponentName) || options.sorting || [];
      let perPage = (lookupWindowCustomPropertiesData ? lookupWindowCustomPropertiesData.perPage : false) || options.perPage;

      // Get ember static function to get relation by name.
      let relationshipsByName = Ember.get(model.constructor, 'relationshipsByName');

      // Get relation property from model.
      let relation = relationshipsByName.get(relationName);
      if (!relation) {
        throw new Error(`No relation with '${relationName}' name defined in '${model.constructor.modelName}' model.`);
      }

      // Get property type name.
      let relatedToType = relation.type;

      // Lookup
      let lookupSettings = this.get('lookupSettings');
      Ember.assert('Lookup settings are undefined.', lookupSettings);

      let reloadData = {
        initialLoad: true,
        relatedToType: relatedToType,
        projectionName: projectionName,

        perPage: perPage,
        page: 1,
        sorting: sorting,
        filter: undefined,
        predicate: limitPredicate,
        hierarchicalAttribute: hierarchicalAttribute,
        hierarchyPaging: hierarchyPaging,

        title: title,
        saveTo: {
          model: model,
          propName: relationName,
          updateLookupAction: updateLookupAction
        },
        currentLookupRow: model.get(relationName),
        customPropertiesData: lookupWindowCustomPropertiesData,
        componentName: componentName,
        folvComponentName: folvComponentName,
        notUseUserSettings: options.notUseUserSettings,
        modalDialogSettings: options.modalDialogSettings,
      };

      this._reloadModalData(this, reloadData);
    },

    /**
      Handlers corresponding route's willTransition action.
      It sends message about transition to showing lookup modal window controller.

      @method actions.routeWillTransition
    */
    routeWillTransition() {
      this.get('lookupController').send('routeWillTransition');
    },

    /**
      Handlers action from FlexberryLookup remove action.

      @method actions.removeLookupValue
      @param {Object} removeData Lookup parameters: { relationName, modelToLookup }.
    */
    removeLookupValue(removeData) {
      let options = Ember.$.extend(true, {
        relationName: undefined,
        modelToLookup: undefined,
        componentName: undefined
      }, removeData);
      const componentName = options.componentName;
      let relationName = options.relationName;
      let modelToLookup = options.modelToLookup;

      let model = modelToLookup ? modelToLookup : this.get('model');
      model.set(relationName, undefined);

      // Manually make record dirty, because ember-data does not do it when relationship changes.
      model.makeDirty();
      this.get('lookupEventsService').lookupOnChangeTrigger(componentName);
    },

    /**
      Handlers action from FlexberryLookup preview action.

      @method actions.previewLookupValue
      @param {Object} previewData Lookup parameters: { recordId, transitionRoute, transitionOptions, showInSeparateRoute, projection, modelName, controller }.
    */
    previewLookupValue(previewData) {
      let options = Ember.$.extend(true, {
        recordId: undefined,
        transitionRoute: undefined,
        transitionOptions: undefined,
        showInSeparateRoute: undefined,
        modelName: undefined,
        controller: undefined,
        projection: undefined
      }, previewData);
      let recordId = options.recordId;
      let transitionRoute = options.transitionRoute;

      if (options.showInSeparateRoute) {
        let transitionOptions = options.transitionOptions || {};
        this.transitionToRoute(transitionRoute, recordId, transitionOptions);
      } else {
        let routeName = options.controller || transitionRoute;
        let modelName = options.modelName;

        let controller = Ember.getOwner(this).lookup(`controller:${routeName}`);
        if (Ember.isNone(controller)) {
          throw new Error(`Controller with '${routeName}' name does not exist.`);
        }

        let route = Ember.getOwner(this).lookup(`route:${transitionRoute}`);
        let projectionName = options.projection || (route ? route.get('modelProjection') : undefined);
        if (Ember.isNone(projectionName)) {
          throw new Error('\`previewFormProjection\` is undefined.');
        }

        let modelConstructor = this.store.modelFor(modelName);
        let projection = Ember.get(modelConstructor, `projections.${projectionName}`);
        if (!projection) {
          throw new Error(
            `No projection with '${projectionName}' name defined in '${modelName}' model.`);
        }

        controller.setProperties({
          readonly: true,
          routeName: routeName,
          modelProjection: projection
        });

        const modalDialogSettings = Ember.merge({ sizeClass: 'small preview-model' }, options.modalDialogSettings);
        const lookupController = this.get('lookupController');
        lookupController.setProperties({
          title: this.get('i18n').t('components.flexberry-lookup.preview-button-text'),
          modalDialogSettings: modalDialogSettings,
        });

        let lookupSettings = this.get('lookupSettings');
        this.send('showModalDialog', lookupSettings.template);

        let loadingParams = {
          view: lookupSettings.template,
          outlet: 'modal-content'
        };

        this.send('showModalDialog', lookupSettings.loaderTemplate, null, loadingParams);

        this.store.findRecord(modelName, recordId).then(data => {
          this.send('removeModalDialog', loadingParams);
          this.send('showModalDialog', transitionRoute, {
            controller: controller,
            model: data
          }, loadingParams);
        });
      }
    },

    /**
      Update relation value at model.

      @method actions.updateLookupValue
      @param {Object} updateData Lookup parameters to update data at model: { relationName, newRelationValue, modelToLookup }.
    */
    updateLookupValue(updateData) {
      let options = Ember.$.extend(true, {
        relationName: undefined,
        newRelationValue: undefined,
        modelToLookup: undefined,
        componentName: undefined
      }, updateData);
      const componentName = options.componentName;
      const modelToLookup = options.modelToLookup;
      const model = modelToLookup ? modelToLookup : this.get('model');

      Ember.debug(`Flexberry Lookup Mixin::updateLookupValue ${options.relationName}`);
      model.set(options.relationName, options.newRelationValue);

      // Manually make record dirty, because ember-data does not do it when relationship changes.
      model.makeDirty();
      this.get('lookupEventsService').lookupOnChangeTrigger(componentName, options.newRelationValue);
    },
  },

  /**
    This method refreshes displayed data on lookup modal window.

    It reloads current lookup modal window in order to show loading image.
    Then proper request to load data is formed (it considers current page, filter, etc).
    After the data loading data are displayed on lookup modal window.

    This method is called during the first data loading
    and after each change of request parameters (current page, filter, etc) on lookup modal window controller
    (it is implemented by sending handler on this method to lookup modal window controller).

    @method _reloadModalData
    @private

    @param {String} currentContext Current execution context of this method.
    @param {Object} options Parameters to load proper data and to tune modal lookup window outlook.
    @param {String} [options.relatedToType] Type of records to load.
    @param {String} [options.projectionName] Projection name to load data by.
    @param {String} [options.perPage] Number of records to display on page.
    @param {String} [options.page] Current page to display on lookup window.
    @param {String} [options.sorting] Current sorting.
    @param {String} [options.filter] Current filter.
    @param {String} [options.filterCondition] Current filter condition.
    @param {String} [options.predicate] Current limit predicate.
    @param {String} [options.title] Title of modal lookup window.
    @param {String} [options.saveTo] Options to save selected lookup value.
    @param {String} [options.currentLookupRow] Current lookup value.
    @param {String} [options.customPropertiesData] Custom properties of modal lookup window.
    @param {String} [options.componentName] Component name of lookup component.
    @param {Boolean} [options.notUseUserSettings] Not use user settings in the list component on lookup window.
  */
  _reloadModalData(currentContext, options) {
    let lookupSettings = currentContext.get('lookupSettings');
    Ember.assert('Lookup settings are undefined.', lookupSettings);
    Ember.assert('Lookup template is undefined.', lookupSettings.template);
    Ember.assert('Lookup content template is undefined.', lookupSettings.contentTemplate);
    Ember.assert('Lookup loader template is undefined.', lookupSettings.loaderTemplate);

    let reloadData = Ember.merge({
      initialLoad: false,
      relatedToType: undefined,
      projectionName: undefined,

      perPage: undefined,
      page: undefined,
      sorting: undefined,
      filters: undefined,
      filter: undefined,
      filterCondition: undefined,
      predicate: undefined,
      hierarchicalAttribute: undefined,
      hierarchyPaging: false,

      title: undefined,
      saveTo: undefined,
      currentLookupRow: undefined,
      customPropertiesData: undefined,
      componentName: undefined,
      folvComponentName: undefined,
      notUseUserSettings: undefined,
    }, options);

    Ember.assert('Reload data are not defined fully.',
      reloadData.relatedToType ||
      reloadData.projectionName ||
      reloadData.projection ||
      reloadData.saveTo);

    let modelConstructor = currentContext.store.modelFor(reloadData.relatedToType);
    let projection = Ember.get(modelConstructor, `projections.${reloadData.projectionName}`);
    if (!projection) {
      throw new Error(
        `No projection with '${reloadData.projectionName}' name defined in '${reloadData.relatedToType}' model.`);
    }

    let limitPredicate = reloadData.predicate;
    if (limitPredicate && !(limitPredicate instanceof BasePredicate)) {
      throw new Error('Limit predicate is not correct. It has to be instance of BasePredicate.');
    }

    let controller = currentContext.get('lookupController');
    let queryParameters = {
      componentName: reloadData.componentName,
      modelName: reloadData.relatedToType,
      projectionName: reloadData.projectionName,
      perPage: reloadData.perPage ? reloadData.perPage : this.get('lookupModalWindowPerPage'),
      page: reloadData.page ? reloadData.page : 1,
      sorting: reloadData.sorting ? reloadData.sorting : [],
      filters: reloadData.filters,
      filter: reloadData.filter,
      filterCondition: reloadData.filterCondition,
      predicate: limitPredicate,
      hierarchicalAttribute: controller.get('inHierarchicalMode') ? reloadData.hierarchicalAttribute : undefined,
      hierarchyPaging: reloadData.hierarchyPaging
    };

    controller.clear(reloadData.initialLoad);

    const modalDialogSettings = controller.get('modalDialogSettings') || Ember.merge(Ember.merge({}, reloadData.modalDialogSettings), {
      settings: Ember.merge(Ember.merge({}, lookupSettings.modalDialogSettings), reloadData.modalDialogSettings.settings),
    });

    controller.setProperties({
      modelProjection: projection,
      title: reloadData.title,
      saveTo: reloadData.saveTo,
      currentLookupRow: reloadData.currentLookupRow,
      customPropertiesData: reloadData.customPropertiesData,
      componentName: reloadData.componentName,
      folvComponentName: reloadData.folvComponentName,
      notUseUserSettings: reloadData.notUseUserSettings,
      modelName: reloadData.relatedToType,

      perPage: queryParameters.perPage,
      page: queryParameters.page,
      sort: serializeSortingParam(queryParameters.sorting, controller.get('sortDefaultValue')),
      filter: reloadData.filter,
      filterCondition: reloadData.filterCondition,
      predicate: limitPredicate,
      hierarchicalAttribute: controller.get('inHierarchicalMode') ? reloadData.hierarchicalAttribute : undefined,
      hierarchyPaging: reloadData.hierarchyPaging,

      modelType: reloadData.relatedToType,
      projectionName: reloadData.projectionName,
      reloadContext: currentContext,
      reloadDataHandler: currentContext._reloadModalData,
      modalDialogSettings: modalDialogSettings,
    });

    if (reloadData.initialLoad) {
      currentContext.send('showModalDialog', lookupSettings.template);
    }

    controller.set('reloadObserverIsActive', true);

    let loadingParams = {
      view: lookupSettings.template,
      outlet: 'modal-content'
    };
    currentContext.send('showModalDialog', lookupSettings.loaderTemplate, null, loadingParams);

    currentContext.reloadList(queryParameters).then(data => {
      data.set('sorting', queryParameters.sorting);
      currentContext.send('removeModalDialog', loadingParams);
      currentContext.send('showModalDialog', lookupSettings.contentTemplate, {
        controller: controller,
        model: data
      }, loadingParams);
    });
  },
});
