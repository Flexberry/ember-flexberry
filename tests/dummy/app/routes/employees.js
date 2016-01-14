import ListFormPageRoute from 'ember-flexberry/routes/list-form';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default ListFormPageRoute.extend(AuthenticatedRouteMixin, {
  modelName: 'employee',
  modelProjection: 'EmployeeL'
});
