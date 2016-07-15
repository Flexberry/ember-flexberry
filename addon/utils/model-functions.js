/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * Gets related object type by relation name from specified model.
 *
 * @method _getRelationType
 * @param {String} model Specified model to get relation from.
 * @param {String} relationName Relation name.
 * @return {String} Related object type.
 * @throws {Error} Throws error if relation was not found at model.
 */
export function getRelationType(model, relationName) {
  // Get ember static function to get relation by name.
  var relationshipsByName = Ember.get(model.constructor, 'relationshipsByName');

  // Get relation property from model.
  var relation = relationshipsByName.get(relationName);
  if (!relation) {
    throw new Error(`No relation with '${relationName}' name defined in '${model.constructor.modelName}' model.`);
  }

  let relationType = relation.type;
  return relationType;
}

/**
  Gets the value from locales.

  @method getValueFromLocales
  @param {Service} i18n i18n service.
  @param {String} key Key for property in locales.
  @return {String} Value from locales. Returns `null` if key will not be found.
*/
export function getValueFromLocales(i18n, key) {
  Ember.assert('key should be defined', key);

  if (i18n.exists(key)) {
    return i18n.t(key);
  } else {
    Ember.Logger.warn(`The ${key} is not found in locales.`);
    return null;
  }
}
