import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
  // This property is for flexberry-groupedit component.
  // Inverse relationship is necessary here.
  details: DS.hasMany('components-examples/flexberry-groupedit/shared/detail', {
    inverse: 'aggregator',
    async: false
  })
});

// Edit form projection.
Model.defineProjection('AggregatorE', 'components-examples/flexberry-groupedit/shared/aggregator', {
  details: Proj.hasMany('components-examples/flexberry-groupedit/shared/detail', 'Details', {
    flag: Proj.attr('Flag'),
    text: Proj.attr('Text'),
    date: Proj.attr('Date'),
    enumeration: Proj.attr('Enumeration'),
    file: Proj.attr('File'),
    master: Proj.belongsTo('components-examples/flexberry-groupedit/shared/master', 'Master', {
      text: Proj.attr('Text', {
        hidden: true
      })
    }, {
      displayMemberPath: 'text'
    })
  })
});

// Projection for testing displaying changes on GE after manual model update.
Model.defineProjection('ManualModelUpdateView', 'components-examples/flexberry-groupedit/shared/aggregator', {
  details: Proj.hasMany('components-examples/flexberry-groupedit/shared/detail', 'Details', {
    flag: Proj.attr('Flag'),
    text: Proj.attr('Text'),
    date: Proj.attr('Date'),
    enumeration: Proj.attr('Enumeration'),
    file: Proj.attr('File'),
    master: Proj.belongsTo('components-examples/flexberry-groupedit/shared/master', 'Master', {
      text: Proj.attr('Text', {
        hidden: true
      })
    }, {
      displayMemberPath: 'text'
    })
  })
});

export default Model;
