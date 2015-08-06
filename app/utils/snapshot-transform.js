import Ember from 'ember';
import IdProxy from './idproxy';

export default {
  transformForSerialize: function(snapshot,
                                  skipProjectionAttrs = true,
                                  skipUnchangedAttrs = true) {

    if (IdProxy.idIsProxied(snapshot.id)) {
      let data = IdProxy.retrieve(snapshot.id, snapshot.type);
      snapshot.id = data.id;
    }

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

    snapshot.eachRelationship(function(key, relationship) {
      if (relationship.kind === 'belongsTo') {
        snapshot.belongsTo(key, { id: true });
      } else if (relationship.kind === 'hasMany') {
        snapshot.hasMany(key, { ids: true });
      }
    }, this);

    for (let key in snapshot._belongsToIds) {
      let id = snapshot._belongsToIds[key];
      if (id) {
        snapshot._belongsToIds[key] = getOriginalId(id);
      }
    }

    for (let key in snapshot._hasManyIds) {
      let ids = snapshot._hasManyIds[key];
      if (ids) {
        snapshot._hasManyIds[key] = ids.map(getOriginalId);
      }
    }

    return snapshot;
  }
};

function getOriginalId(id) {
  if (IdProxy.idIsProxied(id)) {
    return IdProxy.retrieve(id).id;
  } else {
    return id;
  }
}
