import StringTransform from 'ember-data/-private/transforms/string';

/**
 * This transformation is necessary in order to detach file attributes from another string attributes on model level.
 * It extends string transformation from ember data (https://github.com/emberjs/data/blob/v2.3.0/addon/-private/transforms/string.js),
 * without any changes.
 * @class FileTransform
 * @extends DS.StringTransform
 *
 * @example
 * var model = DS.Model.extend({
 *   name: DS.attr('string');
 *   attachment: DS.attr('file')
 * });
 */
export default StringTransform.extend({
  deserialize: function(serialized) {
    return this._super(...arguments);
  },

  serialize: function(deserialized) {
    return this._super(...arguments);
  }
});
