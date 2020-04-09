/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';
import { assert } from '@ember/debug';
import { typeOf, isNone } from '@ember/utils';
import { get } from '@ember/object';
import { A, isArray } from '@ember/array';

/**
  Mixin containing logic which forces assertion exceptions
  if handlers for required actions are not defined.

  @class RequiredActionsMixin
  @extends <a href="https://www.emberjs.com/api/ember/release/classes/Mixin">Mixin</a>
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

    let originalSendDynamicAction = this.get('sendDynamicAction');

    // Override 'sendAction' method to add some custom logic.
    this.sendDynamicAction = (...args) => {
      let actionName = args[0];

      if (!isNone(originalSendDynamicAction)){
        originalSendDynamicAction.apply(this, args);
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
