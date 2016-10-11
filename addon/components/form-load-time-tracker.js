/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Component for view data from {{#crossLink FormLoadTimeTrackerService}}{{/crossLink}}.

  @class FormLoadTimeTrackerComponent
  @extends Ember.Component
*/
export default Ember.Component.extend({
  /**
    Link on {{#crossLink FormLoadTimeTrackerService}}{{/crossLink}}.

    @property formLoadTimeTracker
    @type FormLoadTimeTrackerService
  */
  formLoadTimeTracker: Ember.inject.service(),

  /**
    Load time with round.

    @property loadTime
    @type Number
    @readonly
  */
  loadTime: Ember.computed('formLoadTimeTracker.loadTime', function() {
    return Math.round(this.get('formLoadTimeTracker.loadTime'));
  }).readOnly(),

  /**
    Render time with round.

    @property renderTime
    @type Number
    @readonly
  */
  renderTime: Ember.computed('formLoadTimeTracker.renderTime', function() {
    return Math.round(this.get('formLoadTimeTracker.renderTime'));
  }).readOnly(),
});
