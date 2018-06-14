/**
  @module ember-flexberry
*/

import $ from 'jquery';
import Mixin from '@ember/object/mixin';
import { get, set, computed } from '@ember/object';
import { A, isArray } from '@ember/array';
import { assert } from '@ember/debug';
import { typeOf, isNone } from '@ember/utils';
import { getOwner } from '@ember/application';

// Validates DOM-event options.
// Not a mixin member, so yuidoc-comments are unnecessary.
let validateDomEventOptions = function(options, eventIsAttaching) {
  options = options || {};
  let eventTarget = get(options, 'eventTarget');
  let eventName = get(options, 'eventName');
  let eventHandler = get(options, 'eventHandler');

  assert(
    `Wrong type of \`options.eventTarget\` property: ` +
    `actual type is \`${typeOf(eventTarget)}\`, but \`object\` or \`instance\` is expected.`,
    typeOf(eventTarget) === 'object' || typeOf(eventTarget) === 'instance');

  let methodName = eventIsAttaching ? 'on' : 'off';
  assert(
    `Wrong type of \`options.eventTarget.{$methodName}\` property: ` +
    `actual type is \`${typeOf(eventTarget[methodName])}\`, but \`function\` is expected.`,
    typeOf(eventTarget[methodName]) === 'function');

  assert(
    `Wrong type of \`options.eventName\` property: ` +
    `actual type is \`${typeOf(eventName)}\`, but \`string\` is expected.`,
    typeOf(eventName) === 'string');

  assert(
    `Wrong type of \`options.eventHandler\` property: ` +
    `actual type is \`${typeOf(eventHandler)}\`, but \`function\` is expected.`,
    typeOf(eventHandler) === 'function');
};

