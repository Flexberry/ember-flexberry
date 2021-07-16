import Ember from 'ember';

/**
  Component's CSS-classes names.
  JSON-object containing string constants with CSS-classes names related to component's .hbs markup elements.

  @property {Object} flexberryClassNames
  @property {String} flexberryClassNames.prefix Component's CSS-class names prefix ('flexberry-tab-bar').
  @property {String} flexberryClassNames.wrapper Component's wrapping <div> CSS-class name ('flexberry-tab-bar').
  @property {String} flexberryClassNames.tab Component's inner <input type="checkbox"> CSS-class name ('flexberry-tab-bar-tab').
  @property {String} flexberryClassNames.tabIcon Component's inner <label> CSS-class name ('flexberry-tab-bar-tab-icon').
  @readonly
  @static

  @for FlexberryTabBarComponent
*/
const flexberryClassNamesPrefix = 'flexberry-tab-bar';
const flexberryClassNames = {
  prefix: flexberryClassNamesPrefix,
  wrapper: flexberryClassNamesPrefix,
  tab: flexberryClassNamesPrefix + '-tab',
  tabIcon: flexberryClassNamesPrefix + '-tab-icon'
};

/**
 * FlexberryTabBarComponent
 * Component to display semantic ui tabs
 * @extends Ember.Component
 */
