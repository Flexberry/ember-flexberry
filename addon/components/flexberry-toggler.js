/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Component for expand / collapse content.
 *
 * Sample usage:
 * ```handlebars
 * {{#flexberry-toggler
 *   expandedCaption='Expanded caption'
 *   collapsedCaption='Collapsed caption'
 * }}
 *   Your content.
 * {{/flexberry-toggler}}
 * ```
 *
 * @class FlexberryToggler
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  /**
   * Current visibility state.
   *
   * @property _expanded
   * @type Boolean
   * @default true
   * @private
   */
  _expanded: true,

  /**
   * Common caption in the component header.
   * Used when appropriate sate-related caption ({{#crossLink "FlexberryToggler/expandedCaption:property"}}{{/crossLink}}
   * or {{#crossLink "FlexberryToggler/collapsedCaption:property"}}{{/crossLink}}) is not specified.
   *
   * @property caption
   * @type String
   * @default ''
   */
  caption: '',

  /**
   * Caption in the component header for expanded state.
   * If it is not specified, {{#crossLink "FlexberryToggler/caption:property"}}{{/crossLink}} will be used.
   *
   * @property expandedCaption
   * @type String
   * @default null
   */
  expandedCaption: null,

  /**
   * Caption in the component header for collapsed state.
   * If it is not specified, {{#crossLink "FlexberryToggler/caption:property"}}{{/crossLink}} will be used.
   *
   * @property collapsedCaption
   * @type String
   * @default null
   */
  collapsedCaption: null,

  /**
   * Current caption.
   *
   * @property _caption
   * @type String
   * @readOnly
   */
  currentCaption: Ember.computed('caption', 'expandedCaption', 'collapsedCaption', '_expanded', function() {
    let defaultCaption = this.get('caption');
    let caption = this.get('_expanded') ? (this.get('expandedCaption') || defaultCaption) : (this.get('collapsedCaption') || defaultCaption);

    return caption;
  }),

  /**
   * Array CSS class names.
   * [More info.](http://emberjs.com/api/classes/Ember.Component.html#property_classNames)
   *
   * @property classNames
   * @type Array
   * @readOnly
   */
  classNames: ['flexberry-toggler', 'ui', 'accordion', 'fluid'],

  /**
   * Handles the event, when component has been insterted.
   * Attaches event handlers for expanding / collapsing content.
   */
  didInsertElement() {
    let _this = this;
    this.$().accordion({
      onOpening: function() {
        _this.set('_expanded', _this.$(this).hasClass('active'));
      },
      onClosing: function() {
        _this.set('_expanded', _this.$(this).hasClass('active'));
      }
    });
  },
});
