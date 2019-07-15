import EditFormRoute from 'ember-flexberry/routes/edit-form';
import MultiListRoute from 'ember-flexberry/mixins/multi-list-route';
import MultiListModelEdit from 'ember-flexberry/mixins/multi-list-model-edit';
import ListParameters from 'ember-flexberry/objects/list-parameters';
import EditFormRouteOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-route-operations-indication';

export default EditFormRoute.extend(MultiListRoute, MultiListModelEdit, EditFormRouteOperationsIndicationMixin, {
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
      editFormRoute: 'components-examples/flexberry-objectlistview/ember-flexberry-dummy-suggestion-multi-list-edit',
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
  developerUserSettings: {
    suggestionUserVotesGroupEdit: {
      'DEFAULT': {
        'columnWidths': [
          { 'propName': 'OlvRowToolbar', 'fixed': true, 'width': 65 },
          { 'propName': 'voteType', 'width': 133 },
          { 'propName': 'author', 'width': 348 },
          { 'propName': 'author.eMail', 'width': 531 }
        ],
        'sorting': [{ 'propName': 'author', 'direction': 'asc', 'attributePath': 'author.name' }]
      }
    },
    filesGroupEdit: {
      'DEFAULT': {
        'columnWidths': [
          { 'propName': 'OlvRowToolbar', 'fixed': true, 'width': 65 },
          { 'propName': 'order', 'width': 140 },
          { 'propName': 'file', 'width': 893 }
        ],
        'colsOrder': [{ 'propName': 'file' }, { 'propName': 'order' }],
        'sorting': [{ 'propName': 'order', 'direction': 'desc' }]
      }
    },
    suggestionCommentsGroupEdit: {
      'DEFAULT': {
        'columnWidths': [{ 'propName': 'OlvRowToolbar', 'fixed': true, 'width': 65 }, { 'propName': 'votes', 'fixed': true }],
        'sorting': [
          { 'propName': 'votes', 'direction': 'asc' },
          { 'propName': 'moderated', 'direction': 'desc' },
          { 'propName': 'text', 'direction': 'asc' }
        ],
      }
    }
  },

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion'

});
