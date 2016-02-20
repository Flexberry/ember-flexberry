/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * Component for showing error message from model validators.
 *
 * @class FlexberryValidationMessage
 */

export default Ember.Component.extend({

  /**
   * Class names for component wrapping <div>.
   *
   * @property classNames
   * @type Array
   * @readOnly
   */
  classNames: ['ui', 'basic', 'label'],

  /**
   * Error messages array or error text for shown.
   * Typically uses Ember.Model.errors for specific attribute, plain test also supported.
   *
   * @example
   *   {{flexberry-validationmessage error=model.errors.email}}
   *
   * @property Error
   * @type Array, String
   * @default undefined
   */
  error: undefined,

  /**
   * Semantic color class name for label text.
   *
   * @property Color
   * @type String
   * @default 'red'
   */
  color: 'red',

  /**
   * Label pointing direction
   * possible variants: '', pointing, pointing above, pointing below, left pointing, right pointing
   *
   * @property Pointing
   * @type String
   * @default 'pointing'
   */
  pointing: 'pointing',

  /**
   * If error property isn't exists, the component will appear hidden in DOM.
   *
   * @property isVisible
   * @type Boolean
   */
  isVisible: Ember.computed('error', function () {
    let error = this.get('error');
    return !!(Array.isArray(error) ? error.length : error);
  }),

  init: function () {
    this._super(...arguments);

    this.get('classNames').push(this.get('color'));

    let pointing = this.get('pointing');
    if (pointing) {
      let possiblePointings = [
        '',
        'pointing',
        'pointing above',
        'pointing below',
        'left pointing',
        'right pointing'];
      if (possiblePointings.indexOf(pointing) === -1) {
        let messagePointings = possiblePointings.map(function (item) {
          return `'${item}'`;
        });
        throw new Error(
          `Wrong value of flexberry-validationmessage pointing property, actual is '${pointing}', possible values are: ${messagePointings}`);
      }

      this.get('classNames').push(pointing);
    }
  }
});
