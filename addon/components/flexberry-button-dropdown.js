/**
 @module ember-flexberry
 */

import FlexberryBaseComponent from 'ember-flexberry/components/flexberry-base-component';
import { assert } from '@ember/debug';
import { isNone } from '@ember/utils';

export default FlexberryBaseComponent.extend({

  classNames: ['ui dropdown group-toolbar'],

  classNameBindings: ['readonly:disabled'],

  title: '',

  elementId: undefined,

  /**
   * menu buttons.
   * @example
   * `
   * buttons: [
   *   {
   *     action: actionName,
   *     text: buttonText,
   *     disabled: buttonDisabled
   *     class: '.button-class'
   *   }, {
   *     action: {
   *       name: 'actionName',
   *       params: ['paramValue1', 'paramValue2']
   *     },
   *     text: buttonText,
   *     disabled: buttonDisabled
   *     class: '.button-class'
   *   }, {
   *     text: buttonText,
   *     disabled: buttonDisabled
   *     buttons: [{
   *       action: actionName,
   *       text: buttonText,
   *       disabled: buttonDisabled
   *       class: '.button-class'
   *     }, {
   *       action: actionName,
   *       text: buttonText,
   *       disabled: buttonDisabled
   *       class: '.button-class'
   *     }]
   *   },
   * ]
   * `
   */
  buttons: undefined,

  /**
   * Flag, the component is embedded in another component, for example, in the flexberry-olv toolbar.
   * Set to send action in the controller.
   * @type {Boolean}
   */
  deepMount: false,

  actions: {
    /**
     * Call action of a clicked button.
     *
     * @method actions.sendButtonAction
     * @public
     * @param {String|Object} action action.
     */
    sendButtonAction(action) {
      assert('{{button-dropdown}}: button.action parameter missing', !isNone(action));

      let actionName = '';
      let actionParams = [];

      if (typeof action === 'string') {
        actionName = action;
      } else if (!isNone(action.params)) {
        actionName = action.name;
        actionParams = action.params;
      }

      if (this.get('deepMount')) {
        this.currentController.send(actionName, ...actionParams);
      } else {
        this.get(actionName)(...actionParams);
      }
    }
  }
});
