import DS from 'ember-data';
import DataObjectViewsCollection from '../objects/data-object-views-collection';
import DataObjectView from '../objects/data-object-view';
import ProjectedModel from './projected-model';

var Model = ProjectedModel.extend({
  orderDate: DS.attr('date')
});

Model.reopenClass({
  // TODO: DataObjectView = Ember.Object.extend or mixin?
  Views: DataObjectViewsCollection.create({
    OrderE: DataObjectView.create({
      type: 'order',
      name: 'OrderE',
      properties: ['orderDate']
    }),
    OrderL: DataObjectView.create({
      type: 'order',
      name: 'OrderL',
      properties: ['orderDate']
    })
  })
});

export default Model;
