import ListFormPageRoute from './list-form';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default ListFormPageRoute.extend(AuthenticatedRouteMixin, {
  modelName: 'employee',
  modelProjection: 'EmployeeL'
});
