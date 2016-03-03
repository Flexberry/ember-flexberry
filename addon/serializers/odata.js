import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  /**
   * Flag: indicates whether to use new {@link http://jsonapi.org|JSON API} serialization.
   */
  isNewSerializerAPI: true,

  /**
   * Prefix for response metadata properties names.
   */
  metaPropertiesPrefix: '@odata.',

  /**
   * Normalization method for single objects.
   * @param store Storage.
   * @param typeClass Type of received object.
   * @param payload Received object itself.
   * @param id Identifier of received object.
   * @returns {object} Valid {@link http://jsonapi.org/format/#document-top-level|JSON API document}.
   */
  normalizeSingleResponse: function(store, typeClass, payload, id) {
    payload = {
      [typeClass.modelName]: payload
    };

    // Meta should exist in the root of the payload object, otherwise it would not be extracted by _super method.
    this._moveMeta(payload, payload[typeClass.modelName], true);

    return this._super(store, typeClass, payload, id);
  },

  /**
   * Normalization method for arrays of objects.
   * @param store Storage.
   * @param typeClass Type of received object.
   * @param payload Received objects array.
   * @returns {object} Valid {http://jsonapi.org/format/#document-top-level|@link JSON API document}.
   */
  normalizeArrayResponse: function(store, typeClass, payload) {
    let rootKey = Ember.String.pluralize(typeClass.modelName);
    payload[rootKey] = payload.value;
    delete payload.value;

    return this._super(store, typeClass, payload);
  },

  /**
   * Extracts metadata from received object.
   * @param store Storage.
   * @param type Type of received object.
   * @param payload Received object itself.
   * @returns {object} Metadata extracted from received object (any format is allowed).
   */
  extractMeta: function(store, type, payload) {
    if (!payload) {
      return undefined;
    }

    let meta = {};
    this._moveMeta(meta, payload, false);

    return meta;
  },

  /**
   * Returns key for a given attribute.
   * @param attr Attribute.
   * @returns {string} Key for a given attribute.
   */
  keyForAttribute: function(attr) {
    return Ember.String.capitalize(attr);
  },

  /**
   * Returns key for a given relationship.
   * @param key Existing relationship key.
   * @param relationship Relationship.
   * @returns {string} Key for a given relationship.
   */
  keyForRelationship: function(key, relationship) {
    return Ember.String.capitalize(key) + '@odata.bind';
  },

  /**
   * Serialization method to serialize record into hash.
   * @param hash Target hash.
   * @param type Record type.
   * @param record Record itself.
   * @param options Serialization options.
   */
  serializeIntoHash: function(hash, type, record, options) {
    // OData requires id in request body.
    options = options || {};
    options.includeId = true;

    // {...} instead of {"application": {...}}
    Ember.merge(hash, this.serialize(record, options));
  },

  /**
   * Moves metadata from one object to another.
   * @param dest Destination object.
   * @param src Source object.
   * @param withPrefix Flag: indicates whether to include metadata prefixes into properties names or not.
   * @private
   */
  _moveMeta: function(dest, src, withPrefix) {
    let prefix = this.get('metaPropertiesPrefix');
    let prefixLength = prefix.length;

    for (var srcKey in src) {
      if (src.hasOwnProperty(srcKey) && srcKey.indexOf(prefix) === 0) {
        var destKey = withPrefix ? srcKey : srcKey.substring(prefixLength);
        dest[destKey] = src[srcKey];
        delete src[srcKey];
      }
    }
  }
});
