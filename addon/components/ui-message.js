/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { typeOf, isNone } from '@ember/utils';

/**
  UIMessage component for Semantic UI.
  # Need refactoring.
  Questions:
  - Need {{yield}} in ui-message-content.hbs?

  Sample usage:
  ```handlebars
  {{ui-message
    type='info'
    size='large'
    icon='info icon'
    caption='Message'
    message='Hello, world!'
    closeable=true
  }}
  ```

  @class UIMessage
  @extend <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
*/
export default Component.extend({
  /**
    I can not remember what it is.
  */
  module: 'message',

  /**
    Resulting list of CSS classes.

    @property _cssClass
    @private
  */
  _cssClass: computed('size', 'type', 'color', 'floating', 'compact', 'attached', 'visible', 'icon', function() {
    let isNonEmptyString = (str) => {
      return typeOf(str) === 'string' && str.trim().length > 0;
    };

    let result = 'ui ';

    // Message size ('small', 'large', 'huge', 'massive', or some custom size class).
    let sizeClass = this.get('size');
    let hasSize = isNonEmptyString(sizeClass);
    result += hasSize ? sizeClass + ' ' : '';

    // Message type ('info', 'positive', 'success', 'negative', 'error', or some custom type class).
    let typeClass = this.get('type');
    let hasType = isNonEmptyString(typeClass);
    result += hasType ? typeClass + ' ' : '';

    // Message color ('red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple',
    // 'pink', 'brown', 'black', or some custom color class).
    let colorClass = this.get('color');
    let hasColor = isNonEmptyString(colorClass);
    result += hasColor ? colorClass + ' ' : '';

    // Message block variations.
    // Note! Variations 'ui floating message', 'ui compact message', 'ui attached message' doesn't work
    // with 'icon', 'visible' and 'hidden' subclasses.
    // For example 'ui compact icon message' will be with icon, but not compact.
    let isFloating = this.get('floating');
    result += isFloating ? 'floating ' : '';

    let isCompact = this.get('compact');
    result += isCompact ? 'compact ' : '';

    let isAttached = this.get('attached');
    result += isAttached ? 'attached ' : '';

    // Message block visibility.
    // Note! It is better to use empty string '' instead of 'visible' subclass.
    let isVisible = this.get('visible');
    result += isVisible ? '' : 'hidden ';

    // Message icon.
    let iconClass = this.get('icon');
    let hasIcon = isNonEmptyString(iconClass);
    result += hasIcon ? 'icon ' : '';

    result += 'message';

    return result;
  }),

  /**
    A message can be set to visible to force itself to be shown.

    More info at [Semantic UI Doc](http://semantic-ui.com/collections/message.html#visible).

    @property visible
    @type Boolean
    @default true
  */
  visible: true,

  /**
    A message can float above content that it is related to content.

    More info at [Semantic UI Doc](http://semantic-ui.com/collections/message.html#floating).

    @property floating
    @type Boolean
    @default false
  */
  floating: false,

  /**
    A message can only take up the width of its content.

    More info at [Semantic UI Doc](http://semantic-ui.com/collections/message.html#compact).

    @property compact
    @type Boolean
    @default false
  */
  compact: false,

  /**
    A message can be formatted to attach itself to other content.

    More info at [Semantic UI Doc](http://semantic-ui.com/collections/message.html#attached).

    @property attached
    @type Boolean
    @default false
  */
  attached: false,

  /**
    A message that the user can choose to hide.

    More info at [Semantic UI Doc](http://semantic-ui.com/collections/message.html#dismissable-block).

    @property closeable
    @type Boolean
    @default false
  */
  closeable: false,

  /**
    Message type.
    Possible variants:
    - ['warning'](http://semantic-ui.com/collections/message.html#warning)
    - ['info'](http://semantic-ui.com/collections/message.html#info)
    - ['positive'](http://semantic-ui.com/collections/message.html#positive--success)
    - ['success'](http://semantic-ui.com/collections/message.html#positive--success)
    - ['negative'](http://semantic-ui.com/collections/message.html#negative--error)
    - ['error'](http://semantic-ui.com/collections/message.html#negative--error)

    @property type
    @type String
    @default null
  */
  type: null,

  /**
    A message can be formatted to be different colors.
    Possible variants:
    - red
    - orange
    - yellow
    - olive
    - green
    - teal
    - blue
    - violet
    - purple
    - pink
    - brown
    - black

    More info at [Semantic UI Doc](http://semantic-ui.com/collections/message.html#colored).

    @property color
    @type String
    @default null
  */
  color: null,

  /**
    A message can have different sizes.
    Possible variants:
    - small
    - large
    - huge
    - massive

    More info at [Semantic UI Doc](http://semantic-ui.com/collections/message.html#size).

    @property size
    @type String
    @default null
  */
  size: null,

  /**
    A message can contain an icon.

    More info at [Semantic UI Doc](http://semantic-ui.com/collections/message.html#icon-message).

    @property icon
    @type String
    @default null
  */
  icon: null,

  /**
    Message title.

    @property caption
    @type String
    @default null
  */
  caption: null,

  /**
    Message body.

    @property message
    @type String
    @default null
  */
  message: null,

  /**
    A list of properties of the view to apply as class names.

    @property classNameBindings
    @type Array
    @readOnly
  */
  classNameBindings: ['_cssClass'],

  /**
    Initializes DOM-related component's logic.
  */
  didInsertElement() {
    let isCloseable = this.get('closeable');
    if (isCloseable) {
      this.$('.close').on('click', () => {
        this.set('visible', false);
      });
    }
  },

  /**
    Observes 'visible' property.
    Sends actions 'onShow' & 'onHide'.

    @method _didVisibilityChange
    @private
  */
  _didVisibilityChange: observer('visible', function() {
    if (this.get('visible')) {
      if (!isNone(this.get('onShow'))) {
        this.get('onShow')();
      }

    } else {
      if (!isNone(this.get('onHide'))) {
        this.get('onHide')();
      }
    }
  })
});
