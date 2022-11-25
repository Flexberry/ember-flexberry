import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo, hasMany } from 'ember-flexberry-data/utils/attributes';

let Model = EmberFlexberryDataModel.extend({
  // This property is for flexberry-groupedit component.
  // Inverse relationship is necessary here.
  details: DS.hasMany('components-examples/flexberry-groupedit/shared/detail', {
    inverse: 'aggregator',
    async: false
  })
});

// Edit form projection.
Model.defineProjection('AggregatorE', 'aggregator', {
  details: hasMany('components-examples/flexberry-groupedit/shared/detail', 'Details', {
    flag: attr('Flagsdfadf'),
    text: attr('Textadsfasd'),
    date: attr('Date'),
    enumeration: attr('Enumeration'),
    file: attr('File'),
    master: belongsTo('components-examples/flexberry-groupedit/shared/master', 'Master', {
      text: attr('Text', {
        hidden: true
      })
    }, {
      displayMemberPath: 'text'
    })
  })
});

// Edit form projection for test 'configurate row'.
Model.defineProjection('ConfigurateRowView', 'components-examples/flexberry-groupedit/shared/aggregator', {
  details: hasMany('components-examples/flexberry-groupedit/shared/detail', 'Details', {
    flag: attr('Flag'),
    text: attr('Text')
  })
});

// Projection for testing displaying changes on GE after manual model update.
Model.defineProjection('ManualModelUpdateView', 'components-examples/flexberry-groupedit/shared/aggregator', {
  details: hasMany('components-examples/flexberry-groupedit/shared/detail', 'Details', {
    flag: attr('Flag'),
    text: attr('Text'),
    date: attr('Date'),
    enumeration: attr('Enumeration'),
    file: attr('File'),
    master: belongsTo('components-examples/flexberry-groupedit/shared/master', 'Master', {
      text: attr('Text', {
        hidden: true
      })
    }, {
      displayMemberPath: 'text'
    })
  })
});

export default Model;
