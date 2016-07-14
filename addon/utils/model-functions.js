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
  Gets the name of caption for projection.

  @method getProjectionAttrCaption
  @param {Service} i18n i18n service.
  @param {Object} projection Model projection.
  @param {String} attrName Name of attribute from projection.
  @param {String} key Key from locales.
  @return {String} Name of caption.
*/
export function getProjectionAttrCaption(i18n, projection, attrName, key) {
  let nameFromLocales = false;

  if (key) {
    if (i18n.exists(key)) {
      nameFromLocales = i18n.t(key);
    } else {
      Ember.Logger.warn(`The ${key} is not found in locales.`);
    }
  }

  return nameFromLocales || projection.attributes[attrName].caption || Ember.String.capitalize(attrName);
}
