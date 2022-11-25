import { A, isArray } from '@ember/array';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { get, set, trySet } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

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

    routes/my-form.js
    ```javascript
    routeHistory: service(),

    afterModel(model, transition) {
      this._super(...arguments);

      const id = get(model, 'id') || get(model, 'base.id') || null;
      const context = id ? [id] : [];
      const { intent } = transition;
      const routeName = intent.name
        ? intent.name
        : transition.targetName;

      let historyLength = get(this, 'routeHistory._routeHistory').length;
      if ((historyLength > 0) && (get(this, 'routeHistory._routeHistory')[historyLength - 1].contexts[0]  != context[0])
        || historyLength == 0) {
        this.get('routeHistory').pushRoute(routeName, context, intent.queryParams);
      }
    }
    ```

  @class FlexberryCheckboxComponent
  @extends FlexberryBaseComponent
*/

export default Component.extend({

  routeHistory: service(),

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

  showAllFormsButton: false,

  store: service('store'),
  classNames: ['highloaded-menu-container'],
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

    this.razdelNumeration = this.menu.length > 1;

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
    this._afterEditForm();
  },

  prevTab: undefined,

  nextTab: undefined,

  _currentTab: undefined,

  /**
   * Использовать в вёрстке ui grid.
   * @type {Boolean}
   * @default true
   */
  uiGrid: true,

  /**
   * Класс для отслеживания прокрутки страницы.
   * @type {String}
   * @default 'full height'
   */
  scrollClass: 'full height',

  wheelHandler: undefined,

  didInsertElement() {
    this._super(...arguments);
    let _this = this;
    const scrollClass = get(this, 'scrollClass');

    set(this, 'wheelHandler', this.wheelEvent.bind(_this));
    document.getElementsByClassName(scrollClass)[0].addEventListener('wheel', this.wheelHandler);
  },

  wheelEvent() {
    if (this.showAllFormsButton) {
      this.setActiveTab();
    }
  },

  _afterEditForm() {
    scheduleOnce('afterRender', this, function() {
      let historyLength = get(this, 'routeHistory')._routeHistory.length;
      let lastRoute = this.routeHistory._routeHistory[historyLength - 1];
      if (lastRoute && lastRoute.queryParams) {
        try {
          lastRoute.queryParams.forEach((item) => {
            if (item.active) {
              this.setCurrentMenuItem(item);
              return;
            }
          });
        }
        catch (error) {
          return;
        }
      }
    });
  },

  setActiveTab(currentTab, scrollToActiveTab) {
    if (!currentTab) {
      currentTab = get(this, '_currentTab');
    }

    let groups = $('.gruppaPolejVvoda');
    groups = Object.values(groups);
    let highestTabY = groups[0] ? groups[0].getBoundingClientRect().top : undefined;
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
          let tabTop = $('.gruppaPolejVvoda')[key].getBoundingClientRect().top;
          if (Math.abs(tabTop) < Math.abs(highestTabY)) {
            highestTabY = Math.abs(tabTop);
            highestTab = $('.gruppaPolejVvoda')[key];
          }
        }
      });

      if (this.isDestroyed) {
        return;
      }
      if (scrollToActiveTab) {
        tabContentFocus.scrollIntoView(false);
        highestTab = tabContentFocus;
      } else {
        let _menu = get(this, '_menu');
        _menu.forEach(child => {
          set(child, 'active', child.selector == highestTab.dataset? highestTab.dataset.tab : undefined);
        });
        trySet(this, '_menu', _menu);
      }
      highestTab.classList.add('highlighted');
      this.setMenuForTemplate(highestTab.dataset? highestTab.dataset.tab : undefined);
    }
  },

  setMenuForTemplate(tabName) {
    // Меню, используемое в шаблоне
    let menu = get(this, 'menu');
    menu.forEach((razdel) => {
      let activeRazdel = false;
      razdel.children.forEach((item) => {
        if (String(item.selector) == String(tabName)) {
          activeRazdel = true;
          set(item, 'active', true);
        } else {
          set(item, 'active', false);
        }
      });
      set(razdel, 'active', activeRazdel);
    });
    set(this, 'menu', menu);
  },

  setCurrentMenuItem(currentTab) {
    set(this, '_currentTab', currentTab);
    set(currentTab, 'active', true);
    this.setMenuForTemplate(currentTab.selector);

    // Меню для контроллера
    let _menu = get(this, '_menu');
    _menu.forEach((child, key) => {
      if (child.selector == currentTab.selector) {
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
    if (this.isDestroyed) {
      return;
    }
    trySet(this, '_menu', _menu);
    this.setActiveTab(currentTab, true);
  },

  didDestroyElement() {
    this._super(...arguments);

    let historyLength = get(this, 'routeHistory._routeHistory.length');
    let lastRoute = get(this, 'routeHistory._routeHistory')[historyLength - 1];
    let _menu = get(this, '_menu');
    if (lastRoute) {
      get(this, 'routeHistory').pushRoute(lastRoute.routeName, lastRoute.contexts, _menu);
    }
    const scrollClass = get(this, 'scrollClass');
    document.getElementsByClassName(scrollClass)[0].removeEventListener('wheel', this.wheelHandler);
    set(this, 'wheelHandler', undefined);
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
