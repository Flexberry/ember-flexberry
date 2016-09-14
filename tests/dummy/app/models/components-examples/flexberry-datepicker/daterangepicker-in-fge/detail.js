import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
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
