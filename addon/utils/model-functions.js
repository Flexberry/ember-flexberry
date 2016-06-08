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
  if (Array.isArray(model)) {
    model = model[0];
  }

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
