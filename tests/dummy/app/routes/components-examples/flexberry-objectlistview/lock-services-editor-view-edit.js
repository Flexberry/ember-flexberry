import { computed } from '@ember/object';
import EditFormRoute from 'ember-flexberry/routes/edit-form';
import EditFormRouteOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-route-operations-indication';
import LockServicesMixineRoute from 'ember-flexberry/mixins/lock-route';

export default EditFormRoute.extend(EditFormRouteOperationsIndicationMixin, LockServicesMixineRoute, {
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
  modelName: 'ember-flexberry-dummy-suggestion',

  blockedByUser: undefined,

  /**
    This function will be called to solve open form read only or transition to parent route.
    You can override function for custom behavior.

    @method openReadOnly
    @param {String} lockUserName
    @return {Promise}
    @for EditFormRoute
  */

  openReadOnly(lockUserName) {
    this.set('blockedByUser', lockUserName);
    return this._super(...arguments);
  },

  /**
    Load limit accessible values for lookup.

    @method setupController
  */
  setupController() {
    this._super(...arguments);

    this.set('controller.blockedByUser', this.get('blockedByUser'));
  },

  /* eslint-disable no-unused-vars */
  resetController(controller, isExiting, transition) {
    this._super(...arguments);

    this.set('blockedByUser', undefined);
  }
  /* eslint-enable no-unused-vars */
});
