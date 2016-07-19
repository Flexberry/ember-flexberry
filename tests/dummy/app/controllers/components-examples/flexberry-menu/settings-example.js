import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    onMenuItemClick(e) {
      let clickedMenu = Ember.$(e.delegateTarget);
      let clickedMenuItem = Ember.$(e.currentTarget);
      if (e.currentTarget) {
        this.set('currentItem', clickedMenuItem.data('flexberry-menuitem.item'));
      } else {
        this.set('currentItem', clickedMenu.data('flexberry-menu'));
      }

      clickedMenu.popup({
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

      clickedMenu.popup('show');

      window.setTimeout((function() {
        clickedMenu.popup('hide');
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
  },

  /**
    Initializes itemsLeft.

    @property itemsLeft
    @type Object
  */
  itemsLeft: Ember.computed('i18n.locale', function() {
    let i18n = this.get('i18n');
    let  nodes = [{
        icon: 'search icon',
        title: i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon1'),
        items: null
      }];
    return nodes;
  }),

  /**
    Initializes itemsRight.

    @property itemsRight
    @type Object
  */
  itemsRight: Ember.computed('i18n.locale', function() {
    let i18n = this.get('i18n');
    let  nodes = [{
      icon: 'setting icon',
      iconAlignment: 'right',
      title: i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon2'),
      items: null
    }];
    return nodes;
  }),

  /**
    Initializes itemsSubmenu.

    @property itemsSubmenu
    @type Object
  */
  itemsSubmenu: Ember.computed('i18n.locale', function() {
    let i18n = this.get('i18n');
    let nodes = [{
      icon: 'list layout icon',
      title: i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon3'),
      itemsAlignment: null,
      items: [{
        icon: 'search icon',
        title: i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon1'),
        items: null
      }, {
        icon: 'setting icon',
        iconAlignment: 'right',
        title: i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon2'),
        items: null
      }, {
        icon: 'list layout icon',
        title: i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon3'),
        itemsAlignment: 'left',
        items: [{
          icon: 'search icon',
          title: i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon1'),
          items: null
        }, {
          icon: 'setting icon',
          iconAlignment: 'right',
          title: i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon2'),
          items: null
        }, {
          icon: 'list layout icon',
          title: i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon3'),
          itemsAlignment: 'right',
          items: [{
            icon: 'search icon',
            title: i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon1'),
            items: null
          }]
        }]
      }]
    }];
    return nodes;
  }),

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
