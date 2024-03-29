import Route from '@ember/routing/route';
import { get } from '@ember/object';

export default Route.extend({
  /**
   * Returns model related to current route.
   *
   * @param params
   * @function model
   */
  model() {
    var store = get(this, 'store');

    var base = store.createRecord('components-examples/flexberry-checkbox/settings-example/base', { flag : null });

    return base;
  }
});
