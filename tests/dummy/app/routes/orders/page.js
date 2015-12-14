import ListFormPageRoute from 'ember-flexberry/routes/list-form-page';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default ListFormPageRoute.extend(AuthenticatedRouteMixin, {
  modelName: 'order',
  modelProjection: 'OrderL'
});
