/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed} from '@ember/object';

/**
  Component for view data from {{#crossLink FormLoadTimeTrackerService}}{{/crossLink}}.

  @class FormLoadTimeTrackerComponent
  @extends Ember.Component
*/
export default Component.extend({
  /**
    Link on {{#crossLink FormLoadTimeTrackerService}}{{/crossLink}}.

    @property formLoadTimeTracker
    @type FormLoadTimeTrackerService
  */
  formLoadTimeTracker: service(),

  /**
    Load time with round.

    @property loadTime
    @type Number
    @readonly
  */
  loadTime: computed('formLoadTimeTracker.loadTime', function() {
    return Math.round(this.get('formLoadTimeTracker.loadTime'));
  }).readOnly(),

  /**
    Render time with round.

    @property renderTime
    @type Number
    @readonly
  */
  renderTime: computed('formLoadTimeTracker.renderTime', function() {
    return Math.round(this.get('formLoadTimeTracker.renderTime'));
  }).readOnly(),
});
