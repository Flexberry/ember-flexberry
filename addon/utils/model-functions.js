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
  @return {String} Name of caption.
*/
export function getProjectionAttrCaption(i18n, projection, attrName) {
  let currentAttr = projection.attributes[attrName];
  let key = currentAttr.options.locale;
  let nameFromLocale = false;

  if (key !== undefined) {
    nameFromLocale = i18n.t(key);
  }

  return nameFromLocale || projection.attributes[attrName].caption || Ember.String.capitalize(attrName);
}
