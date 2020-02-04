import Route from '@ember/routing/route';
import ModalApplicationRouteMixin from 'ember-flexberry/mixins/modal-application-route';

export default Route.extend(ModalApplicationRouteMixin, {
  actions: {
    /**
      Handles onRefresh action.

      @method actions.onRefresh
    */
    onRefresh() {
      this.refresh();
    },

    showModalSupport() {
      this.send('showModalDialog', 'modals/ember-flexberry-support-modal');
    },
  }
});
