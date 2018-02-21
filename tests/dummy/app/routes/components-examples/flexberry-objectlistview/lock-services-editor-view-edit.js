import EditFormRoute from 'ember-flexberry/routes/edit-form';
import EditFormRouteOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-route-operations-indication';

import { Query } from 'ember-flexberry-data';
import Ember from 'ember';

export default EditFormRoute.extend(EditFormRouteOperationsIndicationMixin, {
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
  modelName: 'ember-flexberry-dummy-suggestion',

  model(params) {
    let userService = Ember.getOwner(this).lookup('service:user');
    let modelName = 'new-platform-flexberry-services-lock';

    let builder = new Query.Builder(this.store)
      .from('new-platform-flexberry-services-lock')
      .selectByProjection('LockL')
      .byId(`'${params.id}'`);

    this.store.query(modelName, builder.build()).then((lock) => {
      if (lock.content.length) {
        let lockUser = lock.objectAt(0).get('userName');
        if (lockUser !== userService.getCurrentUserName()) {
          this.set('controller.blockedByUser', lockUser);
        } else {
          this.set('controller.blockedByUser', undefined);
        }
      } else {
        this.set('controller.blockedByUser', undefined);
      }
    });

    return this._super(...arguments);
  }
});
