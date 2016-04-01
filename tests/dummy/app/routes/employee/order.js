import EditFormDetailRoute from '../edit-form-detail';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default EditFormDetailRoute.extend(AuthenticatedRouteMixin, {
  modelProjection: 'OrderE',
  modelName: 'order'
});
