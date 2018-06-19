/**
  @module ember-flexberry
 */

import Route from '@ember/routing/route';

/**
  Base route with support projection.

  @class ProjectedModelForm
  @extends <a href="https://www.emberjs.com/api/ember/release/classes/Route">Route</a>
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
