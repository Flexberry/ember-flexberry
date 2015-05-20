import DS from 'ember-data';
import ModelProjectionsCollection from '../objects/model-projections-collection';
import ModelProjection from '../objects/model-projection';
import ProjectedModel from './projected-model';

var Model = ProjectedModel.extend({
  orderDate: DS.attr('date')
});

Model.reopenClass({
  Projections: ModelProjectionsCollection.create({
    OrderE: ModelProjection.create({
      type: 'order',
      name: 'OrderE',
      properties: ['orderDate']
    }),
    OrderL: ModelProjection.create({
      type: 'order',
      name: 'OrderL',
      properties: ['orderDate']
    })
  })
});

export default Model;
