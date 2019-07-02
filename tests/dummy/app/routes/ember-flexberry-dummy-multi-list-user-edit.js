import EditFormRoute from 'ember-flexberry/routes/edit-form';
import ListParameters from 'ember-flexberry/objects/list-parameters';
import MultiListRoute from 'ember-flexberry/mixins/multi-list-route';
import MultiListModelEdit from 'ember-flexberry/mixins/multi-list-model-edit';

export default EditFormRoute.extend(MultiListRoute, MultiListModelEdit, {
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'ApplicationUserE'
   */
  modelProjection: 'ApplicationUserE',

  developerUserSettings: { MultiUserListOnEdit: {}, MultiUserList2OnEdit: {}, MultiSuggestionListOnEdit: {}, MultiHierarchyListOnEdit: {} },

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-application-user'
   */
  modelName: 'ember-flexberry-dummy-application-user',

  init() {
    this._super(...arguments);

    this.set('multiListSettings.MultiUserListOnEdit', new ListParameters({
      objectlistviewEvents: this.get('objectlistviewEvents'),
      componentName: 'MultiUserListOnEdit',
      modelName: 'ember-flexberry-dummy-application-user',
      projectionName: 'ApplicationUserL',
      editFormRoute: 'ember-flexberry-dummy-application-user-edit'
    }));

    this.set('multiListSettings.MultiUserList2OnEdit', new ListParameters({
      objectlistviewEvents: this.get('objectlistviewEvents'),
      componentName: 'MultiUserList2OnEdit',
      modelName: 'ember-flexberry-dummy-application-user',
      projectionName: 'ApplicationUserL',
      editFormRoute: 'ember-flexberry-dummy-application-user-edit'
    }));

    this.set('multiListSettings.MultiSuggestionListOnEdit', new ListParameters({
      objectlistviewEvents: this.get('objectlistviewEvents'),
      componentName: 'MultiSuggestionListOnEdit',
      modelName: 'ember-flexberry-dummy-suggestion',
      projectionName: 'SuggestionL',
      editFormRoute: 'ember-flexberry-dummy-suggestion-edit',
      exportExcelProjection: 'SuggestionL'
    }));

    this.set('multiListSettings.MultiHierarchyListOnEdit', new ListParameters({
      objectlistviewEvents: this.get('objectlistviewEvents'),
      componentName: 'MultiHierarchyListOnEdit',
      modelName: 'ember-flexberry-dummy-suggestion-type',
      projectionName: 'SuggestionTypeL',
      editFormRoute: 'ember-flexberry-dummy-suggestion-type-edit',
      inHierarchicalMode: true,
      hierarchicalAttribute: 'parent'
    }));
  },
});
