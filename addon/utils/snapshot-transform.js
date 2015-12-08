export default {
  transformForSerialize: function(snapshot, skipUnchangedAttrs = true) {
    if (skipUnchangedAttrs) {
      let changedAttributes = Object.keys(snapshot.changedAttributes());
      for (let attrKey in snapshot._attributes) {
        let attrIsChanged = changedAttributes.indexOf(attrKey) !== -1;
        if (!attrIsChanged) {
          delete snapshot._attributes[attrKey];
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
