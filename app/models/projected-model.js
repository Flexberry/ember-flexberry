import Ember from 'ember';
import DS from 'ember-data';
import EmberValidations from 'ember-validations';
import ValidationData from '../objects/validation-data';
import ModelProjection from '../objects/model-projection';
import ModelProjectionsCollection from '../objects/model-projections-collection';

var Model = DS.Model.extend(EmberValidations, {
  // validation rules
  validations: {},

  save: function() {
    if (!this.get('isDeleted')) {
      var validationData = ValidationData.create({
        noChanges: !this.get('isDirty'),
        anyErrors: this.get('isInvalid')
      });
      validationData.fillErrorsFromProjectedModel(this);

      if (validationData.noChanges || validationData.anyErrors) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
          reject(validationData);
        });
      }
    }

    return this._super.apply(this, arguments);
  }
});

Model.reopenClass({
  /**
   * Define Model Projections here using
   * ModelProjectionsCollection and ModelProjection classes.
   */
  projections: null,

  // TODO: remove modelName and ModelProjection.type? Instead, use name with Convention Over Configuration for reading type (e.g. EmployeeE -> employee)?
  buildProjection: function(modelName, name, attributes) {
    let proj = ModelProjection.create({
      // TODO: rename to ownerType or something else.
      // NOTE: this.modelName is undefined here.
      type: modelName,
      name: name,
      properties: undefined,
      masters: ModelProjectionsCollection.create(),
      details: ModelProjectionsCollection.create()
    });

    let plainAttributes = [];
    let relAttributes = {};
    attributes.forEach(function(attr) {
      let dotIndex = attr.indexOf('.');
      if (dotIndex === -1) {
        plainAttributes.push(attr);
      } else {
        let rootAttr = attr.substring(0, dotIndex);
        let rightSide = attr.substring(dotIndex + 1);
        if (plainAttributes.indexOf(rootAttr) === -1) {
          plainAttributes.push(rootAttr);
          relAttributes[rootAttr] = [rightSide];
        } else {
          // eg { employee1: [firstName, lastName, employee1.firstName]}
          relAttributes[rootAttr].push(rightSide);
        }
      }
    }, this);

    proj.properties = plainAttributes;

    let relationshipNames = Ember.get(this, 'relationshipNames');
    for (let attrKey in relAttributes) {
      if (relationshipNames.hasMany.indexOf(attrKey) !== -1) {
        let projName = name + '.details.' + attrKey;
        proj.details.add(attrKey, this.buildProjection(modelName, projName, relAttributes[attrKey]));
      } else if (relationshipNames.belongsTo.indexOf(attrKey) !== -1) {
        let projName = name + '.masters.' + attrKey;
        proj.masters.add(attrKey, this.buildProjection(modelName, projName, relAttributes[attrKey]));
      } else {
        throw new Error(`Unknown attribute ${attrKey}.`);
      }
    }

    return proj;
  },

  defineProjection: function(modelName, name, attributes) {
    let proj = this.buildProjection(modelName, name, attributes);

    if (!this.projections) {
      this.reopenClass({
        projections: ModelProjectionsCollection.create()
      });
    }

    this.projections.add(name, proj);
    return proj;
  }
});

export default Model;
