import { run } from '@ember/runloop';

export default function runAfter(context, condition, handler) {
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
}
