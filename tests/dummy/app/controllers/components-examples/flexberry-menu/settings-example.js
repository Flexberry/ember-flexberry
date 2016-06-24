import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    onMenuItemClick(e) {
      let clickedMenuItem = Ember.$(e.delegateTarget);
      this.set('currentItem', clickedMenuItem.data('flexberry-menu'));
      clickedMenuItem.popup({
        content: 'This menu item has been clicked',
        position: 'top right',
        color: 'teal',
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
      }).bind(this), 3000);
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

    let itemsLeft = [{
      icon: 'search icon',
      title: 'Left side aligned icon',
      items: null
    }];

    let itemsRight = [{
      icon: 'setting icon',
      iconAlignment: 'right',
      title: 'Right side aligned icon',
      items: null
    }];

    let itemsSubmenu = [{
      icon: 'list layout icon',
      title: 'Submenu',
      itemsAlignment: null,
      items: [{
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
        itemsAlignment: 'left',
        items: [{
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
          itemsAlignment: 'right',
          items: [{
            icon: 'search icon',
            title: 'Left side aligned icon',
            items: null
          }]
        }]
      }]
    }];

    this.set('itemsLeft', itemsLeft);
    this.set('itemsRight', itemsRight);
    this.set('itemsSubmenu', itemsSubmenu);
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