/**
  Mixin containing logic making available to handle DOM-events related to component
  as inner & outer component's actions.
  Also contains methods to attach custom handlers for DOM-events with delayed clean up logic
  which will be executed before component will be destroyed.

  @class DomActionsMixin
  @extends <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
*/
export default Mixin.create({
  /**
    Dictionary containing names of DOM-events available for component's wrapping DOM-element
    and component's actions names related to them.

    @property _availableDomEvents
    @type Object
    @readOnly
    @private
  */
  _availableDomEvents: computed(function() {
    // Code from Ember.Component 'init' hook to get DOM-events available for component.
    let eventDispatcher = getOwner(this).lookup('event_dispatcher:main');

    return eventDispatcher && eventDispatcher._finalEvents || {};
  }),

  /**
    Array with objects containing selected event targets & handlers attached to them.
    Each object in array has following structure: {
      eventTarget: ...,
      attachedEventHandlers: {
        click: [function() {}, function() {}, ...],
        dblclick: [function() {}, function() {}, ...],
        ...
      }
    }.

    @property _eventsMetadata
    @type Object[]
    @default null
    @private
   */
  _eventsMetadata: null,

  /**
    Flag: indicates whether component is tagless or not
    (has empty [tagName](http://emberjs.com/api/classes/Ember.Component.html#property_tagName) or not).

    @property isTagless
    @type Boolean
    @readOnly
   */
  isTagless: computed('tagName', function() {
    let tagName = this.get('tagName');
    if (typeOf(tagName) === 'string') {
      tagName = $.trim(tagName);
    }

    return tagName === '';
  }),

  /**
    Attaches event handler for a given event-target.
    Also remembers attached handlers and related event-targets for clean up logic
    which will be executed before component will be destroyed, so use this method instead of
    explicit calls to [jQuery.on method](http://api.jquery.com/on/) to avoid possible memory leaks.

    @method attachEventHandler
    @param {Object} options Method options.
    @param {Object} options.eventTarget DOM-element ([jQuery-object](http://api.jquery.com/Types/#jQuery))
    for which event-handler must be attached.
    @param {String} options.eventName Event name.
    @param {Function} options.eventHandler Event handler.
  */
  attachEventHandler(options) {
    validateDomEventOptions(options, true);
    let eventTarget = get(options, 'eventTarget');
    let eventName = get(options, 'eventName');
    let eventHandler = get(options, 'eventHandler');

    // Find event-metadata for a given DOM-element.
    let eventsMetadata = this.get('_eventsMetadata');
    let eventMetadata = eventsMetadata.filter((metadata) => {
      return metadata.eventTarget === eventTarget;
    })[0];

    // Create new metadata if necessary.
    if (isNone(eventMetadata)) {
      eventMetadata = {
        eventTarget: eventTarget
      };

      eventsMetadata.pushObject(eventMetadata);
    }

    let attachedEventHandlers = get(eventMetadata, 'attachedEventHandlers');
    if (isNone(attachedEventHandlers)) {
      attachedEventHandlers = {};
      set(eventMetadata, 'attachedEventHandlers', attachedEventHandlers);
    }

    let specifiedEventAttachedEventHandlers = get(attachedEventHandlers, eventName);
    if (!isArray(specifiedEventAttachedEventHandlers)) {
      specifiedEventAttachedEventHandlers = A();
      set(attachedEventHandlers, eventName, specifiedEventAttachedEventHandlers);
    }

    if (!specifiedEventAttachedEventHandlers.includes(eventHandler)) {
      // Store given event-handler.
      specifiedEventAttachedEventHandlers.pushObject(eventHandler);

      // Finally attach event-handler for given event-target.
      eventTarget.on(eventName, eventHandler);
    }
  },

  /**
    Detaches event-handler from a given event-target.
    Also cleans up metadata remembered when event-handler was attached through
    {{#crossLink "DomActionsMixin/attachEventHandler:method"}}'attachEventHandler' method {{/crossLink}}.

    @method detachEventHandler
    @param {Object} options Method options.
    @param {Object} options.eventTarget DOM-element ([jQuery-object](http://api.jquery.com/Types/#jQuery))
    from which event-handler must be detached.
    @param {String} options.eventName Event name.
    @param {Function} options.eventHandler Event handler.
  */
  detachEventHandler(options) {
    validateDomEventOptions(options, false);
    let eventTarget = get(options, 'eventTarget');
    let eventName = get(options, 'eventName');
    let eventHandler = get(options, 'eventHandler');

    // Detach event-handler from given DOM-element.
    eventTarget.off(eventName, eventHandler);

    // Clean up metadata.
    let eventsMetadata = this.get('_eventsMetadata');
    let eventMetadata = eventsMetadata.filter((metadata) => {
      return metadata.eventTarget === eventTarget;
    })[0];

    if (isNone(eventMetadata)) {
      return;
    }

    // Get object (keys - events names, values - arrays with attached handlers).
    let attachedEventHandlers = get(eventMetadata, 'attachedEventHandlers');
    if (!isNone(attachedEventHandlers)) {
      // Get handlers array for specified event-name.
      let specifiedEventAttachedEventHandlers = get(attachedEventHandlers, eventName);

      if (isArray(specifiedEventAttachedEventHandlers) && specifiedEventAttachedEventHandlers.includes(eventHandler)) {
        // Remove handler from metadata.
        specifiedEventAttachedEventHandlers.removeObject(eventHandler);

        // Remove whole array if there is no handlers any more.
        if (specifiedEventAttachedEventHandlers.length === 0) {
          delete attachedEventHandlers[eventName];
        }
      }
    }

    // Remove whole metadata for specified DOM-element if there is no handlers any more.
    if (isNone(attachedEventHandlers) || Object.keys(attachedEventHandlers).length === 0) {
      eventsMetadata.removeObject(eventMetadata);
    }
  },

  /**
    Detaches all event-handlers remembered in metadata when event-handlers were attached through
    {{#crossLink "DomActionsMixin/attachEventHandler:method"}}'attachEventHandler' method {{/crossLink}}.

    @method detachAllEventHandlers
  */
  detachAllEventHandlers() {
    let eventsMetadata = this.get('_eventsMetadata');
    var metadataCount = get(eventsMetadata, 'length');
    while (--metadataCount >= 0) {
      let eventMetadata = eventsMetadata[metadataCount];

      let eventTarget = get(eventMetadata, 'eventTarget');
      let attachedEventHandlers = get(eventMetadata, 'attachedEventHandlers');
      if (isNone(attachedEventHandlers)) {
        eventsMetadata.removeObject(eventMetadata);
        break;
      }

      let eventNames = Object.keys(attachedEventHandlers);
      for (let i = 0, len = eventNames.length; i < len; i++) {
        let eventName = eventNames[i];
        let specifiedEventAttachedEventHandlers = get(attachedEventHandlers, eventName);

        if (!isArray(specifiedEventAttachedEventHandlers)) {
          delete attachedEventHandlers[eventName];
          break;
        }

        var handlersCount = get(specifiedEventAttachedEventHandlers, 'length');
        while (--handlersCount >= 0) {
          this.detachEventHandler({
            eventTarget: eventTarget,
            eventName: eventName,
            eventHandler: specifiedEventAttachedEventHandlers[handlersCount]
          });
        }
      }
    }
  },

  /**
    Overridden ['send' method](https://github.com/emberjs/ember.js/blob/v2.7.0/packages/ember-runtime/lib/mixins/action_handler.js#L145).
    Method logic still the same, but method now returns value returned by the action handler.

    ```
    @method send
    @param {String} actionName Name of the action that must be triggered.
    @param {*} args Arguments that must be passed to action.
    @return {any} Returns value returned by action handler.
  */
  send(actionName, ...args) {
    // Modified code of 'send'-method from original Ember action-handler mixin.
    let actionShouldBubble;
    let actionHandlerResult;
    let actionHandler = this.get(`actions.${actionName}`);

    if (typeOf(actionHandler) === 'function') {
      actionHandlerResult = actionHandler.apply(this, args);

      // If inner action founded, bubble only if it returned 'true'.
      actionShouldBubble = actionHandlerResult === true;
    } else {
      // If inner action wasn't found, then bubble is necessary.
      actionShouldBubble = true;
    }

    if (actionShouldBubble) {
      let target = this.get('target');
      if (!isNone(target)) {
        assert(
          `The \`target\` (${target}) for ${this} doesn\`t have a \`send\` method`,
          typeOf(this.get('target.send')) === 'function');

        target.send(...arguments);
      }
    }

    // It is the only one 'send'-logic modification:
    // 'send' method now returns value returned by founded inner action.
    // It is necessary when DOM-events are handling like inner & outer actions,
    // to break outer action sending, if inner action handler returned 'false'.
    return actionHandlerResult;
  },

  /**
    Initializes some mixin properties.
  */
  init() {
    this._super(...arguments);

    // Initialize array-property for this component's instance.
    this.set('_eventsMetadata', A());
  },

  /**
    Initializes component's DOM-events related logic.
  */
  didInsertElement() {
    this._super(...arguments);

    // DOM-events are not available for tagless components.
    if (this.get('isTagless')) {
      return;
    }

    // Events names example: domEventName = 'dblclick', but componentActionName = 'doubleClick'.
    // See https://guides.emberjs.com/v2.4.0/components/handling-events/.
    let availableDomEvents = this.get('_availableDomEvents');
    let $component = this.$();
    let attachEventsActions = (domEventName, componentActionName) => {
      this.attachEventHandler({
        eventTarget: $component,
        eventName: domEventName,
        eventHandler: (...args) => {
          let canSendAction = true;

          // Trigger component's inner action handler.
          // (Check if action is defined in component to avoid assertion failed exception).
          if (typeOf(this.get(`actions.${componentActionName}`)) === 'function') {
            canSendAction = this.send(componentActionName, ...args) !== false;
          }

          // Trigger component's outer action if inner action handler doesn't return 'false'.
          if (canSendAction) {
            if(!isNone(this.get(componentActionName))){
              this.get(componentActionName)(...args);
            }

          }
        }
      });
    };

    for (let domEventName in availableDomEvents) {
      if (!availableDomEvents.hasOwnProperty(domEventName)) {
        break;
      }

      let componentActionName = availableDomEvents[domEventName];
      if (typeOf(componentActionName) !== 'string') {
        break;
      }

      // Attach actions logic for every available DOM-event.
      attachEventsActions(domEventName, componentActionName);
    }
  },

  /**
    Executes some logic before every render.
  */
  willRender() {
    this._super(...arguments);

    // DOM-events are not available for tagless components.
    if (this.get('isTagless')) {
      return;
    }

    // Events names example: domEventName = 'dblclick', but componentActionName = 'doubleClick'.
    // See https://guides.emberjs.com/v2.4.0/components/handling-events/.
    let availableDomEvents = this.get('_availableDomEvents');

    // Remove component's standard DOM-events handlers, because they are useless,
    // they are replaced with component's inner actions in 'didInsertElement' hook.
    // Ember adds them in every component's render/rerender time, so we need to remove them each time,
    // otherwise DOM-actions will be triggered twice when they happen.
    for (let domEventName in availableDomEvents) {
      if (!availableDomEvents.hasOwnProperty(domEventName)) {
        break;
      }

      let componentActionName = availableDomEvents[domEventName];
      if (typeOf(componentActionName) !== 'string') {
        break;
      }

      this.set(componentActionName, undefined);
      delete this[componentActionName];
    }
  },

  /**
    Cleans up component's DOM-events related logic.
  */
  willDestroyElement() {
    this._super(...arguments);

    // DOM-events are not available for tagless components.
    if (this.get('isTagless')) {
      return;
    }

    this.detachAllEventHandlers();
  }
});
