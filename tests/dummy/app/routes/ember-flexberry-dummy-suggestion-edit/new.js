import EditFormNewRoute from 'ember-flexberry/routes/edit-form-new';
import EditFormRouteOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-route-operations-indication';
import { computed } from '@ember/object';
export default EditFormNewRoute.extend(EditFormRouteOperationsIndicationMixin, {
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SuggestionE'
  */
  modelProjection: 'SuggestionE',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
  */
  modelName: 'ember-flexberry-dummy-suggestion',

  /**
    Name of template to be rendered.

    @property templateName
    @type String
    @default 'ember-flexberry-dummy-suggestion-edit'
  */
  templateName: 'ember-flexberry-dummy-suggestion-edit',

  developerUserSettings: computed(function() {
    return {
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
  }}),
});
