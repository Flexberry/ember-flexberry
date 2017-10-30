import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

let Model = Projection.Model.extend({
  flag: DS.attr('boolean'),
  number: DS.attr('number'),
  text: DS.attr('string'),
  longText: DS.attr('string'),
  date: DS.attr('date'),
  enumeration: DS.attr('integration-examples/edit-form/validation/enumeration'),
  file: DS.attr('file'),

  // This property is for flexberry-lookup component. No inverse relationship here.
  master: DS.belongsTo('integration-examples/edit-form/validation/master', {
    inverse: null,
    async: false
  }),

  // This property is for flexberry-groupedit component.
  details: DS.hasMany('integration-examples/edit-form/validation/detail', {
    inverse: 'aggregator',
    async: false
  }),
});

// Edit form projection.
Model.defineProjection('BaseE', 'integration-examples/edit-form/validation/base', {
  flag: Projection.attr('Flag'),
  number: Projection.attr('Number'),
  text: Projection.attr('Text'),
  longText: Projection.attr('Long text'),
  date: Projection.attr('Date'),
  enumeration: Projection.attr('Enumeration'),
  file: Projection.attr('File'),
  master: Projection.belongsTo('integration-examples/edit-form/validation/master', 'Master', {
    text: Projection.attr('Text', {
      hidden: true
    })
  }, {
    displayMemberPath: 'text'
  }),
  details: Projection.hasMany('integration-examples/edit-form/validation/detail', 'details', {
    flag: Projection.attr('Flag'),
    number: Projection.attr('Number'),
    text: Projection.attr('Text')
  })
});

export default Model;
