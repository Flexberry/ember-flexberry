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
    {{#highload-edit-form-menu
      menu=(array
        (hash razdelName="Razdel1" children=(array
          (hash selector="gruppa1.1" gruppaPolejVvodaName="gruppa1.1" active=true showAsterisk=true)
        ))
      )
    }}

    <div data-tab="gruppa1.1" class="ui tab gruppaPolejVvoda active">
    ...
    </div>
    {{/highload-edit-form-menu}}
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

    let menu = get(this, 'menu');
    if (!isArray(menu)) {
      menu = A(menu)
    }
    menu[0].active = true;

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

    set(this, '_menu', _menu);

    let active = false;
    _menu.forEach((item, key) => {
      let itemIsActive = get(item, 'active');
      if (itemIsActive && !active) {
        active = true;

        set(this, 'prevTab', item);
        set(this, '_currentTab', item);
        if (key + 1 < _menu.length) {
          set(this, 'nextTab', _menu[key + 1]);
        } else {
          set(this, 'nextTab', _menu[key]);
        }
      } else {
        set(item, 'active', false);
      }
    });

    set(this, 'prevTab', this._menu[0]);
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

  didRender() {
    let _this = this;
    document.getElementsByClassName('full height')[0].addEventListener('wheel', function() {
      document.getElementsByClassName('full height')[0].scrollTop;
      _this.setActiveTab();
    });
  },

  setActiveTab(currentTab, scrollToActiveTab) {
    if (!currentTab) {
      currentTab = get(this, '_currentTab');
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
        let _menu = get(this, '_menu');
        _menu.forEach(child => {
          if (child.gruppaPolejVvodaName == highestTab.dataset.tab) {
            set(child, 'active', true);
          } else {
            set(child, 'active', false);
          }
        });
        set(this, '_menu', _menu);
      }
      highestTab.classList.add('highlighted');
      this.setMenuForTemplate(highestTab.dataset.tab);
    }
  },

  setMenuForTemplate(tabName) {
    // Меню, используемое в шаблоне
    let menu = get(this, 'menu');
    menu.forEach((razdel) => {
      let activeRazdel = false;
      razdel.children.forEach((item) => {
        if (item.gruppaPolejVvodaName == tabName) {
          activeRazdel = true;
        }
      });
      if (activeRazdel) {
        set(razdel, 'active', true);
      } else {
        set(razdel, 'active', false);
      }
    });
    set(this, 'menu', menu);
  },

  setCurrentMenuItem(currentTab) {
    set(this, '_currentTab', currentTab);
    set(currentTab, 'active', true);
    this.setMenuForTemplate(currentTab.gruppaPolejVvodaName);

    // Меню для контроллера
    let _menu = get(this, '_menu');
    _menu.forEach((child, key) => {
      if (child.gruppaPolejVvodaName == currentTab.gruppaPolejVvodaName) {
        if (key + 1 < _menu.length) {
          set(this, 'nextTab', _menu[key + 1]);
        } else {
          set(this, 'nextTab', _menu[key]);
        }

        if (key - 1 >= 0) {
          set(this, 'prevTab', _menu[key - 1]);
        } else {
          set(this, 'prevTab', _menu[key]);
        }

        set(child, 'active', true);
      } else {
        set(child, 'active', false);
      }
    });
    set(this, '_menu', _menu);
    this.setActiveTab(currentTab, true);
  },

  actions: {
    showAllForms() {
      let isShowAll = !get(this, 'showAllFormsButton');
      set(this, 'showAllFormsButton', isShowAll);
      this.setActiveTab(get(this, '_currentTab'));
      if (isShowAll) {
        $('.showAllFormsButton')[0].classList.add('active');
        $('.tabsNavigation').css("visibility", "hidden");
      } else {
        $('.showAllFormsButton')[0].classList.remove('active');
        $('.tabsNavigation').css("visibility", "visible");
      }
    },

    showNextGroupForms() {
      this.setCurrentMenuItem(get(this, 'nextTab'));
    },

    showPrevGroupForms() {
      this.setCurrentMenuItem(get(this, 'prevTab'));
    },

    change(currentTab) {
      this.setCurrentMenuItem(currentTab);
    }
  }
});