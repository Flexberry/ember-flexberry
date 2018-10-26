/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';
import $ from 'jquery';
import { merge } from '@ember/polyfills';
import { get } from '@ember/object';
import { assert, debug } from '@ember/debug';
import { isNone } from '@ember/utils';
import ReloadListMixin from '../mixins/reload-list-mixin';
import { BasePredicate } from 'ember-flexberry-data/query/predicate';
import serializeSortingParam from '../utils/serialize-sorting-param';

/**
  Mixin for {{#crossLink "DS.Controller"}}Controller{{/crossLink}} to support work with modal windows at lookups.

  @class FlexberryLookupMixin
  @uses <a href="https://www.emberjs.com/api/ember/release/classes/Mixin">Mixin</a>
  @uses ReloadListMixin
*/
export default Mixin.create(ReloadListMixin, {
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
    loaderTemplate: undefined
  },

  /**
    Controller to show modal window.

    @property lookupController
    @type Controller
  */
  lookupController: undefined,

  /**
    Default number of records per page on lookup window list.

    @property lookupModalWindowPerPage
    @type Number
    @default 5
  */
  lookupModalWindowPerPage: 5,

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
      this.set('lookupController.inHierarchicalMode', chooseData.inHierarchicalMode);

      let options = $.extend(true, {
        projection: undefined,
        relationName: undefined,
        title: undefined,
        predicate: undefined,
        modelToLookup: undefined,
        sizeClass: undefined,
        lookupWindowCustomPropertiesData: undefined,
        componentName: undefined,
        folvComponentName: undefined,
        notUseUserSettings: undefined,
        perPage: this.get('lookupModalWindowPerPage'),
        sorting: undefined,
        hierarchicalAttribute: undefined
      }, chooseData);

      let lookupController = this.get('lookupController');
      let disableHierarchy = get(options, 'lookupWindowCustomPropertiesData.disableHierarchicalMode');
      lookupController.set('disableHierarchicalMode', !isNone(disableHierarchy));

      let customInHierarchicalMode = get(options, 'lookupWindowCustomPropertiesData.inHierarchicalMode');
      lookupController.set('inHierarchicalMode', customInHierarchicalMode);

      let projectionName = options.projection;
      assert('ProjectionName is undefined.', projectionName);

      let limitPredicate = options.predicate;
      if (limitPredicate && !(limitPredicate instanceof BasePredicate)) {
        throw new Error('Limit predicate is not correct. It has to be instance of BasePredicate.');
      }

      let relationName = options.relationName;
      let title = options.title;
      let modelToLookup = options.modelToLookup;
      let lookupWindowCustomPropertiesData = options.lookupWindowCustomPropertiesData;
      let sizeClass = options.sizeClass;
      let componentName = options.componentName;
      let folvComponentName = options.folvComponentName;
      let customHierarchicalAttribute = get(options, 'lookupWindowCustomPropertiesData.hierarchicalAttribute');
      let hierarchicalAttribute = isNone(options.hierarchicalAttribute) ? customHierarchicalAttribute : options.hierarchicalAttribute;

      let userSettingsService = this.get('userSettingsService');
      userSettingsService.createDefaultUserSetting(folvComponentName);

      let model = modelToLookup ? modelToLookup : this.get('model');
      let sorting = userSettingsService.getCurrentSorting(folvComponentName) || options.sorting || [];
      let perPage = (lookupWindowCustomPropertiesData ? lookupWindowCustomPropertiesData.perPage : false) || options.perPage;

      // Get ember static function to get relation by name.
      let relationshipsByName = get(model.constructor, 'relationshipsByName');

      // Get relation property from model.
      let relation = relationshipsByName.get(relationName);
      if (!relation) {
        throw new Error(`No relation with '${relationName}' name defined in '${model.constructor.modelName}' model.`);
      }

      // Get property type name.
      let relatedToType = relation.type;

      // Lookup
      let lookupSettings = this.get('lookupSettings');
      assert('Lookup settings are undefined.', lookupSettings);

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

        title: title,
        sizeClass: sizeClass,
        saveTo: {
          model: model,
          propName: relationName
        },
        currentLookupRow: model.get(relationName),
        customPropertiesData: lookupWindowCustomPropertiesData,
        componentName: componentName,
        folvComponentName: folvComponentName,
        notUseUserSettings: options.notUseUserSettings,
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
      let options = $.extend(true, {
        relationName: undefined,
        modelToLookup: undefined
      }, removeData);
      let relationName = options.relationName;
      let modelToLookup = options.modelToLookup;

      let model = modelToLookup ? modelToLookup : this.get('model');
      model.set(relationName, undefined);

      // Manually make record dirty, because ember-data does not do it when relationship changes.
      model.makeDirty();
    },

    /**
      Update relation value at model.

      @method actions.updateLookupValue
      @param {Object} updateData Lookup parameters to update data at model: { relationName, newRelationValue, modelToLookup }.
    */
    updateLookupValue(updateData) {
      let options = $.extend(true, {
        relationName: undefined,
        newRelationValue: undefined,
        modelToLookup: undefined
      }, updateData);
      let modelToLookup = options.modelToLookup;
      let model = modelToLookup ? modelToLookup : this.get('model');

      debug(`Flexberry Lookup Mixin::updateLookupValue ${options.relationName}`);
      model.set(options.relationName, options.newRelationValue);

      // Manually make record dirty, because ember-data does not do it when relationship changes.
      model.makeDirty();
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
    @param {String} [options.sizeClass] Size of modal lookup window.
    @param {String} [options.saveTo] Options to save selected lookup value.
    @param {String} [options.currentLookupRow] Current lookup value.
    @param {String} [options.customPropertiesData] Custom properties of modal lookup window.
    @param {String} [options.componentName] Component name of lookup component.
    @param {Boolean} [options.notUseUserSettings] Not use user settings in the list component on lookup window.
  */
  _reloadModalData(currentContext, options) {
    let lookupSettings = currentContext.get('lookupSettings');
    assert('Lookup settings are undefined.', lookupSettings);
    assert('Lookup template is undefined.', lookupSettings.template);
    assert('Lookup content template is undefined.', lookupSettings.contentTemplate);
    assert('Lookup loader template is undefined.', lookupSettings.loaderTemplate);

    let reloadData = merge({
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

      title: undefined,
      sizeClass: undefined,
      saveTo: undefined,
      currentLookupRow: undefined,
      customPropertiesData: undefined,
      componentName: undefined,
      folvComponentName: undefined,
      notUseUserSettings: undefined,
    }, options);

    assert('Reload data are not defined fully.',
      reloadData.relatedToType ||
      reloadData.projectionName ||
      reloadData.projection ||
      reloadData.saveTo);

    let modelConstructor = currentContext.store.modelFor(reloadData.relatedToType);
    let projection = get(modelConstructor, 'projections')[reloadData.projectionName];
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
      modelName: reloadData.relatedToType,
      projectionName: reloadData.projectionName,
      perPage: reloadData.perPage ? reloadData.perPage : this.get('lookupModalWindowPerPage'),
      page: reloadData.page ? reloadData.page : 1,
      sorting: reloadData.sorting ? reloadData.sorting : [],
      filters: reloadData.filters,
      filter: reloadData.filter,
      filterCondition: reloadData.filterCondition,
      predicate: limitPredicate,
      hierarchicalAttribute: controller.get('inHierarchicalMode') ? reloadData.hierarchicalAttribute : undefined
    };

    controller.clear(reloadData.initialLoad);
    controller.setProperties({
      modelProjection: projection,
      title: reloadData.title,
      sizeClass: reloadData.sizeClass,
      saveTo: reloadData.saveTo,
      currentLookupRow: reloadData.currentLookupRow,
      customPropertiesData: reloadData.customPropertiesData,
      componentName: reloadData.componentName,
      folvComponentName: reloadData.folvComponentName,
      notUseUserSettings: reloadData.notUseUserSettings,

      perPage: queryParameters.perPage,
      page: queryParameters.page,
      sort: serializeSortingParam(queryParameters.sorting, controller.get('sortDefaultValue')),
      filter: reloadData.filter,
      filterCondition: reloadData.filterCondition,
      predicate: limitPredicate,
      hierarchicalAttribute: controller.get('inHierarchicalMode') ? reloadData.hierarchicalAttribute : undefined,

      modelType: reloadData.relatedToType,
      projectionName: reloadData.projectionName,
      reloadContext: currentContext,
      reloadDataHandler: currentContext._reloadModalData
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

      if (!isNone(currentContext.get('objectlistviewEventsService'))) {
        currentContext.get('objectlistviewEventsService').setLoadingState('');
      }

      data.set('sorting', queryParameters.sorting);
      currentContext.send('removeModalDialog', loadingParams);
      currentContext.send('showModalDialog', lookupSettings.contentTemplate, {
        controller: controller,
        model: data
      }, loadingParams);
    });
  },
});
