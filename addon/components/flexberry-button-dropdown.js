/**
 @module ember-flexberry
 */

import FlexberryBaseComponent from 'ember-flexberry/components/flexberry-base-component';
import Ember from 'ember';

export default FlexberryBaseComponent.extend({

  classNames: ['button-dropdown'],

  title: '',

  elementId: undefined,

  /**
   * menu buttons.
   * 
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
   * 
   * @type {boolean}
   */
  deepMount: false,

  actions: {
    /**
     * Call action of a clicked button.
     *
     * @function actions.sendButtonAction
     * @public
     * @param {string|object} action action.
     */
    sendButtonAction(action) {
      Ember.assert('{{button-dropdown}}: button.action parameter missing', !Ember.isNone(action));

      let actionName = '';
      let actionParams = [];

      if (typeof action === 'string') {
        actionName = action;
      } else if (!Ember.isNone(action.params)) {
        actionName = action.name;
        actionParams = action.params;
      }

      if (Ember.get(this, 'deepMount')) {
        this.currentController.send(actionName, ...actionParams);
      } else {
        /* eslint-disable ember/closure-actions */
        this.sendAction(actionName, ...actionParams);
        /* eslint-enable ember/closure-actions */
      }
    }
  }
});
