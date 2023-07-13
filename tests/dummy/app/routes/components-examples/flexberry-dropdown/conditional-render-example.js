import Route from '@ember/routing/route';

export default Route.extend({
  /**
    Returns model related to current route.

    @method model
   */
  /* eslint-disable no-unused-vars */
  model(params) {
    var store = this.get('store');

    var base = store.createRecord('components-examples/flexberry-dropdown/conditional-render-example/base', {
      enumeration: null
    });

    return base;
  }
  /* eslint-enable no-unused-vars */
});
