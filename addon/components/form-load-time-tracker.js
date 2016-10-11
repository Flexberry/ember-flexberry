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
});
