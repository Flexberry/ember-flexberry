/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Runs `handler` after `condition` is met.

  @for Utils

  @private
  @method runAfter
  @param {any} context The context with which `handler` and `condition` functions will be called.
  @param {Function} condition The function that must return `true` for `handler` to be called.
  @param {Function} handler The function to be called when `condition` returns `true`.
*/
export default function runAfter(context, condition, handler) {
  const checkInterval = 50;

  const checkCondition = () => {
    if (condition.call(context) === true) {
      Ember.run(context, handler);
    } else {
      Ember.run.later(checkCondition, checkInterval);
    }
  };

  Ember.run.later(checkCondition, checkInterval);
}
