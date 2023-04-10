import Controller from '@ember/controller';
export default Controller.extend({

  actions: {

    root() {
      this.transitionToRoute('components-examples/flexberry-objectlistview/inheritance-models/parent-list');
    },

    successorPhone() {
      this.transitionToRoute('components-examples/flexberry-objectlistview/inheritance-models/successor-phone-list');
    },

    successorSoc() {
      this.transitionToRoute('components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-list');
    },

  }
});
