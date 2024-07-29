import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo } from 'ember-flexberry-data/utils/attributes';

var Model = EmberFlexberryDataModel.extend({
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
});

// Edit form short projection.
Model.defineProjection('DetailShortE', 'components-examples/flexberry-groupedit/shared/detail', {
  flag: attr('Flag'),
  text: attr('Text'),
  enumeration: attr('Enumeration'),
});

// Edit form ultra short projection.
Model.defineProjection('DetailUltraShortE', 'components-examples/flexberry-groupedit/shared/detail', {
  flag: attr('Flag'),
  enumeration: attr('Enumeration'),
});

export default Model;
