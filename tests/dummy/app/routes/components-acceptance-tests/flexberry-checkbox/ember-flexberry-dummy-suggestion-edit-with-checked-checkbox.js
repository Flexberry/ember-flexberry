import EditFormRoute from 'ember-flexberry/routes/edit-form';
import EditFormRouteOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-route-operations-indication';
import { computed } from '@ember/object';
export default EditFormRoute.extend(EditFormRouteOperationsIndicationMixin, {

  /**
  A hook you can implement to convert the URL into the model for this route.
  [More info](https://www.emberjs.com/api/ember/release/classes/Route/methods/model?anchor=model).
  @method model
  @param {Object} params
  @param {Object} transition
  */
  model() {
    var record = this.store.createRecord(this.modelName);
    record.set('moderated', true);
    return record;
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
  */
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
    }
  }),

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
   */
  modelName: 'ember-flexberry-dummy-suggestion'

});
