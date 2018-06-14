import Route from '@ember/routing/route';

export default Route.extend({
  /**
    A hook you can use to setup the controller for the current route.
    [More info](http://emberjs.com/api/classes/Ember.Route.html#method_setupController).

    @method setupController
    @param {<a href="http://emberjs.com/api/classes/Ember.Controller.html">Ember.Controller</a>} controller
    @param {Object} model
  */
  /* eslint-disable no-unused-vars */
  setupController: function(controller, model) {
    this._super(...arguments);
    controller.getCounts();
  }
  /* eslint-enable no-unused-vars */
});
