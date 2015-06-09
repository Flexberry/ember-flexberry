import Ember from 'ember';
import DS from 'ember-data';
import IdProxy from '../utils/idproxy';
import EmberValidations from 'ember-validations';
import ModelProjection from '../objects/model-projection';
import ModelProjectionsCollection from '../objects/model-projections-collection';

var Model = DS.Model.extend(EmberValidations.Mixin, {
  primaryKey: Ember.computed('id', {
    get: function() {
      var id = this.get('id');
      if (id === null) {
        // id isn't setted in newly created records.
        return null;
      }

      if (IdProxy.idIsProxied(id)) {
        return IdProxy.retrieve(id).id;
      } else {
        return id;
      }
    }
  }),

  projection: Ember.computed('id', {
    get: function() {
      var id = this.get('id');
      if (id === null) {
        // id isn't setted in newly created records.
        return null;
      }

      if (IdProxy.idIsProxied(id)) {
        return IdProxy.retrieve(id, this.constructor).projection;
      } else {
        return null;
      }
    }
  }),

  // validation rules
  validations: {},

  save: function() {
    var saveData = {};
    var model = this;
    if (!model.get('isDeleted')){
      saveData.noChanges = !model.get('isDirty');
      saveData.anyErrors = model.get('isInvalid');
      saveData.errors = {};

      this.eachAttribute(function (name){
        let propErrors = model.errors.get(name);
        if (propErrors.length > 0){
          saveData.errors[name] = propErrors;
        }
      });
    }
    if (saveData.noChanges || saveData.anyErrors){
      return new Ember.RSVP.Promise(function (resolve) {
        resolve(saveData);
      });
    }
    return this._super.apply(model, arguments);
  }
});

Model.reopenClass({
  /**
   * Define Model Projections here using
   * ModelProjectionsCollection and ModelProjection classes.
   */
  projections: null,

  // TODO: remove typeKey and ModelProjection.type? Instead, use name with Convention Over Configuration for reading type (see IdProxy)?
  buildProjection: function(typeKey, name, attributes) {
    let proj = ModelProjection.create({
      // TODO: rename to ownerType or something else.
      // NOTE: this.typeKey and this.store is undefined here.
      type: typeKey,
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
          relAttributes[rootAttr] = [ rightSide ];
        } else {
          // eg { reportsTo: [firstName, lastName, reportsTo.firstName]}
          relAttributes[rootAttr].push(rightSide);
        }
      }
    }, this);

    proj.properties = plainAttributes;

    let relationshipNames = Ember.get(this, 'relationshipNames');
    for (let attrKey in relAttributes) {
      if (relationshipNames.hasMany.indexOf(attrKey) !== -1) {
        let projName = name + '.details.' + attrKey;
        proj.details.add(attrKey, this.buildProjection(typeKey, projName, relAttributes[attrKey]));
      } else if (relationshipNames.belongsTo.indexOf(attrKey) !== -1) {
        let projName = name + '.masters.' + attrKey;
        proj.masters.add(attrKey, this.buildProjection(typeKey, projName, relAttributes[attrKey]));
      } else {
        throw new Error(`Unknown attribute ${attrKey}.`);
      }
    }

    return proj;
  },

  defineProjection: function(typeKey, name, attributes) {
    let proj = this.buildProjection(typeKey, name, attributes);

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
