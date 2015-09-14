import Projection from './projection';

export default {
  attr: function(caption, options) {
    return {
      kind: 'attr',
      caption: caption,
      options: options || {}
    };
  },

  belongsTo: function(modelName, attributes) {
    let proj = Projection.create(modelName, attributes);
    proj.kind = 'belongsTo';
    return proj;
  },

  hasMany: function(modelName, attributes) {
    let proj = Projection.create(modelName, attributes);
    proj.kind = 'hasMany';
    return proj;
  }
};
