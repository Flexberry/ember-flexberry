import Ember from 'ember';
import ListFormRoute from 'ember-flexberry/routes/list-form';
import ListParameters from 'ember-flexberry/objects/list-parameters';
import serializeSortingParam from 'ember-flexberry/utils/serialize-sorting-param';
import { Query } from 'ember-flexberry-data';
const { Condition, ComplexPredicate } = Query;

export default ListFormRoute.extend({
  multiListSettings: {},

  /**
    Service that triggers objectlistview events.

    @property objectlistviewEvents
    @type Service
  */
  objectlistviewEvents: Ember.inject.service(),

  init() {
    this.set('multiListSettings.MultiUserList', new ListParameters({
      objectlistviewEvents: this.get('objectlistviewEvents'),
      componentName: 'MultiUserList',
      modelName: 'ember-flexberry-dummy-application-user',
      projectionName: 'ApplicationUserL',
      editFormRoute: 'ember-flexberry-dummy-application-user-edit'
    }));

    this.set('multiListSettings.MultiUserList2', new ListParameters({
      objectlistviewEvents: this.get('objectlistviewEvents'),
      componentName: 'MultiUserList2',
      modelName: 'ember-flexberry-dummy-application-user',
      projectionName: 'ApplicationUserL',
      editFormRoute: 'ember-flexberry-dummy-application-user-edit'
    }));

    this.set('multiListSettings.MultiSuggestionList', new ListParameters({
      objectlistviewEvents: this.get('objectlistviewEvents'),
      componentName: 'MultiSuggestionList',
      modelName: 'ember-flexberry-dummy-suggestion',
      projectionName: 'SuggestionL',
      editFormRoute: 'ember-flexberry-dummy-suggestion-edit',
      exportExcelProjection: 'SuggestionL'
    }));

    this.set('multiListSettings.MultiHierarchyList', new ListParameters({
      objectlistviewEvents: this.get('objectlistviewEvents'),
      componentName: 'MultiHierarchyList',
      modelName: 'ember-flexberry-dummy-suggestion-type',
      projectionName: 'SuggestionTypeL',
      editFormRoute: 'ember-flexberry-dummy-suggestion-type-edit',
      inHierarchicalMode: true,
      hierarchicalAttribute: 'parent'
    }));
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
      let predicate = this.objectListViewLimitPredicate({ modelName: settings.get('modelName'), projectionName: settings.get('projectionName'), params: settings });
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

    this.get('objectlistviewEvents').on('refreshListOnly', function(componentName) {
      controller.get('reloadListByName').apply(controller, [componentName]);
    });
  },

  actions: {
    /**
      Set in `property` for `target` promise that load nested records.

      @method actions.loadRecordsById
      @param {String} id Record ID.
      @param {ObjectListViewRowComponent} target Instance of {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}}.
      @param {String} property Property name into {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}}.
      @param {Boolean} firstRunMode Flag indicates that this is the first download of data.
      @param {Object} recordParams Record params such as modelName, modelProjection and hierarchicalAttribute.
    */
    loadRecordsById(id, target, property, firstRunMode, recordParams) {
      return this._super(...arguments);
    }
  },

  /**
    Return predicate for `QueryBuilder` or `undefined`.

    @method _filtersPredicate
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
    Defined user settings developer.
    For default userSetting use empty name ('').
    Property `<componentName>` may contain any of properties: `colsOrder`, `sorting`, `colsWidth` or being empty.

    ```javascript
    {
      <componentName>: {
        <settingName>: {
          colsOrder: [ { propName :<colName>, hide: true|false }, ... ],
          sorting: [{ propName: <colName>, direction: "asc"|"desc" }, ... ],
          colsWidths: [ <colName>:<colWidth>, ... ],
        },
        ...
      },
      ...
    }
    ```

    @property developerUserSettings
    @type Object
    @default {}
  */
  developerUserSettings: { MultiUserList: {}, MultiUserList2: {}, MultiSuggestionList: {}, MultiHierarchyList: {} },
});
