import EditFormRoute from 'ember-flexberry/routes/edit-form';
import EditFormRouteOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-route-operations-indication';
import MultiListRoute from 'ember-flexberry/mixins/multi-list-route';
import ListParameters from 'ember-flexberry/objects/list-parameters';
import { computed, get, set } from '@ember/object';
import { SimplePredicate, ComplexPredicate, FalsePredicate } from 'ember-flexberry-data/query/predicate';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Condition from 'ember-flexberry-data/query/condition';
import { resolve, hash } from 'rsvp';
import { isNone, isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import serializeSortingParam from '../utils/serialize-sorting-param';

export default EditFormRoute.extend(EditFormRouteOperationsIndicationMixin, MultiListRoute, {

  /**
    Service for managing advLimits for lists.

    @property advLimit
    @type AdvLimitService
   */
  advLimit: service(),

  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'ApplicationUserE'
   */
  modelProjection: 'ApplicationUserE',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-application-user'
   */
  modelName: 'ember-flexberry-dummy-application-user',

  /**
    developerUserSettings.
    {
    <componentName>: {
      <settingName>: {
          colsOrder: [ { propName :<colName>, hide: true|false }, ... ],
          sorting: [{ propName: <colName>, direction: 'asc'|'desc' }, ... ],
          colsWidths: [ <colName>:<colWidth>, ... ],
        },
        ...
      },
      ...
    }
    For default userSetting use empty name ('').
    <componentName> may contain any of properties: colsOrder, sorting, colsWidth or being empty.

    @property developerUserSettings
    @type Object
    @default {}
   */

  developerUserSettings: computed(function() {
    return {
      MultiUserList: {},
    }
  }),

  /**
    OLV limit predicate.

    @param component OLV component.
    @returns Predicate.
   */
  objectListViewLimitPredicate(component) {
    if (component.params.componentName === 'MultiUserList') {
      return this.getMultiUserListPredicate(component);
    }

    return null;
  },

  /**
    Limit predicate for MultiUserList.

    @param component MultiUserList component.
    @returns Predicate.
   */
  getMultiUserListPredicate(component) {
    let email = '';

    if (this.currentModel) {
      email = this.currentModel.eMail;
    }

    if (component.model) {
      email = component.model.eMail;
    }

    if (isEmpty(email)) {
      return new FalsePredicate();
    }

    const { id } = this.paramsFor(this.get('routeName'));

    return new ComplexPredicate(Condition.And,
      new SimplePredicate('eMail', FilterOperator.Eq, email),
      new SimplePredicate('id', FilterOperator.Neq, id)
    );
  },

  init() {
    this._super(...arguments);

    this.set('multiListSettings.MultiUserList', new ListParameters({
      objectlistviewEvents: this.get('objectlistviewEvents'),
      componentName: 'MultiUserList',
      modelName: 'ember-flexberry-dummy-application-user',
      projectionName: 'ApplicationUserL',
      readonly: true
    }));
  },

  afterModel(model, transition) {
    this._super(...arguments);
    this.getMultiListModels(transition, model);
  },

  /**
    Get models for Multilists.

    @param transition Transition.
    @param model Resolved model.
    @returns Hash models.
   */
  getMultiListModels(transition, model) {
    const advLimitService = this.get('advLimit');

    return resolve(this._super(...arguments)).then(() => {
      const developerUserSettings = this.get('developerUserSettings');
      const webPage = transition.targetName;
      advLimitService.setCurrentAppPage(webPage);

      return advLimitService.getAdvLimitsFromStore(Object.keys(developerUserSettings));
    }).then(() => {
      const userSettingsService = this.get('userSettingsService');
      const listComponentNames = userSettingsService.getListComponentNames();
      let result = {};
      listComponentNames.forEach(function(componentName) {
        this.get('colsConfigMenu').updateNamedSettingTrigger(componentName);
        this.get('colsConfigMenu').updateNamedAdvLimitTrigger(componentName);
        let settings = this.get(`multiListSettings.${componentName}`);

        if (!isNone(settings)) {
          const filtersPredicate = this._filtersPredicate(componentName);
          const sorting = userSettingsService.getCurrentSorting(componentName);
          const perPage = userSettingsService.getCurrentPerPage(componentName);
          set(settings, 'filtersPredicate', filtersPredicate);
          set(settings, 'perPage', perPage);
          set(settings, 'sorting', sorting);

          const limitPredicate =
            this.objectListViewLimitPredicate({ modelName: settings.modelName, projectionName: settings.projectionName, params: settings, model: model });

          const advLimit = advLimitService.getCurrentAdvLimit(componentName);

          // OLV-settings.
          const queryParameters = {
            componentName: componentName,
            modelName: settings.modelName,
            projectionName: settings.projectionName,
            perPage: settings.perPage,
            page: settings.page || 1,
            sorting: settings.sorting,
            filter: settings.filter,
            filterCondition: settings.filterCondition,
            filterProjectionName: settings.filterProjectionName,
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
            this.includeSorting(hashModel[componentName], get(settings, 'sorting'));
            set(settings, 'model', hashModel[componentName]);
            if (isNone(get(settings, 'sort'))) {
              const sortQueryParam = serializeSortingParam(get(settings, 'sorting'), get(settings, 'sortDefaultValue'));
              set(settings, 'sort', sortQueryParam);
            }
          }
        }, this);

        return hashModel;
      });
    });
  },
});
