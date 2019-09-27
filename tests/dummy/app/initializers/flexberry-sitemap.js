import FlexberrySitemap from 'ember-flexberry/components/flexberry-sitemap';
import $ from 'jquery';

export function initialize() {
  FlexberrySitemap.reopen({
    isDropDown: false,

    init() {
      this._super(...arguments);
      if (this.isDropDown) {
        this.classNames = ['item', 'ui', 'dropdown', 'link'];
      }
    },

    didRender() {
      this._super(...arguments);
      $('.dropdown').dropdown({
        on: 'hover',
        transition: 'slide right',
      });
    }
  });
}

export default {
  name: 'flexberry-sitemap',
  initialize
};
