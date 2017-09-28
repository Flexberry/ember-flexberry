import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
  // Inversed relationship for aggregator.details.
  // It's not a property for flexberry-lookup component.
  aggregator: DS.belongsTo('components-examples/flexberry-groupedit/shared/aggregator', {
    inverse: 'details',
    async: false
  }),

  flag: DS.attr('boolean'),
  text: DS.attr('string'),
  date: DS.attr('date'),
  enumeration: DS.attr('components-examples/flexberry-groupedit/shared/detail-enumeration'),
  file: DS.attr('file'),

  // This property is for flexberry-lookup component. No inverse relationship here.
  master: DS.belongsTo('components-examples/flexberry-groupedit/shared/master', {
    inverse: null,
    async: false
  })
});

// Edit form projection.
Model.defineProjection('DetailE', 'components-examples/flexberry-groupedit/shared/detail', {
  flag: Projection.attr('Flag'),
  text: Projection.attr('Text'),
  date: Projection.attr('Date'),
  enumeration: Projection.attr('Enumeration'),
  file: Projection.attr('File'),
  master: Projection.belongsTo('components-examples/flexberry-groupedit/shared/master', 'Master', {
    text: Projection.attr('Text', {
      hidden: true
    })
  }, {
    displayMemberPath: 'text'
  })
});

// Edit form short projection.
Model.defineProjection('DetailShortE', 'components-examples/flexberry-groupedit/shared/detail', {
  flag: Projection.attr('Flag'),
  text: Projection.attr('Text'),
  enumeration: Projection.attr('Enumeration'),
});

// Edit form ultra short projection.
Model.defineProjection('DetailUltraShortE', 'components-examples/flexberry-groupedit/shared/detail', {
  flag: Projection.attr('Flag'),
  enumeration: Projection.attr('Enumeration'),
});

export default Model;
