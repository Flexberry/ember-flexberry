/**
  @module ember-flexberry
*/

import Service from '@ember/service';
import { computed } from '@ember/object';

/**
  Service for store time load and render.

  @class FormLoadTimeTrackerService
  @extends Ember.Service
*/
export default Service.extend({
  /**
    Start time of load data.

    @property startLoadTime
    @type Number
    @default 0
  */
  startLoadTime: 0,

  /**
    End time of load data.

    @property endLoadTime
    @type Number
    @default 0
  */
  endLoadTime: 0,

  /**
    Time of start render.

    @property startRenderTime
    @type Number
    @default 0
  */
  startRenderTime: 0,

  /**
    Time of end render.

    @property endRenderTime
    @type Number
    @default 0
  */
  endRenderTime: 0,

  /**
    Time of load data.

    @property loadTime
    @type Number
    @readonly
  */
  loadTime: computed('startLoadTime', 'endLoadTime', function() {
    return this.get('endLoadTime') - this.get('startLoadTime');
  }).readOnly(),

  /**
    Time of render.

    @property renderTime
    @type Number
    @readonly
  */
  renderTime: computed('startRenderTime', 'endRenderTime', function() {
    return this.get('endRenderTime') - this.get('startRenderTime');
  }).readOnly(),
});
