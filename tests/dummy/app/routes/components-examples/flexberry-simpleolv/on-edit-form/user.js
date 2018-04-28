import EditFormRoute from 'ember-flexberry/routes/edit-form';
import { computed } from '@ember/object';
export default EditFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'ApplicationUserE'
   */
  modelProjection: 'ApplicationUserE',

  developerUserSettings: computed(function() {
    return { FOLVOnEditFormSuggestionsObjectListView: { } }}),
  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-application-user'
   */
  modelName: 'ember-flexberry-dummy-application-user'
});
