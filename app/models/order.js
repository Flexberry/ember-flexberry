import DS from 'ember-data';
import ModelProjectionsCollection from '../objects/model-projections-collection';
import ModelProjection from '../objects/model-projection';
import ProjectedModel from './projected-model';

var Model = ProjectedModel.extend({
  orderDate: DS.attr('date'),
  employeeID: DS.belongsTo('employee', { inverse: null, async: true })
});

// TODO: why not Model.Projections = ...?
Model.reopenClass({
  // TODO: rename Projections to lowercase.
  Projections: ModelProjectionsCollection.create({
    OrderE: ModelProjection.create({
      type: 'order',
      name: 'OrderE',
      properties: ['orderDate', 'employeeID'],
      masters: ModelProjectionsCollection.create({
        employeeID: ModelProjection.create({
          // TODO: rename type to ownerType or something else.
          type: 'order',
          name: 'OrderE.masters.employeeID',
          properties: ['firstName']
        })
      })
    }),
    OrderL: ModelProjection.create({
      type: 'order',
      name: 'OrderL',
      properties: ['orderDate']
    })
  })
});

export default Model;
