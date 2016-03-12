import Ember from 'ember';

export default Ember.Controller.extend({
  title: 'Test flexberry-menu',

  items: null,

  init: function() {
    this._super(...arguments);

    var oneMenuSectionItems = [{
      icon: 'search icon',
      title: 'Item title after icon',
      items: null
    }, {
      icon: 'setting icon',
      title: 'Item title before icon',
      titleIsBeforeIcon: true,
      items: null
    }, {
      icon: 'list layout icon',
      title: 'Submenu',
      itemsAlignment: null,
      items: null
    }];

    var items = Ember.copy(oneMenuSectionItems, true);
    var currentMenuSectionItems = items;
    for (var i = 0; i < 5; i++) {
      var subMenu = currentMenuSectionItems[2];
      subMenu.items = Ember.copy(oneMenuSectionItems, true);
      subMenu.itemsAlignment = i % 2 === 0 ? 'left' : 'right';

      currentMenuSectionItems = subMenu.items;
    }

    currentMenuSectionItems.pop();

    this.set('items', items);
  }
});
