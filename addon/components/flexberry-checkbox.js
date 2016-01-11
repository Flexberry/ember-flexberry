/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

const ComponentClass = 'flexberry-checkbox';

/**
 * Checkbox component for Semantic UI.
 *
 * @class FlexberrCheckbox
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
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
   * Current checked value.
   *
   * @property checked
   * @type Boolean
   * @default false
   */
  checked: false,

  /**
   * Label for the checkbox.
   *
   * @property label
   * @type String
   * @default ''
   */
  label: '',

  /**
   * Additional classes for Semantic UI checkbox.
   * Adds special Semantic UI class ('read-only') when component is readonly.
   *
   * @property _classComputed
   * @private
   * @type String
   */
  _classComputed: Ember.computed('readonly', function() {
    return ComponentClass + (this.get('readonly') ? ' read-only' : '');
  })
});
