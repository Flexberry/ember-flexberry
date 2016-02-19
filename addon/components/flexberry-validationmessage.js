/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * Component for show error message from model validators.
 *
 * @class FlexberryValidationMessage
 */

export default Ember.Component.extend({

  /**
   * Default class for component wrapper.
   *
   * @property classNames
   * @type Array
   * @readOnly
   */
  classNames: ['ui', 'basic', 'label'],

  /**
   * Error value.
   *
   * @property Error
   * @type String
   * @default undefined
   */
  error: undefined,

  /**
   * Color value for label text.
   *
   * @property Color
   * @type String
   * @default 'red'
   */
  color: 'red',

  /**
   * Control position related to this message
   * possible positions: pointing, pointing below, left pointing, right pointing
   * @property Color
   * @type String
   * @default ''
   */
  position: 'pointing',

  /**
   *
   * If error property isn't exists, the component will appear hidden in DOM.
   * @property isVisible
   * @type Boolean
   */
  isVisible: Ember.computed('error', function () {
    let error = this.get('error');
    return !!(error && (Array.isArray(error) && error.length));
  }),

  init: function () {
    this._super(...arguments);

    this.get('classNames').push(this.get('color'));
    this.get('classNames').push(this.get('position'));
  }

});
