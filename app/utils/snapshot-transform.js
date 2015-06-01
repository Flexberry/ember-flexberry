import Ember from 'ember';
import IdProxy from './idproxy';

export default {
  transformForSerialize: function(snapshot,
                                  skipUnchangedAttrs = true,
                                  skipNoProjectionAttrs = true) {
    if (IdProxy.idIsProxied(snapshot.id)) {
      let data = IdProxy.retrieve(snapshot.id, snapshot.type);
      snapshot.id = data.id;

      // TODO: skipUnchangedAttrs for nonproxied snapshot too?
      if (skipUnchangedAttrs || skipNoProjectionAttrs) {
        // TODO: use record.changedAttributes?
        let changedAttributes = Ember.keys(snapshot.record.get('_inFlightAttributes'));
        let projectionAttributes = data.projection.get('properties');
        for (let attrKey in snapshot._attributes) {
          var attrIsChanged;
          if (skipUnchangedAttrs) {
            attrIsChanged = changedAttributes.indexOf(attrKey) !== -1;
            if (!attrIsChanged) {
              delete snapshot._attributes[attrKey];
              continue;
            }
          }

          if (skipNoProjectionAttrs) {
            let attrIsProjected = projectionAttributes.indexOf(attrKey) !== -1;
            if (!attrIsProjected) {
              delete snapshot._attributes[attrKey];

              // Print warning if property has been changed.
              Ember.warn('Property ${attrKey} is modified, but not exists ' +
                         'in current projection ${data.projectionName}.', !attrIsChanged);
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

    for (let key in snapshot._hasManyToIds) {
      let ids = snapshot._hasManyToIds[key];
      if (ids) {
        snapshot._hasManyToIds[key] = ids.map(getOriginalId);
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
