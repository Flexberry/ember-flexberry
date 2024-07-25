import Controller from '@ember/controller';

export default Controller.extend({
  visible: false,
  actions: {
    actionButton() {
      console.log('actionButton click');
      this.set('visible', true)
    }
  }
});
