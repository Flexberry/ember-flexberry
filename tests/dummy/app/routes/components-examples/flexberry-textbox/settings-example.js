import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  appState: service(),

  beforeModel() {
    this._super(...arguments);

    this.get('appState').validationShow();
  },

  /**
    Returns model related to current route.

    @method model
   */
  /* eslint-disable no-unused-vars */
  model(params) {
    var store = this.get('store');

    var base = store.createRecord('components-examples/flexberry-textbox/settings-example/base', {});

    return base;
  }
  /* eslint-enable no-unused-vars */
});
