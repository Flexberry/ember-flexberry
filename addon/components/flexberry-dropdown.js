/**
 * @module ember-flexberry
 */
import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
 * @class FlexberryDropDown
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  actions: {
    valueChange: function(component, id, newValue) {
      var oldValue = this.get('value') || null;
      newValue = newValue || null;

      if (newValue === oldValue) {
        return;
      }

      // Semantic ui-dropdown component has only one way binding,
      // so we have to set selected value manually.
      this.set('value', newValue);
    }
  },

  /**
   * Overload wrapper tag name for disabling wrapper.
   *
   * @property tagName
   * @type String
   * @default ''
   * @readOnly
   */
  tagName: '',

  /**
   * Path to component's settings in application configuration (JSON from ./config/environment.js).
   *
   * @property appConfigSettingsPath
   * @type String
   * @default 'APP.components.flexberryBaseComponent'
   */
  appConfigSettingsPath: 'APP.components.flexberryDropdown',

  /**
   * Dropdown type from semantic ui ('fluid', 'compact', ...).
   *
   * @property type
   * @type String
   * @default 'fluid'
   */
  type: 'fluid',

  /**
   * Default text (will be displayed if there is no selected item).
   *
   * @property defaultText
   * @type String
   * @default null
   */
  defaultText: undefined,

  /**
   * Selected item.
   *
   * @property value
   * @type String
   * @default null
   */
  value: null,

  /**
   * Available items.
   *
   * @property items
   * @type Array
   * @default []
   */
  items: [],

  /**
   * DOM-element representing semantic ui-dropdown component.
   *
   * @property dropdownDomElement
   * @type Object
   * @default null
   */
  dropdownDomElement: null,

  /**
   * Flag: indicates whether to show default dropdown text or not.
   *
   * @property showDefaultText
   * @type Boolean
   * @default false
   * @readonly
   */
  showDefaultText: Ember.computed('defaultText', 'value', function() {
    return Ember.isNone(this.get('value')) && !Ember.isNone(this.get('defaultText'));
  }),

  /**
   * Selected text (if some item is selected).
   *
   * @property text
   * @type String
   * @default ''
   * @readonly
   */
  text: Ember.computed('value', function() {
    var value = this.get('value');
    return !Ember.isNone(value) ? value : '';
  }),

  /**
   * Handles changes in available items & selected item (including changes on component initialization).
   */
  itemsOrValueDidChange: Ember.on('init', Ember.observer('items.[]', 'value', function() {
    var items = this.get('items');
    if (!Ember.isArray(items)) {
      throw new Error(`Wrong type of flexberry-dropdown \`items\` propery: actual type is ${Ember.typeOf(items)}, but array is expected.`);
    }

    var value = this.get('value') || null;
    if (!Ember.isNone(value) && items.indexOf(value) < 0) {
      throw new Error(`Wrong value of flexberry-dropdown \`value\` propery: \`items\` array does not contain \`${value}\` value.`);
    }

    var dropdownDomElement = this.get('dropdownDomElement');
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

  /**
   * Initializes component.
   */
  init: function() {
    this._super(...arguments);

    // Initialize properties which defaults could be defined in application configuration.
    this.initProperty({ propertyName: 'defaultText', defaultValue: null });
  },

  /**
   * Initializes DOM-related component properties.
   */
  didInsertElement: function() {
    this._super(...arguments);

    // We need to select and remember DOM-element representing ui-dropdown component,
    // but we can't just call to this.$('.flexberry-dropdown'), because ember will throw an error
    // "You cannot access this.$() on a component with tagName: ''.".
    // So we have to search our element in 'childViews' collection.
    var dropdownView = this.get('childViews').find(function(view) {
      return !Ember.isEmpty(view.get('tagName')) && view.$().hasClass('flexberry-dropdown');
    });

    var dropdownDomElement = !Ember.isNone(dropdownView) ? dropdownView.$() : null;
    this.set('dropdownDomElement', dropdownDomElement);
  }
});
