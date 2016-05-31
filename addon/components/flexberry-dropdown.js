/**
  @module ember-flexberry
*/
import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
  @class FlexberryDropDown
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({

  /**
    Overload wrapper tag name for disabling wrapper.
  */
  tagName: '',

  /**
    Default classes for component wrapper.
  */
  class: '',

  /**
    Path to component's settings in application configuration (JSON from ./config/environment.js).

    @property appConfigSettingsPath
    @type String
    @default 'APP.components.flexberryBaseComponent'
  */
  appConfigSettingsPath: 'APP.components.flexberryDropdown',

  /**
    Dropdown type from semantic ui ('fluid', 'compact', ...).

    @property type
    @type String
    @default 'fluid'
  */
  type: 'fluid',

  /**
    Default text (will be displayed if there is no selected item).

    @property defaultText
    @type String
  */
  defaultText: undefined,

  /**
    Selected item.

    @property value
    @type String
    @default null
  */
  value: null,

  /**
    Available items.

    @property items
    @type Array
    @default []
  */
  items: [],

  /**
    DOM-element representing semantic ui-dropdown component.

    @property dropdownDomElement
    @type Object
    @default null
  */
  dropdownDomElement: null,

  /**
    Flag: indicates whether 'willDestroyElement' hook has been already called.

    @property destroyHasBeenCalled
    @type Boolean
    @default false
  */
  destroyHasBeenCalled: false,

  /**
    Flag: indicates whether to show default dropdown text or not.

    @property showDefaultText
    @type Boolean
    @default false
    @readOnly
  */
  showDefaultText: Ember.computed('defaultText', 'value', function() {
    return Ember.isNone(this.get('value')) && !Ember.isNone(this.get('defaultText'));
  }),

  /**
    Selected text (if some item is selected).

    @property text
    @type String
    @default ''
    @readOnly
  */
  text: Ember.computed('value', function() {
    let value = this.get('value');
    return !Ember.isNone(value) ? value : '';
  }),

  /**
    Handles changes in available items & selected item (including changes on component initialization).
  */
  itemsOrValueDidChange: Ember.on('init', Ember.observer('items.[]', 'value', function() {
    let destroyHasBeenCalled = this.get('destroyHasBeenCalled');
    if (destroyHasBeenCalled) {
      return;
    }

    let items = this.get('items');
    if (!Ember.isArray(items)) {
      Ember.Logger.error(`Wrong type of flexberry-dropdown \`items\` propery: actual type is ${Ember.typeOf(items)}, but array is expected.`);
    }

    let value = this.get('value') || null;
    if (!Ember.isNone(value) && items.indexOf(value) < 0) {
      Ember.Logger.error(`Wrong value of flexberry-dropdown \`value\` propery: \`${value}\`. Allowed values are: [\`${items.join(`\`, \``)}\`].`);
    }

    let dropdownDomElement = this.get('dropdownDomElement');
    if (Ember.isNone(dropdownDomElement)) {
      return;
    }

    // If binded value has been changed somewhere out of this component, semanic ui-dropdown logic
    // will not be called automatically, so we need to call some methods manually,
    // to be sure that sates of semanic ui-dropdown plugin & related DOM-elements
    // are fully corresponds to currently selected item.
    if (Ember.isNone(value)) {
      dropdownDomElement.dropdown('clear');
    } else {
      dropdownDomElement.dropdown('set selected', value);
    }
  })),

  actions: {
    /**
      This callback is called after a dropdown value changes.
      For more information see [semantic-ui](http://semantic-ui.com/modules/dropdown.html#/settings).

      @method actions.onChange
      @public
    */
    onChange(component, id, newValue) {
      let oldValue = this.get('value') || null;
      newValue = newValue || null;

      if (newValue === oldValue) {
        return;
      }

      // Semantic ui-dropdown component has only one way binding,
      // so we have to set selected value manually.
      this.set('value', newValue);
      this.sendAction('onChange', newValue);
    },

    /**
      This callback is called before a dropdown is shown/hidden.
      If false is returned, dropdown will not be shown/hidden.

      Its is necessary in situations when route's template changes on model change.
      Example:
      ```handlebars
      ...
      {{#if model.enum}}
        <span>{{model.enum}}<span>
      {{else}}
        {{flexberry-dropdown items=enumAvailableValues value=model.enum}}
      {{/if}}
      ...
      ```
      In such situation, without this callback, semantic-ui will throw an error:
      'Transition: Element is no longer attached to DOM. Unable to animate'.

      @method actions.onShowHide
      @public
    */
    onShowHide() {
      return !this.get('destroyHasBeenCalled');
    }
  },

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](http://emberjs.com/api/classes/Ember.View.html#method_init) method of [Ember.View](http://emberjs.com/api/classes/Ember.View.html).
  */
  init() {
    this._super(...arguments);

    // Initialize properties which defaults could be defined in application configuration.
    this.initProperty({ propertyName: 'defaultText', defaultValue: null });
  },

  /**
    Called when the element of the view has been inserted into the DOM or after the view was re-rendered.
    For more information see [didInsertElement](http://emberjs.com/api/classes/Ember.Component.html#event_didInsertElement) event of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  didInsertElement() {
    this._super(...arguments);

    // We need to select and remember DOM-element representing ui-dropdown component,
    // but we can't just call to this.$('.flexberry-dropdown'), because ember will throw an error
    // "You cannot access this.$() on a component with tagName: ''.".
    // So we have to search our element in 'childViews' collection.
    let dropdownView = this.get('childViews').find(view => {
      let tagName = view.get('tagName');
      if (Ember.typeOf(tagName) === 'string') {
        tagName = tagName.trim();
      }

      return tagName !== '' && view.$().hasClass('flexberry-dropdown');
    });

    let dropdownDomElement = !Ember.isNone(dropdownView) ? dropdownView.$() : null;
    this.set('dropdownDomElement', dropdownDomElement);
  },

  /**
    Called when the element of the view is going to be destroyed.
    For more information see [willDestroyElement](http://emberjs.com/api/classes/Ember.Component.html#event_willDestroyElement) event of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  willDestroyElement() {
    this.set('destroyHasBeenCalled', true);

    this._super(...arguments);
  }
});
