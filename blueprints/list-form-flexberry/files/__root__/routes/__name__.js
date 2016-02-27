import ListFormRoute from './list-form';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default ListFormRoute.extend(AuthenticatedRouteMixin, {
  modelProjection: '<%=modelProjection%>',
  modelName: '<%=modelName%>'
});
