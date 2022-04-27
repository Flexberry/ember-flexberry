import FlexberryMenu from './../flexberry-menu';

export default FlexberryMenu.extend({
  didInsertElement() {

    // Bind right context to menu click event handler.
    let onClickHandler = this.get('_onClickHandler').bind(this);
    this.set('_onClickHandler', onClickHandler);

    // Attach menu click event handler.
    this.$().on(this.get('onlyClickHandler') ? 'click' : 'click touchstart', onClickHandler);
    this._getActionForMenu(false);
  },

  /**
    Menu's collapseMenuOnItemClick observer.
  */
  _collapseMenuOnItemClickDidChange: undefined,
});
