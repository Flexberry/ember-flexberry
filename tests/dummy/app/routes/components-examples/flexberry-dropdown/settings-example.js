import Route from '@ember/routing/route';

export default Route.extend({
  /**
    Returns model related to current route.

    @method model
   */
  /* eslint-disable no-unused-vars */
  model(params) {
    let store = this.get('store');

    let base = store.createRecord('components-examples/flexberry-dropdown/settings-example/base', {});

    return base;
  }
  /* eslint-enable no-unused-vars */
});
