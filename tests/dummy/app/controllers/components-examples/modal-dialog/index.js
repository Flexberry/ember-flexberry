import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    openLightbox() {
      this.set('appContextSidepageIsOpen', false);
      this.set('appContextLightboxIsOpen', true);
      this.send('showModalDialog', 'modal/modal-dialog', { controller: 'components-examples/modal-dialog/index' });
    },

    openSidepage() {
      this.set('appContextLightboxIsOpen', false);
      this.set('appContextSidepageIsOpen', true);
      this.send('showModalDialog', 'modal/modal-dialog', { controller: 'components-examples/modal-dialog/index' });
    },

    closeLightbox() {
      this.set('appContextLightboxIsOpen', false);
      if (!this.get('appContextSidepageIsOpen')) {
        this.send('removeModalDialog');
      }
    },

    closeSidepage() {
      this.set('appContextSidepageIsOpen', false);
      if (!this.get('appContextLightboxIsOpen')) {
        this.send('removeModalDialog');
      }
    },
  },
});
