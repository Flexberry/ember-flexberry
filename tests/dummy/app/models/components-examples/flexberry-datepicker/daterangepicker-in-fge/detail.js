import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import { Projection } from 'ember-flexberry-data';

var Model = BaseModel.extend({
  // Inversed relationship for aggregator.details.
  aggregator: DS.belongsTo('components-examples/flexberry-datepicker/daterangepicker-in-fge/aggregator', {
    inverse: 'details',
    async: false
  }),

  date: DS.attr('date'),
});

// Edit form projection.
Model.defineProjection('DetailE', 'components-examples/flexberry-datepicker/daterangepicker-in-fge/detail', {
  date: Projection.attr('Date'),
});

export default Model;
