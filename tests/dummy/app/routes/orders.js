import ListFormRoute from './list-form';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default ListFormRoute.extend(AuthenticatedRouteMixin, {
  modelName: 'order',
  modelProjection: 'OrderL'
});
