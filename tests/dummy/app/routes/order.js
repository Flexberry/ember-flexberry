import EditFormRoute from './edit-form';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default EditFormRoute.extend(AuthenticatedRouteMixin, {
  modelProjection: 'OrderE',
  modelName: 'order'
});
