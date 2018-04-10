/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';
import { assert } from '@ember/debug';
import { typeOf, isNone } from '@ember/utils';
import { get } from '@ember/object';
import { A, isArray } from '@ember/array';
import Component from '@ember/component';

/**
  Mixin containing logic which forces assertion exceptions
  if handlers for required actions are not defined.

  @class RequiredActionsMixin
  @extends <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
*/
export default Mixin.create({
  /**
    Component's required actions names.
    For actions enumerated in this array an assertion exceptions will be thrown,
    if actions handlers are not defined for them.

    @property _requiredActions
    @type String[]
    @default null
  */
  _requiredActionNames: null,

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

    return typeOf(this.get(`attrs.${actionName}`)) === 'function' ||
      typeOf(this.get(`attrs.${actionName}`)) === 'string';
  },

  /**
    Initializes required actions logic.
  */
  init() {
    this._super(...arguments);

    let originalSendAction = this.sendAction;
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

      let requiredActionNames = this.get('_requiredActionNames');
      assert(
        `Wrong type of parent component\`s \`_requiredActionNames\` propery: ` +
        `actual type is ${typeOf(requiredActionNames)}, but \`array\` is expected.`,
        isNone(requiredActionNames) || isArray(requiredActionNames));

      // If no required actions names defined, break custom 'sendAction' logic then.
      if (!isArray(requiredActionNames)) {
        return;
      }

      // Throw assertion failed exception, if action handler is not defined for required action.
      assert(
        `Handler for required \`${actionName}\` action is not defined in ${this}`,
        !A(requiredActionNames).includes(actionName) || this._actionHandlerIsDefined({ actionName: actionName }));

    };
  }
});
