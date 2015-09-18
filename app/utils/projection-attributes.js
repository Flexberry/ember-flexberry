import Ember from 'ember';
import Projection from './projection';

export default {
  attr: function(caption, options) {
    let attr = createAttr('attr', caption, options);
    return attr;
  },

  belongsTo: function(modelName, caption, attributes, options) {
    let attr = createAttr('belongsTo', caption, options);
    let proj = Projection.create(modelName, attributes);
    attr = Ember.merge(attr, proj);
    return attr;
  },

  hasMany: function(modelName, caption, attributes, options) {
    let attr = createAttr('hasMany', caption, options);
    let proj = Projection.create(modelName, attributes);
    attr = Ember.merge(attr, proj);
    return attr;
  }
};

function createAttr(kind, caption, options) {
  return {
    kind: kind,
    caption: caption,
    options: options || {}
  };
}
