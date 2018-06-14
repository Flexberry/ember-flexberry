/**
  @module ember-flexberry
 */

import Route from '@ember/routing/route';

/**
  Base route with support projection.

  @class ProjectedModelForm
  @extends <a href="http://emberjs.com/api/classes/Ember.Route.html">Ember.Route</a>
 */
export default Route.extend({
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
