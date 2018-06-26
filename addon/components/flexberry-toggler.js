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
    Flag indicates whenever toogler contains resizable OLV.

    @property hasResizableOLV
    @type Boolean
  */
  hasResizableOLV: false,

  /**
    Duration in milliseconds of opening animation.
    Set `0` for disabling animation.
    Important: used only on initial render.

    @property duration
    @type Number
    @default 350
  */
  duration: 350,

  /**
  Toggler status setting name.

    @property settingName
    @type String
    @default togglerStatus
  */
  settingName: 'togglerStatus',

  expandedChanged: Ember.observer('expanded', function() {
    this.saveStatus();
  }),
  /**
    Handles the event, when component has been insterted.
    Attaches event handlers for expanding / collapsing content.
  */
  didInsertElement() {
    this.loadStatus();
    let $accordeonDomElement = this.$();

    // Attach semantic-ui open/close callbacks.
    $accordeonDomElement.accordion({
      duration: this.get('duration'),
      onOpen: () => {
        // Change of 'expanded' state may cause asynchronous animation, so we need Ember.run here.
        Ember.run(() => {
          this.set('expanded', true);
          if (this.get('hasResizableOLV')) {
            this.$('table.object-list-view').colResizable({ disable: true });
            this.$('table.object-list-view').colResizable();
          }
        });
      },
      onClose: () => {
        // Change of 'expanded' state may cause asynchronous animation, so we need Ember.run here.
        Ember.run(() => {
          this.set('expanded', false);
        });
      },
    });
  },

  /**
    Destroys DOM-related component's properties.
  */
  willDestroyElement() {
    this._super(...arguments);

    // Destroys Semantic UI accordion.
    this.$().accordion('destroy');
  },

  /**
    Saves toggler status to user service. Only if componentName specified.
  */
  saveStatus() {
    let componentName = this.get('componentName');
    if (!Ember.isPresent(componentName)) {
      return;
    }

    let userSettings = this.get('userSettingsService');
    let settingName = this.get('settingName');
    let currentStatus = userSettings.getTogglerStatus(componentName, settingName);
    let expanded = this.get('expanded');

    if (expanded !== currentStatus) {
      userSettings.setTogglerStatus(componentName, settingName, expanded);
    }
  },

  /**
    Loads toggler status from user service.
  */
  loadStatus() {
    let componentName = this.get('componentName');
    if (!Ember.isPresent(componentName)) {
      return;
    }

    var userSettings = this.get('userSettingsService');
    let settingName = this.get('settingName');
    var currentStatus = userSettings.getTogglerStatus(componentName, settingName);
    let expanded = this.get('expanded');

    if (currentStatus !== null && expanded !== currentStatus) {
      this.set('expanded', currentStatus);
    }
  }
});
