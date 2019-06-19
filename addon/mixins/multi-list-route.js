import Ember from 'ember';
import ListParameters from '../objects/list-parameters';
import serializeSortingParam from '../utils/serialize-sorting-param';

import { Query } from 'ember-flexberry-data';
const { Condition, ComplexPredicate } = Query;

export default Ember.Mixin.create({
  /**
    Settings for all lists on form.

    @property multiListSettings
    @type Object
  */
  multiListSettings: undefined,

  /**
    Service that triggers objectlistview events.

    @property objectlistviewEvents
    @type Service
  */
  objectlistviewEvents: Ember.inject.service(),

  init() {
    this._super(...arguments);

    this.set('multiListSettings', {});
  },

  model: function(params, transition) {
    this.get('formLoadTimeTracker').set('startLoadTime', performance.now());

    let controller = this.controllerFor(this.routeName);
    this.get('appState').loading();

    let webPage = transition.targetName;
    let userSettingsService = this.get('userSettingsService');
    userSettingsService.setCurrentWebPage(webPage);
    let developerUserSettings = this.get('developerUserSettings');
    Ember.assert('Property developerUserSettings is not defined in /app/routes/' + transition.targetName + '.js', developerUserSettings);

    let nComponents = 0;
    for (let componentName in developerUserSettings) {
      let componentDesc = developerUserSettings[componentName];
      switch (typeof componentDesc) {
        case 'string':
          developerUserSettings[componentName] = JSON.parse(componentDesc);
          break;
        case 'object':
          break;
        default:
          Ember.assert('Component description ' + 'developerUserSettings.' + componentName +
            'in /app/routes/' + transition.targetName + '.js must have types object or string', false);
      }
      nComponents += 1;
    }

    if (nComponents === 0) {
      Ember.assert('Developer MUST DEFINE component settings in /app/routes/' + transition.targetName + '.js', false);
    }

    userSettingsService.setDefaultDeveloperUserSettings(developerUserSettings);
    let userSettingPromise = userSettingsService.setDeveloperUserSettings(developerUserSettings);
    let listComponentNames = userSettingsService.getListComponentNames();
    userSettingPromise
      .then(currectPageUserSettings => {
        let result = {};

        listComponentNames.forEach(function(componentName) {
          this.get('colsConfigMenu').updateNamedSettingTrigger(componentName);
          let settings = this.get(`multiListSettings.${componentName}`);

          let filtersPredicate = this._filtersPredicate(componentName);
          let sorting = userSettingsService.getCurrentSorting(componentName);
          let perPage = userSettingsService.getCurrentPerPage(componentName);
          settings.set('filtersPredicate', filtersPredicate);
          settings.set('perPage', perPage);
          settings.set('sorting', sorting);

          let limitPredicate =
            this.objectListViewLimitPredicate({ modelName: settings.modelName, projectionName: settings.projectionName, params: settings });

          let queryParameters = {
            modelName: settings.modelName,
            projectionName: settings.projectionName,
            perPage: settings.perPage,
            page: settings.page || 1,
            sorting: settings.sorting,
            filter: settings.filter,
            filterCondition: settings.filterCondition,
            filters: settings.filtersPredicate,
            predicate: limitPredicate,
            hierarchicalAttribute: settings.inHierarchicalMode ? settings.hierarchicalAttribute : null,
          };

          result[componentName] = this.reloadList(queryParameters);
        }, this);

        return Ember.RSVP.hash(result);
      }).then((hashModel) => {
        this.get('formLoadTimeTracker').set('endLoadTime', performance.now());
        this.onModelLoadingFulfilled(hashModel, transition);
        controller.set('model', hashModel);

        listComponentNames.forEach(function(componentName) {
          let settings = this.get(`multiListSettings.${componentName}`);
          this.includeSorting(hashModel[componentName], settings.get('sorting'));
          settings.set('model', hashModel[componentName]);
          if (Ember.isNone(settings.get('sort'))) {
            let sortQueryParam = serializeSortingParam(settings.get('sorting'), settings.get('sortDefaultValue'));
            settings.set('sort', sortQueryParam);
          }
        }, this);

        return hashModel;
      }).catch((errorData) => {
        this.onModelLoadingRejected(errorData, transition);
      }).finally((data) => {
        this.onModelLoadingAlways(data, transition);
        this.get('appState').reset();
      });

    // TODO: Check controller loaded model loading parameters and return it without reloading if there is same backend query was executed.
    let model = this.get('controller.model');

    if (Ember.isNone(model)) {
      return { isLoading: true };
    } else {
      return model;
    }
  },

  setupController: function(controller, model) {
    this._super(...arguments);
    this.get('formLoadTimeTracker').set('startRenderTime', performance.now());

    let multiListSettings = this.get('multiListSettings');
    for (let componentName in multiListSettings) {
      let settings = Ember.get(multiListSettings, `${componentName}`);
      let modelClass = this.store.modelFor(settings.get('modelName'));
      let proj = modelClass.projections.get(settings.get('projectionName'));
      settings.set('modelProjection', proj);
      let predicate = this.objectListViewLimitPredicate({
        modelName: settings.get('modelName'),
        projectionName: settings.get('projectionName'),
        params: settings
      });
      settings.set('predicate', predicate);
    }

    controller.set('multiListSettings', multiListSettings);
    controller.set('error', undefined);
    controller.set('userSettings', this.userSettings);
    controller.set('developerUserSettings', this.get('developerUserSettings'));
    controller.set('_filtersPredicate', this.get('_filtersPredicate').bind(this));
    if (Ember.isNone(controller.get('defaultDeveloperUserSettings'))) {
      controller.set('defaultDeveloperUserSettings', Ember.$.extend(true, {}, this.get('developerUserSettings')));
    }

    this.get('objectlistviewEvents').on('refreshListOnly', this, this._reloadListByName);
  },

  resetController: function(controller) {
    this._super(...arguments);

    this.get('objectlistviewEvents').off('refreshListOnly', this, this._reloadListByName);
  },

  actions: {
    /**
      Reload list's data by name.

      @method actions.reloadListByName
      @param {String} componentName Component name.
    */
    reloadListByName(componentName) {
      this.get('appState').loading();
      let queryParameters = new ListParameters(this.get(`multiListSettings.${componentName}`));
      queryParameters.set('filters', this._filtersPredicate(componentName));
      if (!queryParameters.get('inHierarchicalMode')) {
        queryParameters.set('hierarchicalAttribute', null);
      }

      this.reloadList(queryParameters).then(result => {
        let controller = this.get('controller');
        controller.set(`model.${componentName}`, result);
        let settings = controller.get(`multiListSettings.${componentName}`);
        settings.set('model', result);
        settings.set('model.sorting', settings.get('sorting'));
      }, this).finally(() => {
        this.get('appState').reset();
      }, this);
    },
  },

  /**
    Return predicate for `QueryBuilder` or `undefined`.

    @method _filtersPredicate
    @param {String} componentName Component name.
    @return {BasePredicate|undefined} Predicate for `QueryBuilder` or `undefined`.
    @private
  */
  _filtersPredicate(componentName) {
    let filters = this.get(`multiListSettings.${componentName}.filters`);
    if (filters) {
      let predicates = Ember.A();
      for (let filter in filters) {
        if (filters.hasOwnProperty(filter)) {
          let predicate = this.predicateForFilter(filters[filter], componentName);
          if (predicate) {
            predicates.pushObject(predicate);
          }
        }
      }

      return predicates.length ? predicates.length > 1 ? new ComplexPredicate(Condition.And, ...predicates) : predicates[0] : undefined;
    }

    return undefined;
  },

  /**
    Reloads list's data by name.

    @method _reloadListByName
    @param {String} componentName Component name.
    @private
  */
  _reloadListByName(componentName) {
    this.send('reloadListByName', componentName);
  }
});
