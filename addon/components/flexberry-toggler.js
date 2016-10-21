/**
  @module ember-flexberry
 */

import Ember from 'ember';

/**
  Component for expand / collapse content.

  @example
    ```handlebars
    {{#flexberry-toggler
      expandedCaption='Expanded caption'
      collapsedCaption='Collapsed caption'
      expanded=true
    }}
      Your content.
    {{/flexberry-toggler}}
    ```

  @class FlexberryToggler
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
*/
export default Ember.Component.extend({
  /**
    Current visibility state.

    @property expanded
    @type Boolean
    @default false
  */
  expanded: false,

  /**
    Common caption in the component header.
    Used when appropriate sate-related caption ({{#crossLink "FlexberryToggler/expandedCaption:property"}}{{/crossLink}}
    or {{#crossLink "FlexberryToggler/collapsedCaption:property"}}{{/crossLink}}) is not specified.

    @property caption
    @type String
    @default ''
  */
  caption: '',

  /**
    Caption in the component header for expanded state.
    If it is not specified, {{#crossLink "FlexberryToggler/caption:property"}}{{/crossLink}} will be used.

    @property expandedCaption
    @type String
    @default null
  */
  expandedCaption: null,

  /**
    Caption in the component header for collapsed state.
    If it is not specified, {{#crossLink "FlexberryToggler/caption:property"}}{{/crossLink}} will be used.

    @property collapsedCaption
    @type String
    @default null
  */
  collapsedCaption: null,

  /**
    Current caption.

    @property currentCaption
    @type String
    @readOnly
  */
  currentCaption: Ember.computed('caption', 'expandedCaption', 'collapsedCaption', 'expanded', function() {
    let defaultCaption = this.get('caption');
    let caption = this.get('expanded') ? (this.get('expandedCaption') || defaultCaption) : (this.get('collapsedCaption') || defaultCaption);

    return caption;
  }),

  /**
    Array CSS class names.
    [More info](http://emberjs.com/api/classes/Ember.Component.html#property_classNames).

    @property classNames
    @type Array
    @readOnly
  */
  classNames: ['flexberry-toggler', 'ui', 'accordion', 'fluid'],

  /**
    CSS clasess for i tag.

    @property iconClass
    @type String
  */
  iconClass: undefined,

  /**
    Handles the event, when component has been insterted.
    Attaches event handlers for expanding / collapsing content.
  */
  didInsertElement() {
    let $accordeonDomElement = this.$();

    // Attach semantic-ui open/close callbacks.
    $accordeonDomElement.accordion({
      onOpen: () => {
        // Change of 'expanded' state may cause asynchronous animation, so we need Ember.run here.
        Ember.run(() => {
          this.set('expanded', true);
        });
      },
      onClose: () => {
        // Change of 'expanded' state may cause asynchronous animation, so we need Ember.run here.
        Ember.run(() => {
          this.set('expanded', false);
        });
      },
    });

    // Animation is asynchronous, so we need Ember.run here.
    Ember.run(() => {
      // Initialize right state (call semantic-ui accordion open/close method).
      $accordeonDomElement.accordion(this.get('expanded') ? 'open' : 'close');
    });
  },

  /**
    Destroys DOM-related component's properties.
  */
  willDestroyElement() {
    this._super(...arguments);

    // Destroys Semantic UI accordion.
    this.$().accordion('destroy');
  }
});
