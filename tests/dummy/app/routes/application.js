import Route from '@ember/routing/route';
import ModalApplicationRouteMixin from 'ember-flexberry/mixins/modal-application-route';

export default Route.extend(ModalApplicationRouteMixin, {
  /**
  Returns model related to current route.

  @method model
  */
  /* eslint-disable no-unused-vars */
  model(params) {
    return this.get('store').createRecord('components-examples/flexberry-file/settings-example/base', {});
  },

  actions: {
    /**
      Handles onRefresh action.

      @method actions.onRefresh
    */
    onRefresh() {
      this.refresh();
    },

    showModalSupport() {
      this.send('showModalDialog', 'modal/ember-flexberry-support-modal');
    },
  }
});