export default Ember.Component.extend({
  classNames: ['ui', 'tabular', 'menu', flexberryClassNamesPrefix],

  /**
    Reference to component's CSS-classes names.
    Must be also a component's instance property to be available from component's .hbs template.
  */
  flexberryClassNames,

  /**
   * Contains items to be displayed in tab bar
   * @property items
   * @type {Array}
   * @default null
   * @example items: [{selector: 'tab1', caption: 'Tab one', active: true }, {selector: 'tab2', caption: 'Tab two'}]
   * @desc the first item with active=true will be set as active, others ignored
   */
  items: null,

  /**
   * Contains items that will be displayed in tab bar
   * @property tabs
   * @type {Array}
   */
  tabs: Ember.computed('items.[]', 'items.@each.active', function () {
    let active = false;
    let items = this.get('items') || Ember.A();
    let result = Ember.A();

    items.forEach((item) => {
      let itemIsActive = Ember.get(item, 'active');
      if (itemIsActive) {
        if (!active) {
          active = true;

          let itemClass = Ember.get(item, 'class') || '';
          let regEx = /\sactive(\s|$)/;
          if (!regEx.test(itemClass)) {
            itemClass += ' active';
          }

          Ember.set(item, 'class', itemClass);
          this.set('prevTab', item.selector);
          Ember.$.tab('change tab', item.selector);
        }
      }

      Ember.set(item, 'active', false);

      if (Ember.get(item, 'iconClass')) {
        Ember.set(item, '_hasIcon', true);
      } else {
        Ember.set(item, '_hasIcon', false);
      }

      result.pushObject(item);
    });

    return result;
  }),

  /**
   * Contains name of previous data-tab
   * @property prevTab
   */
  prevTab: undefined,

  /**
   * String with dropdown selector for working with jQuery
   * @property dropdownDomString
   */
  navDropdownDomString: '.ui.compact.pointing.top.right.dropdown.link.item',

  /**
   * Checks if sum of tabs width is greater than tab container.
   * If true - dropdown becomes visible.
   * If false - dropdown dissapears.
   * @method setDropdownVisibility
   */
  setNavDropdownVisibility: function () {
    const tabContainer = document.querySelector(
      '.ui.tabular.menu.flexberry-tab-bar'
    );
    const tab = document.querySelector('.flexberry-tab-bar-tab.tab.item');

    if (tab.clientWidth * this.items.length > tabContainer.clientWidth) {
      this.$(this.navDropdownDomString).show();
    } else {
      this.$(this.navDropdownDomString).hide();
    }
  },

  /**
   * Enables scroll wheel for dragscroll.
   * Based on code by @miorel + @pieterv of Facebook.
	 * github.com/facebook/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js
   * @method normalizeWheel
   */
  normalizeWheel: function (event) {
    var pixelStep = 10;
    var lineHeight = 40;
    var pageHeight = 800;
    var sX = 0;
    var sY = 0;
    var pX = 0;
    var pY = 0;

    // Legacy.
    if ('detail' in event) {
      sY = event.detail;
    } else if ('wheelDelta' in event) {
      sY = event.wheelDelta / -120;
    } else if ('wheelDeltaY' in event) {
      sY = event.wheelDeltaY / -120;
    }

    if ('wheelDeltaX' in event) {
      sX = event.wheelDeltaX / -120;
    }

    // Side scrolling on FF with DOMMouseScroll.
    if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
      sX = sY;
      sY = 0;
    }

    // Calculate.
    pX = sX * pixelStep;
    pY = sY * pixelStep;

    if ('deltaY' in event) {
      pY = event.deltaY;
    }

    if ('deltaX' in event) {
      pX = event.deltaX;
    }

    if ((pX || pY) && event.deltaMode) {
      if (event.deltaMode === 1) {
        pX *= lineHeight;
        pY *= lineHeight;
      } else {
        pX *= pageHeight;
        pY *= pageHeight;
      }
    }

    // Fallback if spin cannot be determined.
    if (pX && !sX) {
      sX = pX < 1 ? -1 : 1;
    }

    if (pY && !sY) {
      sY = pY < 1 ? -1 : 1;
    }

    // Return.
    return {
      spinX: sX,
      spinY: sY,
      pixelX: pX,
      pixelY: pY,
    };
  },

  actions: {
    /**
        Handles tab 'click' action.
        @method actions.change
        @param {String} currentTab describes currently clicked tab
        @param {Object} event [jQuery event object](http://api.jquery.com/category/events/event-object/)
    */
    change(currentTab, event) {
      let prevTab = this.get('prevTab');
      let changed = false;

      if (prevTab !== currentTab) {
        this.set('prevTab', currentTab);
        changed = true;
      }

      // if data-tab stays the same - disable it
      if (!changed) {
        this.set('prevTab', undefined);
        this.$('.item.active').removeClass('active');
      }

      //if data-tab changed but there was not prev one
      else if (changed && !prevTab) {
        changed = false;
      }

      let e = {
        tabName: currentTab,
        prevTab: prevTab,
        changed: changed,
        originalEvent: event,
      };

      this.sendAction('change', e);
    },
  },

  /**
      Initializes component's DOM-related properties.
    */
  didInsertElement() {
    this._super(...arguments);

    // initialize semantic ui tabs
    this.$('.item').tab();

    // Dragscroll inplementation for tabs
    const slider = document.querySelector('.dragscroll');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) {
        return false;
      } else {
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
      }
    });

    slider.addEventListener('wheel', (e) => {

      // Prevent default.
      e.preventDefault();
      e.stopPropagation();

      // Stop link scroll.
      this.$('body').stop();

      // Calculate delta, direction.
      var n = this.normalizeWheel(e);
      var x = n.pixelX !== 0 ? n.pixelX : n.pixelY;
      var delta = Math.min(Math.abs(x), 150);
      var direction = x > 0 ? 1 : -1;

      // Scroll page.
      this.$('.dragscroll').scrollLeft(this.$('.dragscroll').scrollLeft() + delta * direction);
    });

    // Dropdown visibility implementation
    window.addEventListener('resize', () => {
      this.setNavDropdownVisibility();
    });

    this.setNavDropdownVisibility();
  },

  /**
    Handles DOM-related component's properties after each render.
  */
  didRender() {
    this._super(...arguments);

    // Initialize possibly added new tabs.
    this.$('.item').tab();

    // Inititalize semantic ui dropdown (hidden by default)
    this.$(this.navDropdownDomString).dropdown({
      transition: 'drop',
      action: 'activate',
      onChange(newTab) {
        this.$.tab('change tab', newTab);
      },
    });
  },

  /**
    Deinitializes component's DOM-related properties.
  */
  willDestroyElement() {
    this._super(...arguments);

    // destroy semantic ui tabs
    this.$('.item').tab('destroy');
  },

  /**
    Component's action invoking when tab was clicked and it's 'active' state changed.
    @method sendingActions.change
    @param {Object} e Action's event object.
    @param {String} e.tabName Name of clicked tab
    @param {Boolean} e.changed Flag: whether tab was changed. True if yes, False if not, Null if there is no active tab
    @param {Object} e.originalEvent [jQuery event object](http://api.jquery.com/category/events/event-object/)
    which describes inner input's 'change' event.
  */
});
