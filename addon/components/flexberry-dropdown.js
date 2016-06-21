/**
 * @module ember-flexberry
 */
import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';

/**
 * @class FlexberryDropDown
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  actions: {
    onChange: function(component, id, newValue) {
      var oldValue = this.get('value') || null;
      newValue = newValue || null;

      if (newValue === oldValue) {
        return;
      }

      // Semantic ui-dropdown component has only one way binding,
      // so we have to set selected value manually.
      this.set('value', newValue);
      this.sendAction('onChange', newValue);
    },

    onShowHide: function() {
      // If this callback returns false, show/hide animation for semantic ui-dropdown will not be called.
      // Its is necessary in situations when route's template changes on model change:
      // ...
      // {{#if model.enum}}
      //   <span>{{model.enum}}<span>
      // {{else}}
      //   {{flexberry-dropdown items=enumAvailableValues value=model.enum}}
      // {{/if}}
      // ...
      // In such situation, without this callback, semantic-ui will throw an error:
      // 'Transition: Element is no longer attached to DOM. Unable to animate'.
      return !this.get('destroyHasBeenCalled');
    },
  },

  /**
  Flag indicates whether to make checks on selected value or not.

  It has `false` value when component loads data by request by semantic processes.
  It is not recommended to change its value out of addon.

  @property needChecksOnValue
  @type Boolean
  @default true
  */
  needChecksOnValue: true,

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
   * Classes for component wrapper.
   *
   * @property class
   * @type String
   * @default ''
   */
  class: '',

  /**
   * Path to component's settings in application configuration (JSON from ./config/environment.js).
   *
   * @property appConfigSettingsPath
   * @type String
   * @default 'APP.components.flexberryBaseComponent'
   */
  appConfigSettingsPath: 'APP.components.flexberryDropdown',

  /**
   * Placeholder or default text (will be displayed if there is no selected item).
   *
   * @property placeholder
   * @type String
   * @default 't('components.flexberry-dropdown.placeholder')'
   */
  placeholder: t('components.flexberry-dropdown.placeholder'),

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
   * Flag: indicates whether 'willDestroyElement' hook has been already called.
   *
   * @property destroyHasBeenCalled
   * @type Boolean
   * @default false
   */
  destroyHasBeenCalled: false,

  /**
   * Flag: indicates whether to show placeholder or not.
   *
   * @property showPlaceholder
   * @type Boolean
   * @readonly
   */
  showPlaceholder: Ember.computed('placeholder', 'value', function() {
    return Ember.isBlank(this.get('value')) && !Ember.isBlank(this.get('placeholder'));
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
    return !Ember.isBlank(value) ? value : '';
  }),

  /**
   * Handles changes in available items & selected item (including changes on component initialization).
   */
  itemsOrValueDidChange: Ember.on('init', Ember.observer('items.[]', 'value', function() {
    var destroyHasBeenCalled = this.get('destroyHasBeenCalled');
    if (destroyHasBeenCalled) {
      return;
    }

    let items = this.get('items');
    let needChecksOnValue = this.get('needChecksOnValue');
    if (needChecksOnValue && !Ember.isArray(items)) {
      Ember.Logger.error(`Wrong type of flexberry-dropdown \`items\` propery: actual type is ${Ember.typeOf(items)}, but array is expected.`);
    }

    var value = this.get('value') || null;
    if (needChecksOnValue && !Ember.isNone(value) && items.indexOf(value) < 0) {
      Ember.Logger.error(`Wrong value of flexberry-dropdown \`value\` propery: \`${value}\`. Allowed values are: [\`${items.join(`\`, \``)}\`].`);
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
      var tagName = view.get('tagName');
      if (Ember.typeOf(tagName) === 'string') {
        tagName = tagName.trim();
      }

      return tagName !== '' && view.$().hasClass('flexberry-dropdown');
    });

    var dropdownDomElement = !Ember.isNone(dropdownView) ? dropdownView.$() : null;
    this.set('dropdownDomElement', dropdownDomElement);
  },

  /**
   * Cleanup DOM-related component stuff.
   */
  willDestroyElement: function() {
    this.set('destroyHasBeenCalled', true);

    this._super(...arguments);
  }
});
