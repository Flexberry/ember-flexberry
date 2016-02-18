import ListFormRoute from './list-form';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default ListFormRoute.extend(AuthenticatedRouteMixin, {
  modelName: 'employee',
  modelProjection: 'EmployeeL',

  /**
   * This hook is the first of the route entry validation hooks called when an attempt is made to transition into a route or one of its children.
   * It is called before model and lets update limit function without unnecessary data load.
   *
   * @param {Ember.Object} transition Current route transition.
   */
  beforeModel: function(transition) {
    let params = this.paramsFor(transition.targetName);
    let currentPerPageValue = params.perPage;
    this.updateLimitFunction(currentPerPageValue % 2 === 0 ? 'FirstName ge \'N\'' : 'FirstName lt \'N\'', params, transition);
  }
});
