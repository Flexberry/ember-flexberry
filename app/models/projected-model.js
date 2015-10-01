import Ember from 'ember';
import DS from 'ember-data';
import Projection from '../utils/projection';

var Model = DS.Model.extend({
});

Model.reopenClass({
  projections: null,

  defineProjection: function(projectionName, modelName, attributes) {
    let proj = Projection.create(modelName, attributes);

    if (!this.projections) {
      this.reopenClass({
        projections: Ember.Object.create()
      });
    }

    this.projections.set(projectionName, proj);
    return proj;
  }
});

export default Model;
