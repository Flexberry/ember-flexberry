/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Injects 'after' method into 'Ember.run' namespace.

  @for ApplicationInitializer
  @method emberRunAfter.initialize
*/
export function initialize() {
  Ember.run.after = function(context, condition, handler) {
    const checkInterval = 50;

    const checkCondition = () => {
      if (condition.call(context) === true) {
        Ember.run(context, handler);
      } else {
        Ember.run.later(checkCondition, checkInterval);
      }
    };

    Ember.run.later(checkCondition, checkInterval);
  };
}

export default {
  name: 'ember-run-after',
  initialize
};
