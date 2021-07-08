import Controller from '@ember/controller';
import { get, set } from '@ember/object';

export default Controller.extend({
  actions: {
    openLightbox() {
      set(this, 'appContextSidepageIsOpen', false);
      set(this, 'appContextLightboxIsOpen', true);
      this.send('showModalDialog', 'modal/modal-dialog', { controller: 'components-examples/modal-dialog/index' });
    },

    openSidepage() {
      set(this, 'appContextLightboxIsOpen', false);
      set(this, 'appContextSidepageIsOpen', true);
      this.send('showModalDialog', 'modal/modal-dialog', { controller: 'components-examples/modal-dialog/index' });
    },

    closeLightbox() {
      set(this, 'appContextLightboxIsOpen', false);
      if (!get(this, 'appContextSidepageIsOpen')) {
        this.send('removeModalDialog');
      }
    },

    closeSidepage() {
      set(this, 'appContextSidepageIsOpen', false);
      if (!get(this, 'appContextLightboxIsOpen')) {
        this.send('removeModalDialog');
      }
    },
  },
});
