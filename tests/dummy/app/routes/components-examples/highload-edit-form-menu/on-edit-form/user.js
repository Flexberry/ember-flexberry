import EditFormRoute from 'ember-flexberry/routes/edit-form';
import ListParameters from 'ember-flexberry/objects/list-parameters';
import MultiListRoute from 'ember-flexberry/mixins/multi-list-route';
import MultiListModelEdit from 'ember-flexberry/mixins/multi-list-model-edit';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default EditFormRoute.extend(MultiListRoute, MultiListModelEdit, {
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'ApplicationUserE'
   */
  modelProjection: 'ApplicationUserE',

  routeHistory: service(),

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-application-user'
   */
  modelName: 'ember-flexberry-dummy-application-user',

  developerUserSettings: computed(function() {
    return { MultiUserListOnEdit: {} }
  }),

  afterModel(model, transition) {
    this._super(...arguments);

    const id = get(model, 'id') || get(model, 'base.id') || null;
    const context = id ? [id] : [];
    const { intent } = transition;
    const routeName = intent.name
      ? intent.name
      : transition.targetName;

    let historyLength = get(this, 'routeHistory._routeHistory').length;
    if ((historyLength > 0) && (get(this, 'routeHistory._routeHistory')[historyLength - 1].contexts[0]  != context[0])
      || historyLength == 0) {
      this.get('routeHistory').pushRoute(routeName, context, intent.queryParams);
    }
  },

  init() {
    this._super(...arguments);

    this.set('multiListSettings.MultiUserListOnEdit', new ListParameters({
      objectlistviewEvents: this.get('objectlistviewEvents'),
      componentName: 'MultiUserListOnEdit',
      modelName: 'ember-flexberry-dummy-application-user',
      projectionName: 'ApplicationUserL',
      editFormRoute: 'ember-flexberry-dummy-application-user-edit'
    }));
  }
});
