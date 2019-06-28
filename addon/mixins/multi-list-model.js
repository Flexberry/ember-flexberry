/**
  @module ember-flexberry
*/

import Ember from 'ember';
import serializeSortingParam from '../utils/serialize-sorting-param';

/**
  Mixin for {{#crossLink "ListFormRoute"}}{{/crossLink}},
  provides data loading for multi olv.

  @class MultiListModelEditMixin
  @uses <a href="https://api.emberjs.com/ember/release/classes/Mixin">Ember.Mixin</a>
*/
export default Ember.Mixin.create({
  updateModelOnListReload: true,

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

          if (!Ember.isNone(settings)) {
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
          }
        }, this);

        return Ember.RSVP.hash(result);
      }).then((hashModel) => {
        this.get('formLoadTimeTracker').set('endLoadTime', performance.now());
        this.onModelLoadingFulfilled(hashModel, transition);
        controller.set('model', hashModel);

        listComponentNames.forEach(function(componentName) {
          let settings = this.get(`multiListSettings.${componentName}`);
          if (!Ember.isNone(settings)) {
            this.includeSorting(hashModel[componentName], settings.get('sorting'));
            settings.set('model', hashModel[componentName]);
            if (Ember.isNone(settings.get('sort'))) {
              let sortQueryParam = serializeSortingParam(settings.get('sorting'), settings.get('sortDefaultValue'));
              settings.set('sort', sortQueryParam);
            }
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
});
