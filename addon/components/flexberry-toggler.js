/**
 * @module ember-flexberry
 */

import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * Common caption in the component header.
   * Used when appropriate sate-related caption ({{#crossLink "expandedCaption:property"}}{{/crossLink}}
   * or {{#crossLink "collapsedCaption:property"}}{{/crossLink}}) is not specified.
   *
   * @property caption
   * @type String
   * @default ''
   */
  caption: '',

  /**
   * Caption in the component header for expanded state.
   * If it is not specified, {{#crossLink "caption:property"}}{{/crossLink}} will be used.
   *
   * @property expandedCaption
   * @type String
   * @default null
   */
  expandedCaption: null,

  /**
   * Caption in the component header for collapsed state.
   * If it is not specified, {{#crossLink "caption:property"}}{{/crossLink}} will be used.
   *
   * @property collapsedCaption
   * @type String
   * @default null
   */
  collapsedCaption: null,

  /**
   * Current visibility state.
   *
   * @property expanded
   * @type Boolean
   * @default true
   */
  expanded: true,

  /**
   * Current caption.
   *
   * @property captionComputed
   * @type String
   */
  captionComputed: Ember.computed('caption', 'expandedCaption', 'collapsedCaption', 'expanded', function() {
    var defaultCaption = this.get('caption');
    var caption = this.get('expanded') ? (this.get('expandedCaption') || defaultCaption) : (this.get('collapsedCaption') || defaultCaption);

    return caption;
  }),

  /**
   * Default class for component wrapper.
   *
   * @property classNames
   * @type Array
   */
  classNames: ['flexberry-toggler'],

  /**
   * Handles the event, when component has been insterted.
   * Attaches event handlers for expanding / collapsing content.
   *
   * @method didInsertElement
   */
  didInsertElement() {
    var _this = this;
    var $content = this.$('.flexberry-toggler-content');
    var expanded;

    this.$('.flexberry-toggler-caption').click(function() {
      expanded = _this.get('expanded');
      expanded = !expanded;
      _this.set('expanded', expanded);
      $content.toggle(expanded);
      return false;
    });
  }
});
