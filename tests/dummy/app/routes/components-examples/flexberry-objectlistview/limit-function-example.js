import Ember from 'ember';
import ListFormRoute from 'ember-flexberry/routes/list-form';
import { Query } from 'ember-flexberry-data';

const { StringPredicate } = Query;

export default ListFormRoute.extend({

  /**
    Current predicate to limit accessible values for lookup.

    @property firstLimitType
    @type BasePredicate
    @default undefined
   */
  firstLimitType: undefined,

  /**
    Current predicate to limit accessible values for lookup.

    @property secondLimitType
    @type BasePredicate
    @default undefined
   */
  secondLimitType: undefined,

  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SuggestionE'
   */
  modelProjection: 'SuggestionE',

  /**
  developerUserSettings.
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
  For default userSetting use empty name ('').
  <componentName> may contain any of properties: colsOrder, sorting, colsWidth or being empty.

  @property developerUserSettings
  @type Object
  @default {}
  */
  developerUserSettings: { FOLVLimitFunctionExampleObjectListView: { } },

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion',

  /**
    It overrides base method and forms the limit predicate for loaded data.
    If there is displayed even number or records per page, records where 'address' attribute contains letter 'S' are filtered.
    If there is displayed odd number or records per page, records where 'address' attribute contains letter 'п' are filtered.

    @public
    @method objectListViewLimitPredicate
    @param {Object} options Method options.
    @param {String} [options.modelName] Type of records to load.
    @param {String} [options.projectionName] Projection name to load data by.
    @param {String} [options.params] Current route query parameters.
    @return {BasePredicate} The predicate to limit loaded data.
   */
  objectListViewLimitPredicate: function(options) {

    let methodOptions = Ember.merge({
      modelName: undefined,
      projectionName: undefined,
      params: undefined
    }, options);

    if (methodOptions.modelName === this.get('modelName') &&
      methodOptions.projectionName === this.get('modelProjection')) {

      let limitFunctionText = this.get('controller.limitFunction');

      if (limitFunctionText) {
        let limitFunction = new StringPredicate('address').contains(limitFunctionText);

        return limitFunction;
      }
    }

    return undefined;
  },

  /**
    Returns model related to current route.
    @method model
   */
  model(params) {

    let store = this.get('store');

    let query = new Query.Builder(store).from(this.get('modelName')).selectByProjection('SuggestionL').where('address', Query.FilterOperator.Neq, '');

    store.query('ember-flexberry-dummy-suggestion', query.build()).then((limitdata) => {
      let limitTypesArr = limitdata.toArray();
      this.set('firstLimitType', limitTypesArr.objectAt(0).get('address'));
      this.set('secondLimitType', limitTypesArr.objectAt(1).get('address'));
    });

    return this._super(...arguments);
  },

  actions: {
    refreshModel: function() {
      this.refresh();
    }
  },

  /**
    Load limit accessible values for lookup.
    @method setupController
   */
  setupController() {
    this._super(...arguments);

    this.set('controller.firstLimitType', this.get('firstLimitType'));

    this.set('controller.secondLimitType', this.get('secondLimitType'));
  }
});
