/**
  @module ember-flexberry
*/

import Ember from 'ember';
import { run } from '@ember/runloop'; //TODO Import Module. Replace Ember.run.after.

/**
  Injects 'after' method into 'Ember.run' namespace.

  @for ApplicationInitializer
  @method emberRunAfter.initialize
  @param {<a href="http://emberjs.com/api/classes/Ember.Application.html">Ember.Application</a>} application Ember application.
*/
/* eslint-disable no-unused-vars */
export function initialize(application) {
  Ember.run.after = function(context, condition, handler) {
    let checkIntervalId;
    let checkInterval = 50;

    // Wait for condition fulfillment.
    run(() => {
      checkIntervalId = window.setInterval(() => {
        let conditionFulfilled = false;

        try {
          conditionFulfilled = condition.call(context) === true;
        } catch (e) {
          // Exception occurred while evaluating condition.
          // Clear interval & rethrow error.
          window.clearInterval(checkIntervalId);
          throw e;
        }

        if (!conditionFulfilled) {
          return;
        }

        // Condition is fulfilled.
        // Stop interval.
        window.clearInterval(checkIntervalId);

        // Call handler.
        run(() => {
          handler.call(context);
        });
      }, checkInterval);
    });
  };
}
/* eslint-enable no-unused-vars */

export default {
  name: 'ember-run-after',
  initialize
};
