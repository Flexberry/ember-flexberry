import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    onMenuItemClick(e) {
      let clickedMenuItem = Ember.$(e.currentTarget);
      this.set('currentItem', clickedMenuItem.data('flexberry-menuitem.item'));
      clickedMenuItem.popup({
        content: 'This menu item has been clicked',
        position: 'top right',
        delay: {
          show: 0,
          hide: 200
        },
        on: 'manual',
        onHidden(e) {
          let owner = Ember.$(e);
          owner.popup('destroy');
        }
      });

      clickedMenuItem.popup('show');

      window.setTimeout((function() {
        clickedMenuItem.popup('hide');
      }).bind(this), 1000);
    }
  },

  /**
    Menu items for 'flexberry-menu' component.

    @property items
    @type Object
  */
  items: null,

  /**
    Selected menu item for 'flexberry-menu' component.

    @property currentItem
    @type Object
  */
  currentItem: null,

  /**
    Template text for 'flexberry-menu' component.

    @property componentTemplateText
    @type String
  */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{flexberry-menu<br>' +
    '  placeholder=placeholder<br>' +
    '  class="compact"<br>' +
    '  items=items<br>' +
    '  onItemClick=(action "onMenuItemClick")<br>' +
    '}}'),

  /**
    Initializes controller.

    @method init
  */
  init() {
    this._super(...arguments);

    let oneMenuSectionItems = [{
      icon: 'search icon',
      title: 'Left side aligned icon',
      items: null
    }, {
      icon: 'setting icon',
      iconAlignment: 'right',
      title: 'Right side aligned icon',
      items: null
    }, {
      icon: 'list layout icon',
      title: 'Submenu',
      itemsAlignment: null,
      items: null
    }];

    let items = Ember.copy(oneMenuSectionItems, true);
    this.set('currentItem', items[0]);
    let currentMenuSectionItems = items;
    for (let i = 0; i < 5; i++) {
      let subMenu = currentMenuSectionItems[2];
      subMenu.items = Ember.copy(oneMenuSectionItems, true);
      subMenu.itemsAlignment = i % 2 === 0 ? 'right' : 'left';

      currentMenuSectionItems = subMenu.items;
    }

    currentMenuSectionItems.pop();

    this.set('items', items);
  },

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
  */
  componentSettingsMetadata: Ember.computed(function() {
    let componentSettingsMetadata = Ember.A();
    componentSettingsMetadata.pushObject({
      settingName: 'icon',
      settingType: 'string',
      settingDefaultValue: 'undefined',
      bindedControllerPropertieName: 'currentItem.icon'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'iconAlignment',
      settingType: 'string',
      settingDefaultValue: 'undefined',
      bindedControllerPropertieName: 'currentItem.iconAlignment'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'title',
      settingType: 'string',
      settingDefaultValue: 'undefined',
      bindedControllerPropertieName: 'currentItem.title'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'itemsAlignment',
      settingType: 'string',
      settingDefaultValue: 'undefined',
      bindedControllerPropertieName: 'currentItem.itemsAlignment'
    });

    return componentSettingsMetadata;
  })
});
