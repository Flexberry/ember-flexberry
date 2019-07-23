import FlexberrySitemap from 'ember-flexberry/components/flexberry-sitemap';
import $ from 'jquery';

export function initialize() {
  FlexberrySitemap.reopen({
    isDropDown: false,

    init() {
      this._super(...arguments);
      if (this.isDropDown) {
        this.classNames = ['item', 'ui', 'pointing', 'dropdown', 'link'];
      }
    },

    didRender() {
      this._super(...arguments);
      $('.dropdown').dropdown({on: 'hover' });
    }
  });
}

export default {
  name: 'flexberry-sitemap',
  initialize
};
