import Ember from 'ember';
import DS from 'ember-data';
import IdProxy from '../utils/idproxy';
import ModelProjection from '../objects/model-projection';
import ModelProjectionsCollection from '../objects/model-projections-collection';

var Model = DS.Model.extend({
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
  })
});

Model.reopenClass({
  /**
   * Define Model Projections here using
   * ModelProjectionsCollection and ModelProjection classes.
   */
  Projections: null,

  buildProjection: function(name, attributes) {
    let proj = ModelProjection.create({
      type: this.typeKey,
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
      if (relationshipNames.hasMany.indexOf(attrKey) !== 1) {
        let projName = name + '.details.' + attrKey;
        proj.details[attrKey] = this.buildProjection(projName, relAttributes[attrKey]);
      } else if (relationshipNames.belongsTo.indexOf(attrKey) !== -1) {
        let projName = name + '.masters.' + attrKey;
        proj.masters[attrKey] = this.buildProjection(projName, relAttributes[attrKey]);
      } else {
        throw new Error('Unknown attribute ${attrKey}.');
      }
    }

    return proj;
  },

  defineProjection: function(name, attributes) {
    let proj = this.buildProjection(name, attributes);

    if (!this.Projections) {
      this.Projections = ModelProjectionsCollection.create();
    }

    this.Projections[name] = proj;
  }
});

export default Model;
