import FlexberryMenuButton from './../flexberry-menuitem';
export default FlexberryMenuButton.extend({

  /**
    Initializes DOM-related component's logic.
  */
  didInsertElement() {
    let item = this.get('item');
    if (this.get('tagName') !== '') {
      this.$().data('flexberry-menuitem.item', item).on('click', this, this.openModal.bind(this));
    } else {
      let parentView = this.get('parentView');
      let $parentView = parentView.$();
      $parentView.data('flexberry-menu', item);
      if (this.get('hasSubitems')) {
        $parentView.on('click', this, this.openModal.bind(this));
      }
    }
  },

  /**
    Open modal dialog.
  */
  openModal() {
    let currentController = this.get('currentController')
    let controller = currentController.get('flexberryMenuitemDialogController');
    controller.set('mainControler', this);

    let loadingParams = {
      view: 'application',
      outlet: 'modal'
    };
    controller.send('showModalDialog', 'flexberry-menuitem-dialog');

    loadingParams = {
      view: 'flexberry-menuitem-dialog',
      outlet: 'modal-content'
    };
    controller.send('showModalDialog', 'flexberry-menuitem-dialog-content',
      { controller: controller, model: { data: this.get('item.items'), onItemClick: this.get('onItemClick') } }, loadingParams);
  }
});
