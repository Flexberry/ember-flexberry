/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { A, isArray } from '@ember/array';
import { assert } from '@ember/debug';
import { typeOf, isNone } from '@ember/utils';

// Validates every dynamic action properties.
// Not a mixin member, so yuidoc-comments are unnecessary.
let validateDynamicActionProperties = function(dynamicAction, dynamicActionIndex) {
  dynamicAction = dynamicAction || {};

  // Property 'on' must be a string.
  let on = get(dynamicAction, 'on');
  assert(
    `Wrong type of dynamicActions[${dynamicActionIndex}].on property: ` +
    `actual type is ${typeOf(on)}, but \`string\` is expected.`,
    typeOf(on) === 'string');

  // Property 'actionHandler' must be a function (if defined).
  let actionHandler = get(dynamicAction, 'actionHandler');
  assert(
    `Wrong type of dynamicActions[${dynamicActionIndex}].actionHandler property: ` +
    `actual type is ${typeOf(actionHandler)}, but \`function\` is expected.`,
    isNone(actionHandler) || typeOf(actionHandler) === 'function');

  // Property 'actionName' must be a string (if defined).
  let actionName = get(dynamicAction, 'actionName');
  assert(
    `Wrong type of dynamicActions[${dynamicActionIndex}].actionName property: ` +
    `actual type is ${typeOf(actionName)}, but \`string\` is expected.`,
    isNone(actionName) || typeOf(actionName) === 'string');

  // Action context's 'send' method must be defined if 'actionName' is defined.
  let actionContext = get(dynamicAction, 'actionContext');
  assert(
    `Method \`send\` must be defined in given dynamicActions[${dynamicActionIndex}].actionContext ` +
    `in order to trigger dynamic action with defined ` +
    `dynamicActions[${dynamicActionIndex}].actionName (\`${actionName}\`).`,
    isNone(actionName) ||
    (typeOf(actionName) === 'string' && !isNone(actionContext) && typeOf(actionContext.send) === 'function'));

  // Property 'actionArguments' must be an array (if defined).
  let actionArguments = get(dynamicAction, 'actionArguments');
  assert(
    `Wrong type of dynamicActions[${dynamicActionIndex}].actionArguments property: ` +
    `actual type is ${typeOf(actionArguments)}, but \`array\` is expected.`,
    isNone(actionArguments) || isArray(actionArguments));
};

