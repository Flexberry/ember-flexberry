/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { resolve, hash } from 'rsvp';
import { isNone } from '@ember/utils';

import serializeSortingParam from '../utils/serialize-sorting-param';

/**
  Mixin for {{#crossLink "EditFormRoute"}}{{/crossLink}},
  provides data loading for multi olv.

  @class MultiListModelEditMixin
  @uses <a href="https://api.emberjs.com/ember/release/classes/Mixin">Ember.Mixin</a>
*/
export default Mixin.create({
  /**
    Service for managing advLimits for lists.

    @property advLimit
    @type AdvLimitService
  */
  advLimit: service(),

  beforeModel(transition) {
    const advLimitService = this.get('advLimit');

    return resolve(this._super(...arguments)).then(() => {
      const developerUserSettings = this.get('developerUserSettings');
      const webPage = transition.targetName;
      advLimitService.setCurrentAppPage(webPage);

      return advLimitService.getAdvLimitsFromStore(Object.keys(developerUserSettings));
    }).then(() => {
      let userSettingsService = this.get('userSettingsService');
      let listComponentNames = userSettingsService.getListComponentNames();
      let result = {};
      listComponentNames.forEach(function(componentName) {
        this.get('colsConfigMenu').updateNamedSettingTrigger(componentName);
        this.get('colsConfigMenu').updateNamedAdvLimitTrigger(componentName);
        let settings = this.get(`multiListSettings.${componentName}`);

        if (!isNone(settings)) {
          let filtersPredicate = this._filtersPredicate(componentName);
          let sorting = userSettingsService.getCurrentSorting(componentName);
          let perPage = userSettingsService.getCurrentPerPage(componentName);
          settings.set('filtersPredicate', filtersPredicate);
          settings.set('perPage', perPage);
          settings.set('sorting', sorting);

          let limitPredicate =
            this.objectListViewLimitPredicate({ modelName: settings.modelName, projectionName: settings.projectionName, params: settings });

          const advLimit = advLimitService.getCurrentAdvLimit(componentName);

          let queryParameters = {
            componentName: componentName,
            modelName: settings.modelName,
            projectionName: settings.projectionName,
            perPage: settings.perPage,
            page: settings.page || 1,
            sorting: settings.sorting,
            filter: settings.filter,
            filterCondition: settings.filterCondition,
            filters: settings.filtersPredicate,
            predicate: limitPredicate,
            advLimit: advLimit,
            hierarchicalAttribute: settings.inHierarchicalMode ? settings.hierarchicalAttribute : null,
            hierarchyPaging: settings.hierarchyPaging
          };

          result[componentName] = this.reloadList(queryParameters);
        }
      }, this);

      return hash(result).then(hashModel => {
        listComponentNames.forEach(function(componentName) {
          let settings = this.get(`multiListSettings.${componentName}`);
          if (!isNone(settings)) {
            this.includeSorting(hashModel[componentName], settings.get('sorting'));
            settings.set('model', hashModel[componentName]);
            if (isNone(settings.get('sort'))) {
              let sortQueryParam = serializeSortingParam(settings.get('sorting'), settings.get('sortDefaultValue'));
              settings.set('sort', sortQueryParam);
            }
          }
        }, this);

        return hashModel;
      });
    });
  }
});
