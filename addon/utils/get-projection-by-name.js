/**
  @module ember-flexberry
*/

import { get } from '@ember/object';
import { assert } from '@ember/debug';

/**
  Used for getting projection object by projection name.

  @method getProjectionByName
  @param {Object} projectionName Projection name.
  @param {String} modelName Model Name.
  @param {Object} store
  @return {Object} Projection by name.
*/
export default function getProjectionByName(projectionName, modelName, store) {
  assert('For define projection by name, model name is required.', modelName);
  assert('For define projection by name, store is required.', store);
  let modelConstructor = store.modelFor(modelName);
  assert(`Model with name '${modelName}' is not found.`, modelConstructor);

  return get(modelConstructor, `projections.${projectionName}`);
}
