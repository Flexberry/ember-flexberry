import FlexberryBaseComponent from 'ember-flexberry/components/flexberry-base-component';

export default FlexberryBaseComponent.extend({
  classNames: ['button-dropdown-menu', 'menu'],

  actions: {
    /**
     * Call action of a clicked button.
     */
    sendButtonAction() {
      this.get('sendButtonAction')(...arguments);
    }
  }
});
