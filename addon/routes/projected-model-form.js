/**
  @module ember-flexberry
 */

import Ember from 'ember';

/**
  Base route with support projection.

  @class ProjectedModelForm
  @extends <a href="http://emberjs.com/api/classes/Ember.Route.html">Ember.Route</a>
 */
export default Ember.Route.extend({
  /**
    Model projection.

    @property modelProjection
    @type Projection
   */
  modelProjection: undefined,

  /**
    Model name.

    @property modelName
    @type String
   */
  modelName: undefined,
});
