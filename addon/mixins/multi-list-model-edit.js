/**
  @module ember-flexberry
*/

import Ember from 'ember';
import serializeSortingParam from '../utils/serialize-sorting-param';

/**
  Mixin for {{#crossLink "EditFormRoute"}}{{/crossLink}},
  provides data loading for multi olv.

  @class MultiListModelEditMixin
  @uses <a href="https://api.emberjs.com/ember/release/classes/Mixin">Ember.Mixin</a>
*/
export default Ember.Mixin.create({
  beforeModel() {
    return Ember.RSVP.Promise.resolve(this._super(...arguments)).then(() => {
      let userSettingsService = this.get('userSettingsService');
      let listComponentNames = userSettingsService.getListComponentNames();
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

      return Ember.RSVP.hash(result).then(hashModel => {
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
      });
    });
  }
});
