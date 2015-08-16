import Ember from 'ember';

export default {
  transformForSerialize: function(snapshot,
                                  skipProjectionAttrs = true,
                                  skipUnchangedAttrs = true) {
    if (skipUnchangedAttrs || skipProjectionAttrs) {
      let projection;
      let projectionAttributes;

      if (skipProjectionAttrs) {
        projection = snapshot.record.get('projection');
        projectionAttributes = projection.get('properties');
      }

      let changedAttributes = Ember.keys(snapshot.changedAttributes());
      for (let attrKey in snapshot._attributes) {
        var attrIsChanged;
        if (skipUnchangedAttrs) {
          attrIsChanged = changedAttributes.indexOf(attrKey) !== -1;
          if (!attrIsChanged) {
            delete snapshot._attributes[attrKey];
            continue;
          }
        }

        if (skipProjectionAttrs && projectionAttributes) {
          let attrIsProjected = projectionAttributes.indexOf(attrKey) !== -1;
          if (!attrIsProjected) {
            delete snapshot._attributes[attrKey];

            // Print warning if property has been changed.
            Ember.warn(`Property ${attrKey} is modified, but not exists ` +
              `in current projection ${projection.name}.`, !attrIsChanged);
          }
        }
      }

      snapshot.eachAttribute = function(callback, binding) {
        snapshot.record.eachAttribute(function(name, meta) {
          if (name in snapshot._attributes) {
            callback.call(binding, name, meta);
          }
        }, binding);
      };
    }

    return snapshot;
  }
};
