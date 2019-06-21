import ListFormRoute from 'ember-flexberry/routes/list-form';
import MultiListRoute from 'ember-flexberry/mixins/multi-list-route';
import MultiListModel from 'ember-flexberry/mixins/multi-list-model';
import ListParameters from 'ember-flexberry/objects/list-parameters';

export default ListFormRoute.extend(MultiListRoute, MultiListModel, {
  init() {
    this._super(...arguments);

    this.set('multiListSettings.MultiUserList', new ListParameters({
      objectlistviewEvents: this.get('objectlistviewEvents'),
      componentName: 'MultiUserList',
      modelName: 'ember-flexberry-dummy-application-user',
      projectionName: 'ApplicationUserL',
      editFormRoute: 'ember-flexberry-dummy-multi-list-user-edit'
    }));

    this.set('multiListSettings.MultiUserList2', new ListParameters({
      objectlistviewEvents: this.get('objectlistviewEvents'),
      componentName: 'MultiUserList2',
      modelName: 'ember-flexberry-dummy-application-user',
      projectionName: 'ApplicationUserL',
      editFormRoute: 'ember-flexberry-dummy-multi-list-user-edit'
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
