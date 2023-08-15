/**
  @module ember-flexberry
*/

import { isNone } from '@ember/utils';
import DS from 'ember-data';
import { attr } from 'ember-flexberry-data/utils/attributes';
import Model from 'ember-flexberry-data/models/model';

  /**
    Creates model from data model.

    @method createModel
    @param {Object} attributes model attributes array.
    @return {Object} Model
  */
  function createModel(attrs) {
    if (isNone(attrs)) {
      return;
    }

    let model = {};
    attrs.forEach((attribute) => {
      model[attribute.name] = DS.attr(attribute.type, { required: attribute.notNull });
    });

    let modelResult = Model.extend(model);
    return modelResult;
  }

  /**
    Creates projection from data model.

    @method createProjection
    @param {Object} projectionObj Projection object.
    @return {Object} Projection
  */
  function createProjection(projectionObj) {
    let modelProjection = { };

    projectionObj.attrs.forEach((attribute) => {
      modelProjection[attribute.name] = attr('');
    });

    return modelProjection;
  }

  /**
    Dynamic model registration.

    @method dynamicModelRegistration
    @param {Object} dynamicModelObj Dynamic model object.
  */
 let dynamicModelRegistration = function(dynamicModelObj, owner) {
    let modelRegistered = owner.hasRegistration(`model:${dynamicModelObj.modelName}`);

    // Check if model is registered.
    if (!modelRegistered) {
      let model = createModel(dynamicModelObj.attrs);

      dynamicModelObj.projections.forEach((projection) => {
        model.defineProjection(projection.name, dynamicModelObj.modelName, createProjection(projection));
      });

      owner.register(`model:${dynamicModelObj.modelName}`, model);
    }
  }

export {
  dynamicModelRegistration
};
