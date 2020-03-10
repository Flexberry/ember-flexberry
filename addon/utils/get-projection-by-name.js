/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Used for getting projection object by projection name.

  @method getProjectionByName
  @param {Object} projectionName Projection name.
  @param {String} modelName Model Name.
  @param {Object} store
  @return {Object} Projection by name.
*/
export default function getProjectionByName(projectionName, modelName, store) {
  Ember.assert('For define projection by name, model name is required.', modelName);
  Ember.assert('For define projection by name, store is required.', store);
  let modelConstructor = store.modelFor(modelName);
  Ember.assert(`Model with name '${modelName}' is not found.`, modelConstructor);

  return Ember.get(modelConstructor, `projections.${projectionName}`);
}
