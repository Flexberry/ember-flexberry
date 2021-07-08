import ListFormRoute from 'ember-flexberry/routes/list-form';
import { SimplePredicate } from 'ember-flexberry-data/query/predicate';
import { computed } from '@ember/object';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';

export default ListFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SuggestionL'
   */
  modelProjection: 'FlexberryObjectlistviewFilterTest',

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
  */
  developerUserSettings: computed(function() {
    return {
      FOLVSettingExampleObjectListView: { }
    }
  }),

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion',

  /**
    It overrides base method and forms the limit predicate for loaded data.

    @public
    @method objectListViewLimitPredicate
    @param {Object} options Method options..
   */
  /* eslint-disable no-unused-vars */
  objectListViewLimitPredicate: function(options) {
    let limitFunction = new SimplePredicate('address', FilterOperator.Neq, undefined);
    return limitFunction;
  },
  /* eslint-enable no-unused-vars */

  /**
    This method will be invoked always when load operation completed,
    regardless of load promise's state (was it fulfilled or rejected).

    @method onModelLoadingAlways.
    @param {Object} data Data about completed load operation.
   */
  /* eslint-disable no-unused-vars */
  onModelLoadingAlways(data) {
    let loadCount = this.get('controller.loadCount') + 1;
    this.set('controller.loadCount', loadCount);
  },
  /* eslint-enable no-unused-vars */
});
