/**
  @module ember-flexberry
*/

import { isNone } from '@ember/utils';
import DS from 'ember-data';
import { attr } from 'ember-flexberry-data/utils/attributes';
import Model from 'ember-flexberry-data/models/model';
import Mixin from '@ember/object/mixin';

  /**
    Creates mixin from data model.

    @method createMixin
    @param {Object} attributes model attributes array.
    @return {Object} Mixin
  */
  function createMixin(attrs) {
    if (isNone(attrs)) {
      return;
    }

    let mixin = {};
    attrs.forEach((attribute) => {
      mixin[attribute.name] = DS.attr(attribute.type, { required: attribute.notNull });
    });

    let modelMixin = Mixin.create(mixin);
    return modelMixin;
  };

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
  };

  /**
    Dynamic model registration.

    @method dynamicModelRegistration
    @param {Object} dynamicModelObj Dynamic model object.
  */
 let dynamicModelRegistration = function(dynamicModelObj, owner) {
    let modelRegistered = owner.hasRegistration(`model:${dynamicModelObj.modelName}`);
    let mixinRegistered = owner.hasRegistration(`mixin:${dynamicModelObj.modelName}`);

    // Check if model and mixin are registered.
    if (!modelRegistered && !mixinRegistered) {
      let modelMixin = createMixin(dynamicModelObj.attrs);
      let model = Model.extend(modelMixin);

      dynamicModelObj.projections.forEach((projection) => {
        model.defineProjection(projection.name, dynamicModelObj.modelName, createProjection(projection));
      });

      owner.register(`model:${dynamicModelObj.modelName}`, model);
      owner.register(`mixin:${dynamicModelObj.modelName}`, modelMixin);
    }
  }

export {
  dynamicModelRegistration
};
