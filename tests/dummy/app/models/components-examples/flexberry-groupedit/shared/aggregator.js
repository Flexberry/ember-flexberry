import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
  // This property is for flexberry-groupedit component.
  // Inverse relationship is necessary here.
  details: DS.hasMany('components-examples/flexberry-groupedit/shared/detail', {
    inverse: 'aggregator',
    async: false
  })
});

// Edit form projection.
Model.defineProjection('AggregatorE', 'components-examples/flexberry-groupedit/shared/aggregator', {
  details: Projection.hasMany('components-examples/flexberry-groupedit/shared/detail', 'Details', {
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
  })
});

// Edit form projection for test 'configurate row'.
Model.defineProjection('ConfigurateRowView', 'components-examples/flexberry-groupedit/shared/aggregator', {
  details: Projection.hasMany('components-examples/flexberry-groupedit/shared/detail', 'Details', {
    flag: Projection.attr('Flag'),
    text: Projection.attr('Text')
  })
});

// Projection for testing displaying changes on GE after manual model update.
Model.defineProjection('ManualModelUpdateView', 'components-examples/flexberry-groupedit/shared/aggregator', {
  details: Projection.hasMany('components-examples/flexberry-groupedit/shared/detail', 'Details', {
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
  })
});

export default Model;
