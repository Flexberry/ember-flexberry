import EditFormAggregatorRoute from './edit-form-aggregator';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default EditFormAggregatorRoute.extend(AuthenticatedRouteMixin, {
  modelProjection: 'EmployeeE',
  modelName: 'employee'
});
