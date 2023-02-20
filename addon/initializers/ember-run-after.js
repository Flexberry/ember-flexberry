/**
  @module ember-flexberry
*/

import Ember from 'ember';
import runAfter from '../utils/run-after';

/**
  Injects 'after' method into 'Ember.run' namespace.

  @for ApplicationInitializer
  @method emberRunAfter.initialize
*/
export function initialize() {
  Ember.run.after = function(context, condition, handler) {
    Ember.deprecate(`Use "import runAfter from 'ember-flexberry/utils/run-after';" instead of "run.after".`, false, {
      id: 'ember-flexberry.initializers.ember-run-after',
      until: '3.0',
    });

    runAfter(context, condition, handler);
  };
}

export default {
  name: 'ember-run-after',
  initialize
};
