import Component from '@ember/component';
import { get, set } from '@ember/object';
import { A, isArray } from '@ember/array';

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
 * @extends Component
 */
export default Component.extend({
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
   * Contains name of previous data-tab
   * @property prevTab
   */
  prevTab: undefined,

  actions: {
    /**
        Handles tab 'click' action.
        @method actions.change
        @param {String} currentTab describes currently clicked tab
        @param {Object} event [jQuery event object](http://api.jquery.com/category/events/event-object/)
    */
    change(currentTab, event) {
      let prevTab = this.get('prevTab');
      let tabName = currentTab.selector;
      let changed = false;

      if (prevTab !== tabName) {
        this.set('prevTab', tabName);
        changed = true;
      }

      // if data-tab stays the same - disable it
      if (!changed) {
        this.set('prevTab', undefined);
        set(currentTab, 'active', false);
      }

      //if data-tab changed but there was not prev one
      else if (changed && !prevTab) {
        changed = false;
      }

      let e = {
        tabName: tabName,
        prevTab: prevTab,
        changed: changed,
        originalEvent: event
      };

      this.get('change')(e);
    }
  },

  init() {
    this._super(...arguments);

    let items = this.get('items');
    if (!isArray(items)) {
      items = A(items)
      this.set('items', items);
    }

    let active = false;
    items.forEach((item) => {
      let itemIsActive = get(item, 'active');
      if (itemIsActive && !active) {
        active = true;

        this.set('prevTab', item.selector);
        this.$().tab('change tab', item.selector);
      } else {
        set(item, 'active', false);
      }
    }, this);
  },

  /**
      Initializes component's DOM-related properties.
    */
  didInsertElement() {
    this._super(...arguments);

    // initialize semantic ui tabs
    this.$('.item').tab();
  },

  /**
    Handles DOM-related component's properties after each render.
  */
  didRender() {
    this._super(...arguments);

    // Initialize possibly added new tabs.
    this.$('.item').tab();
  },

  /**
    Deinitializes component's DOM-related properties.
  */
  willDestroyElement() {
    this._super(...arguments);

    // destroy semantic ui tabs
    this.$('.item').tab('destroy');
  }

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
