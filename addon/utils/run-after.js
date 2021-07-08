/**
  @module ember-flexberry
*/

import { run, later } from '@ember/runloop';

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
      run(context, handler);
    } else {
      later(checkCondition, checkInterval);
    }
  };

  later(checkCondition, checkInterval);
}
