import DS from 'ember-data';

var Model = DS.Model.extend({
  orderDate: DS.attr('date')
});

Model.reopenClass({
  // TODO: DataObjectView = Ember.Object.extend or mixin?
  Views: {
    OrderE: {
      type: 'order',
      name: 'OrderE',
      properties: ['orderDate']
    },
    OrderL: {
      type: 'order',
      name: 'OrderL',
      properties: ['orderDate']
    }
  }
});

export default Model;
