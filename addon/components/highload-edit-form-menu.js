import { A, isArray } from '@ember/array';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { get, set } from '@ember/object';

/**
  Highload edit menu component.

  @example
    templates/my-form.hbs
    ```handlebars
    {{highload-edit-form-menu
      menu=(array
        (hash razdelName="Razdel1" children=(array
          (hash selector="gruppa1.1" gruppaPolejVvodaName="gruppa1.1" active=true showAsterisk=true)
        ))
      )
    }}

    <div data-tab="gruppa1.1" class="ui tab gruppaPolejVvoda active">
    ...
    </div>

    {{flexberry-button
      class="basic tabsNavigation"
      iconClass="icon arrow down"
      caption="Далее"
      readonly=readonly
      click=(action "showNextGroupForms")
    }}

    {{flexberry-button
      class="basic tabsNavigation"
      iconClass="icon arrow up"
      caption="Назад"
      readonly=readonly
      click=(action "showPrevGroupForms")
    }}
    ```

    controllers/my-form.js
    ```javascript
    actions: {
      showNextGroupForms() {
        this.get('objectlistviewEventsService').showNextGroupFormsTrigger();
      },

      showPrevGroupForms() {
        this.get('objectlistviewEventsService').showPrevGroupFormsTrigger();
      }
    }
    ```

  @class FlexberryCheckboxComponent
  @extends FlexberryBaseComponent
*/

export default Component.extend({
  /**
    Menu used in template.
    @property menu
  */
  menu: null,

  /**
    Menu used in component controller.
    @property _menu
  */
  _menu: null,

  store: service('store'),

  /**
    Service that triggers objectlistview events.
    @property objectlistviewEventsService
    @type Service
  */
    objectlistviewEventsService: service('objectlistview-events'),

  init(...args) {
    this._super(...args);

    let menu = this.get('menu');
    if (!isArray(menu)) {
      menu = A(menu)
    }

    if (this.menu.length > 1) {
      this.razdelNumeration = true;
    } else {
      this.razdelNumeration = false;
    }

    let _menu = [];
    menu.forEach((razdel) => {
      razdel.children.forEach((item) => {
        _menu.push(item);
      });
    });

    this.set('_menu', _menu);

    let active = false;
    _menu.forEach((item, key) => {
      let itemIsActive = get(item, 'active');
      if (itemIsActive && !active) {
        active = true;

        this.set('prevTab', item);
        this.set('_currentTab', item);
        if (key + 1 < _menu.length) {
          this.set('nextTab', _menu[key + 1]);
        } else {
          this.set('nextTab', _menu[key]);
        }
      } else {
        set(item, 'active', false);
      }
    });

    this.set('prevTab', this._menu[0]);
  },

  prevTab: undefined,

  nextTab: undefined,

  _currentTab: undefined,

  showAllFormsButton: false,

  /**
   * Использовать в вёрстке ui grid.
   * @type {Boolean}
   * @default true
   */
  uiGrid: true,

  didInsertElement() {
    this.get('objectlistviewEventsService').on('showNextGroupForms', this, this.showNextGroupForms);
    this.get('objectlistviewEventsService').on('showPrevGroupForms', this, this.showPrevGroupForms);
  },

  didRender() {
    let _this = this;
    document.getElementsByClassName('full height')[0].addEventListener('scroll', function() {
      document.getElementsByClassName('full height')[0].scrollTop;
      _this.setActiveTab();
    });
  },

  setActiveTab(currentTab, scrollToActiveTab) {
    if (!currentTab) {
      currentTab = this.get('_currentTab');
    }

    let groups = $('.gruppaPolejVvoda');
    groups = Object.values(groups);
    let highestTabY = groups[0].getBoundingClientRect().top;
    let highestTab = groups[0];

    if (!this.showAllFormsButton) {
      groups.forEach((child, key) => {
        if (child.dataset) {
          if (currentTab.selector == child.dataset.tab) {
            $('.gruppaPolejVvoda')[key].classList.add('active');

          } else {
            $('.gruppaPolejVvoda')[key].classList.remove('active');
            $('.gruppaPolejVvoda')[key].classList.remove('highlighted');
          }
        }
      });
    } else {
      let tabContentFocus;
      groups.forEach((child, key) => {
        if (child.dataset) {
          if (currentTab.selector == child.dataset.tab) {
            tabContentFocus = child;
          }
          $('.gruppaPolejVvoda')[key].classList.add('active');
          var tabTop = $('.gruppaPolejVvoda')[key].getBoundingClientRect().top;
          if (Math.abs(tabTop) < Math.abs(highestTabY)) {
            highestTabY = Math.abs(tabTop);
            highestTab = $('.gruppaPolejVvoda')[key];
          }
        }
      });

      if (scrollToActiveTab) {
        tabContentFocus.scrollIntoView(false);
        highestTab = tabContentFocus;
      } else {
        let _menu = this.get('_menu');
        _menu.forEach(child => {
          if (child.gruppaPolejVvodaName == highestTab.dataset.tab) {
            set(child, 'active', true);
          } else {
            set(child, 'active', false);
          }
        });
        this.set('_menu', _menu);
      }
      highestTab.classList.add('highlighted');
    }
  },

  setCurrentMenuItem(currentTab) {
    this.set('_currentTab', currentTab);
    set(currentTab, 'active', true);
    let _menu = this.get('_menu');
    _menu.forEach((child, key) => {
      if (child.gruppaPolejVvodaName == currentTab.gruppaPolejVvodaName) {
        if (key + 1 < _menu.length) {
          this.set('nextTab', _menu[key + 1]);
        } else {
          this.set('nextTab', _menu[key]);
        }

        if (key - 1 >= 0) {
          this.set('prevTab', _menu[key - 1]);
        } else {
          this.set('prevTab', _menu[key]);
        }

        set(child, 'active', true);
      } else {
        set(child, 'active', false);
      }
    });
    this.set('_menu', _menu);
    this.setActiveTab(currentTab, true);
  },

  showNextGroupForms() {
    this.setCurrentMenuItem(this.get('nextTab'));
  },

  showPrevGroupForms() {
    this.setCurrentMenuItem(this.get('prevTab'));
  },

  actions: {
    showAllForms() {
      let isShowAll = !this.get('showAllFormsButton');
      this.set('showAllFormsButton', isShowAll);
      this.setActiveTab(this.get('_currentTab'));
      if (isShowAll) {
        $('.showAllFormsButton')[0].classList.add('active');
        $('.tabsNavigation').css("visibility", "hidden");
      } else {
        $('.showAllFormsButton')[0].classList.remove('active');
        $('.tabsNavigation').css("visibility", "visible");
      }
    },

    change(currentTab) {
      this.setCurrentMenuItem(currentTab);
    }
  }
});