/**
  Mixin containing logic making available dynamic actions for those components,
  which consumes their inner structure as [JSON-object](http://www.json.org/)
  or [Ember-object](http://emberjs.com/api/classes/Ember.Object.html)
  and there is no way to attach action handlers for their nested component's explicitly in hbs-markup.

  @class DynamicActionsMixin
  @extends <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
*/
export default Mixin.create({
  /**
    Component's dynamic actions from
    {{#crossLink "DynamicActionsMixin:dynamicActions:property"}}'dynamicActions' property{{/crossLink}},
    mapped from array into flat [JSON-object](http://www.json.org/).

    @property _dynamicActions
    @type Object
    @readOnly
    @private
  */
  _dynamicActions: computed(
    'dynamicActions.[]',
    'dynamicActions.@each.on',
    'dynamicActions.@each.actionHandler',
    'dynamicActions.@each.actionName',
    'dynamicActions.@each.actionContext',
    'dynamicActions.@each.actionArguments',
    function() {
      let dynamicActions = this.get('dynamicActions');
      let result = {};

      assert(
        `Wrong type of \`dynamicActions\` propery: ` +
        `actual type is ${typeOf(dynamicActions)}, but \`array\` is expected.`,
        isNone(dynamicActions) || isArray(dynamicActions));

      if (!isArray(dynamicActions)) {
        return result;
      }

      for (let i = 0, len = dynamicActions.length; i < len; i++) {
        let dynamicAction = dynamicActions[i];
        validateDynamicActionProperties(dynamicAction, i);

        let on = get(dynamicAction, 'on');
        if (isNone(result[on])) {
          result[on] = A();
        }

        result[on].pushObject(dynamicAction);
      }

      return result;
    }
  ),

  /**
    Component's dynamic actions.
    If component consumes it's inner structure as [JSON-object](http://www.json.org/)
    or [Ember-object](http://emberjs.com/api/classes/Ember.Object.html)
    and there is no way to attach action handlers explicitly in hbs-markup,
    then you can define {{#crossLink "DynamicActionObject"}}dynamic actions{{/crossLink}}
    somewhere in code & pass defined array into this component's property.

    @property dynamicActions
    @type DynamicActionObject[]
    @default null
  */
  dynamicActions: null,

  /**
    Returns flag, indicating whether action handler is defined, for action with the specified name, or not.

    @method _actionHandlerIsDefined
    @param {Object} options Method options
    @param {String} options.actionName Name of component's action for which handler's existence this method should check.
    @returns {Boolean} Flag, indicating whether action handler is defined, for action with the specified name, or not.
    @private
  */
  _actionHandlerIsDefined(options) {
    options = options || {};
    let actionName = get(options, 'actionName');

    return this.get(`_dynamicActions.${actionName}.length`) > 0 || this._super(...arguments);
  },

  /**
    Initializes dynamic actions logic.
  */
  init() {
    this._super(...arguments);

    let originalSendAction = this.get('sendAction');
    assert(
      `Wrong type of \`sendAction\` propery: actual type is ${typeOf(originalSendAction)}, ` +
      `but \`function\` is expected.`,
      typeOf(originalSendAction) === 'function');

    // Override 'sendAction' method to add some custom logic.
    this.sendAction = (...args) => {
      let actionName = args[0];
      let originalSendActionIsOverridden = originalSendAction !== Component.prototype.sendAction;
      let outerActionHandlerIsDefined = typeOf(this.get(`attrs.${actionName}`)) === 'function' ||
        typeOf(this.get(`attrs.${actionName}`)) === 'string';

      // Call for overridden send action, or call for standard 'sendAction' (sending action outside).
      // Overridden 'sendAction' must be called anywhere,
      // but call for standard 'sendAction' must be executed only if outer action handler is defined,
      // otherwise ember will call to component's inner method with the same name (as action name),
      // for example if you send 'remove' action, then (if outer handler isn't defined) component's
      // 'remove' method will be called, what will cause unexpected behavior and exceptions.
      if (originalSendActionIsOverridden || outerActionHandlerIsDefined) {
        originalSendAction.apply(this, args);
      }

      let dynamicActions = this.get(`_dynamicActions.${actionName}`);

      // If no dynamic actions defined for action with given name,
      // break custom 'sendAction' logic then.
      if (!isArray(dynamicActions)) {
        return;
      }

      // Call handlers defined in dynamic actions.
      // Here we can be sure that all dynamic actions are fully valid,
      // because they were validated in process of '_dynamicActions' computation.
      for (let i = 0, len = dynamicActions.length; i < len; i++) {
        let dynamicAction = dynamicActions[i];
        let actionHandler = get(dynamicAction, 'actionHandler');
        let actionName = get(dynamicAction, 'actionName');
        let actionContext = get(dynamicAction, 'actionContext');
        let actionArguments = get(dynamicAction, 'actionArguments') || [];

        // Original action arguments (without action name passed to 'sendAction' method).
        let originalActionArguments = args.slice(1);

        // Combined action arguments.
        let combinedActionArguments = [...actionArguments, ...originalActionArguments];

        // Call to action handler (if defined).
        if (typeOf(actionHandler) === 'function') {
          actionHandler.apply(actionContext, combinedActionArguments);
        }

        // Send action (if defined).
        if (typeOf(actionName) === 'string') {
          actionContext.send(actionName, ...combinedActionArguments);
        }
      }
    };
  }
});
