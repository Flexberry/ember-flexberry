import Route from '@ember/routing/route';

export default Route.extend({
  /**
    A hook you can use to setup the controller for the current route.
    [More info](https://www.emberjs.com/api/ember/release/classes/Route/methods/setupController?anchor=setupController).

    @method setupController
    @param {<a href="https://emberjs.com/api/ember/release/classes/Controller">Controller</a>} controller
    @param {Object} model
  */
  /* eslint-disable no-unused-vars */
  setupController: function(controller, model) {
    this._super(...arguments);
    controller.getCounts();
  }
  /* eslint-enable no-unused-vars */
});
