import $ from 'jquery';
import { inject as service } from '@ember/service';
import FlexberryBaseComponent from 'ember-flexberry/components/flexberry-base-component';
import Component from '@ember/component';
import EmberObject, { get, set, setProperties, computed, observer } from '@ember/object';

export default Component.extend({
  menu: null,
  editformsSet: null,

  store: service('store'),

  init(...args) {
    this._super(...args);

    this.items = this.items || [];

    this.editformsSet = this.editformsSet || [];
    this.editformsSet = [
      {
        razdelName: 'Razdel name 1',
        children: [{
          gruppaPolejVvodaName: 'Gruppa polej vvoda 1.1',
          modelName: 'ember-flexberry-dummy-suggestion'
        },
        {
          gruppaPolejVvodaName: 'Gruppa polej vvoda 1.2',
          modelName: 'ember-flexberry-dummy-suggestion'
        }]
      },
      {
        razdelName: 'Razdel name 2',
        children: [{
          gruppaPolejVvodaName: 'Gruppa polej vvoda 2.1',
          modelName: 'ember-flexberry-dummy-suggestion'
        },
        {
          gruppaPolejVvodaName: 'Gruppa polej vvoda 2.2',
          modelName: 'ember-flexberry-dummy-suggestion'
        },
        {
          gruppaPolejVvodaName: 'Gruppa polej vvoda 2.3',
          modelName: 'ember-flexberry-dummy-suggestion'
        },
        {
          gruppaPolejVvodaName: 'Gruppa polej vvoda 2.4',
          modelName: 'ember-flexberry-dummy-suggestion'
        }]
      }
    ];


    this.menu = this.menu || [];
    this.menu = [
      {
        razdelName: 'Razdel name 1',
        children: [{
          gruppaPolejVvodaName: 'Gruppa polej vvoda 1.1',
          active: true
        },
        {
          gruppaPolejVvodaName: 'Gruppa polej vvoda 1.2',
          active: false
        }]
      },
      {
        razdelName: 'Razdel name 2',
        children: [{
          gruppaPolejVvodaName: 'Gruppa polej vvoda 2.1',
          active: false
        },
        {
          gruppaPolejVvodaName: 'Gruppa polej vvoda 2.2',
          active: false
        },
        {
          gruppaPolejVvodaName: 'Gruppa polej vvoda 2.3',
          active: false
        },
        {
          gruppaPolejVvodaName: 'Gruppa polej vvoda 2.4',
          active: false
        }]
      }
    ];

    this.set('prevTab', this.menu[0]);
    if (this.menu.length > 1) {
      this.razdelNumeration = true;
    } else {
      this.razdelNumeration = false;
    }
  },

  /**
   * Активная форма
   * @type {String}
   */
  activeForm: undefined,

  /**
   * Contains name of previous data-tab
   * @property prevTab
   */
  prevTab: undefined,

  /**
   * Использовать в вёрстке ui grid.
   * @type {Boolean}
   * @default true
   */
  uiGrid: true,

  didInsertElement() {
    this.configTabMenu();
  },

  configTabMenu() {
    $('.menu .item').tab();

    let activeTab = this.get('activeTab');

    if (activeTab && this.get('items').find(item => item.tabName === activeTab)) {
      $('.menu .item').tab('change tab', activeTab);
    }
  },

  actions: {
    showAllForms(item) {
      this.items.pushObject(item);
    },

    change(currentTab, event) {
      let prevTab = this.get('prevTab');
      let changed = false;

      let form = null;
      this.editformsSet.forEach(razdel => {
        razdel.children.forEach(child => {
          if (child.gruppaPolejVvodaName == currentTab.gruppaPolejVvodaName) {
            form = child;
          }
        });
      });

      if (form) {
        this.set('activeForm', form);
        set(currentTab, 'active', true);
        if (prevTab !== currentTab) {
          prevTab.active = false;
          this.set('prevTab', currentTab);
          changed = true;
        }
      }
    }
  }
});