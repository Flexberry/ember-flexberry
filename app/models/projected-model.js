import Ember from 'ember';
import DS from 'ember-data';
import IdProxy from '../utils/idproxy';
import EmberValidations from 'ember-validations';
import ValidationData from '../objects/validation-data';
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

  projection: Ember.computed('id', 'modelProjection', {
    get: function() {
      var id = this.get('id');
      if (id === null) {
        // id isn't setted in newly created records.
        return this.get('modelProjection') || null;
      }

      if (IdProxy.idIsProxied(id)) {
        return IdProxy.retrieve(id, this.constructor).projection;
      } else {
        return null;
      }
    }
  }),

  // check new created record to have a 'modelProjection' property
  ready: function () {
    var isNew = this.get('isNew');
    if (isNew) {
      var newRecordProjection = this.get('modelProjection');
      if (!newRecordProjection) {
        throw new Error('New projected-model record must have a "modelProjection" property. \n\n' +
          'Id is null for new records, so IdProxy won\'t retrieve a projection from it. That\'s why ' +
          'needed to set a projection for a new record. After record saved and new id returned from server ' +
          'adapter will use that projection to mutate new record id.');
      }
      if (!this.constructor.projections[newRecordProjection.name]) {
        throw new Error('Defined "modelProjection" property doesn\'t belong to record model');
      }
    }
  },

  // delete a 'modelProjection' property after new record is commited to the server
  didCreate: function () {
    delete this.modelProjection;
  },

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
        return new Ember.RSVP.Promise(function (resolve, reject) {
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
