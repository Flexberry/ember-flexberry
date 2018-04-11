import $ from 'jquery';
import Controller from '@ember/controller';
import { computed, observer } from '@ember/object';
import { A } from '@ember/array';
import { htmlSafe } from '@ember/string';

export default Controller.extend({
  actions: {
    onMenuItemClick(e) {
      let clickedMenu = $(e.delegateTarget);
      let clickedMenuItem = $(e.currentTarget);
      if (e.currentTarget) {
        this.set('currentItem', clickedMenuItem.data('flexberry-menuitem.item'));
      } else {
        let selectMenu = $.trim(e.delegateTarget.innerText);
        let selectValue;
        if (selectMenu === this.get('i18n').t('forms.components-examples.flexberry-menu.settings-example.titleIcon1').toString()) {
          selectValue = 'itemsLeft';
        }

        if (selectMenu === this.get('i18n').t('forms.components-examples.flexberry-menu.settings-example.titleIcon2').toString()) {
          selectValue = 'itemsRight';
        }

        if (selectMenu === this.get('i18n').t('forms.components-examples.flexberry-menu.settings-example.titleIcon3').toString()) {
          selectValue = 'itemsSubmenu';
        }

        if (selectValue) {
          let selectElement = this.get(selectValue)[0];
          this.set('currentItem', selectElement);
        }
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
          let owner = $(e);
          owner.popup('destroy');
        }
      });

      clickedMenu.popup('show');

      window.setTimeout((function() {
        clickedMenu.popup('hide');
      }).bind(this), 3000);
    },
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
    @property collapseMenuOnItemClick
    @type Boolean
    @default true
  */
  collapseMenuOnItemClick: true,

  /**
    @property isVertical
    @type Boolean
    @default false
  */
  isVertical: false,

  /**
    Template text for 'flexberry-menu' component.

    @property componentTemplateText
    @type String
  */
  componentTemplateText: new htmlSafe(
    '{{flexberry-menu<br>' +
    '  placeholder=placeholder<br>' +
    '  class="compact"<br>' +
    '  items=items<br>' +
    '  collapseMenuOnItemClick=collapseMenuOnItemClick<br>' +
    '  onItemClick=(action "onMenuItemClick")<br>' +
    '}}'),

  /**
    Initializes controller.

    @method init
  */
  init() {
    this._super(...arguments);

    let i18n = this.get('i18n');
    let itemsLeft = [{
      icon: 'search icon',
      title: i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon1'),
      items: null
    }];

    let itemsRight = [{
      icon: 'setting icon',
      iconAlignment: 'right',
      title: i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon2'),
      items: null
    }];

    let itemsSubmenu = [{
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

    this.set('itemsLeft', itemsLeft);
    this.set('itemsRight', itemsRight);
    this.set('itemsSubmenu', itemsSubmenu);
  },

  /**
    Handles changes in i18n.locale.

    @method _menuTitle
    @private
   */
  _menuTitle: observer('i18n.locale', function() {
    let i18n = this.get('i18n');
    if (typeof this.get('itemsLeft.0.title') === 'object') {
      this.set('itemsLeft.0.title', i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon1'));
    }

    if (typeof this.get('itemsRight.0.title') === 'object') {
      this.set('itemsRight.0.title', i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon2'));
    }

    if (typeof this.get('itemsSubmenu.0.title') === 'object') {
      this.set('itemsSubmenu.0.title', i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon3'));
    }

    if (typeof this.get('itemsSubmenu.0.items.0.title') === 'object') {
      this.set('itemsSubmenu.0.items.0.title', i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon1'));
    }

    if (typeof this.get('itemsSubmenu.0.items.1.title') === 'object') {
      this.set('itemsSubmenu.0.items.1.title', i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon2'));
    }

    if (typeof this.get('itemsSubmenu.0.items.2.title') === 'object') {
      this.set('itemsSubmenu.0.items.2.title', i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon3'));
    }

    if (typeof this.get('itemsSubmenu.0.items.2.items.0.title') === 'object') {
      this.set('itemsSubmenu.0.items.2.items.0.title', i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon1'));
    }

    if (typeof this.get('itemsSubmenu.0.items.2.items.1.title') === 'object') {
      this.set('itemsSubmenu.0.items.2.items.1.title', i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon2'));
    }

    if (typeof this.get('itemsSubmenu.0.items.2.items.2.title') === 'object') {
      this.set('itemsSubmenu.0.items.2.items.2.title', i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon3'));
    }

    if (typeof this.get('itemsSubmenu.0.items.2.items.2.items.0.title') === 'object') {
      this.set('itemsSubmenu.0.items.2.items.2.items.0.title', i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon1'));
    }
  }),

  /**
    Handles changes in currentItem.title.

    @method _titleChanged
    @private
   */
  _titleChanged: observer('currentItem.title', function() {
    let i18n = this.get('i18n');
    if (this.get('currentItem.title') === this.get('i18n').t('forms.components-examples.flexberry-menu.settings-example.titleIcon1').toString()) {
      this.set('currentItem.title', i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon1'));
    }

    if (this.get('currentItem.title') === this.get('i18n').t('forms.components-examples.flexberry-menu.settings-example.titleIcon2').toString()) {
      this.set('currentItem.title', i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon2'));
    }

    if (this.get('currentItem.title') === this.get('i18n').t('forms.components-examples.flexberry-menu.settings-example.titleIcon3').toString()) {
      this.set('currentItem.title', i18n.t('forms.components-examples.flexberry-menu.settings-example.titleIcon3'));
    }
  }),

  menuPosition: computed('isVertical', function() {
    let isVertical = this.get('isVertical');
    if (isVertical === true) {
      return 'ui basic vertical buttons';
    } else {
      return 'ui basic buttons';
    }
  }),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
  */
  componentSettingsMetadata: computed(function() {
    let componentSettingsMetadata = A();
    componentSettingsMetadata.pushObject({
      settingName: 'icon',
      settingType: 'enumeration',
      settingDefaultValue: 'undefined',
      settingAvailableItems:
        [
          'search icon',
          'bordered setting icon',
          'inverted teal paw icon',
          'big green tree icon',
          'circular small record icon',
          'olive list layout icon'
        ],
      bindedControllerPropertieName: 'currentItem.icon'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'iconAlignment',
      settingType: 'enumeration',
      settingDefaultValue: 'undefined',
      settingAvailableItems: ['left', 'right'],
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
      settingType: 'enumeration',
      settingDefaultValue: 'undefined',
      settingAvailableItems: ['left', 'right'],
      bindedControllerPropertieName: 'currentItem.itemsAlignment'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'collapseMenuOnItemClick',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'collapseMenuOnItemClick'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'isVertical',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'isVertical'
    });

    return componentSettingsMetadata;
  })
});
