import ListFormPageRoute from 'ember-flexberry/routes/list-form';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default ListFormPageRoute.extend(AuthenticatedRouteMixin, {
  modelName: 'order',
  modelProjection: 'OrderL'
});
