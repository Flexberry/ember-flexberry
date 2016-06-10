/**
 * @module ember-flexberry
 */

import Ember from 'ember';

export default Ember.Component.extend({
  module: 'message',
  classNameBindings: ['cssClass'],
  visible: true,
  floating: false,
  compact: false,
  attached: false,
  closeable: false,
  type: null,
  color: null,
  size: null,
  icon: null,
  caption: null,
  message: null,
  cssClass: Ember.computed('size', 'type', 'color', 'floating', 'compact', 'attached', 'visible', 'icon', function() {
    var isNonEmptyString = function(str) {
      return Ember.typeOf(str) === 'string' && str.trim().length > 0;
    };

    var result = 'ui ';

    // Message size ('small', 'large', 'huge', 'massive', or some custom size class).
    var sizeClass = this.get('size');
    var hasSize = isNonEmptyString(sizeClass);
    result += hasSize ? sizeClass + ' ' : '';

    // Message type ('info', 'positive', 'success', 'negative', 'error', or some custom type class).
    var typeClass = this.get('type');
    var hasType = isNonEmptyString(typeClass);
    result += hasType ? typeClass + ' ' : '';

    // Message color ('red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple',
    // 'pink', 'brown', 'black', or some custom color class).
    var colorClass = this.get('color');
    var hasColor = isNonEmptyString(colorClass);
    result += hasColor ? colorClass + ' ' : '';

    // Message block variations.
    // Note! Variations 'ui floating message', 'ui compact message', 'ui attached message' doesn't work
    // with 'icon', 'visible' and 'hidden' subclasses.
    // For example 'ui compact icon message' will be with icon, but not compact.
    var isFloating = this.get('floating');
    result += isFloating ? 'floating ' : '';

    var isCompact = this.get('compact');
    result += isCompact ? 'compact ' : '';

    var isAttached = this.get('attached');
    result += isAttached ? 'attached ' : '';

    // Message block visibility.
    // Note! It is better to use empty string '' instead of 'visible' subclass.
    var isVisible = this.get('visible');
    result += isVisible ? '' : 'hidden ';

    // Message icon.
    var iconClass = this.get('icon');
    var hasIcon = isNonEmptyString(iconClass);
    result += hasIcon ? 'icon ' : '';

    result += 'message';

    return result;
  }),

  didInsertElement: function() {
    var isCloseable = this.get('closeable');
    if (isCloseable) {
      // Inside 'click'-callback 'this' would refer to a jQuery-object.
      var _this = this;
      _this.$('.close').on('click', function() {
        _this.hide();
      });
    }
  },

  show: function() {
    this.set('visible', true);

    // Send component 'onShow'-action with component itself as an argument.
    this.sendAction('onShow', this);
  },

  hide: function() {
    this.set('visible', false);

    // Send component 'onHide'-action with component itself as an argument.
    this.sendAction('onHide', this);
  }
});
