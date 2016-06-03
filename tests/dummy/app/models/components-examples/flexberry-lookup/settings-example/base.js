import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
  // This property is for flexberry-lookup component. No inverse relationship here.
  master: DS.belongsTo('components-examples/flexberry-lookup/settings-example/master', {
    inverse: null,
    async: false
  })
});

// Edit form projection.
Model.defineProjection('BaseE', 'components-examples/flexberry-lookup/settings-example/base', {
  master: Proj.belongsTo('components-examples/flexberry-lookup/settings-example/master', 'Master', {
    flag: Proj.attr('Flag', {
      hidden: true
    }),
    date: Proj.attr('Date', {
      hidden: true
    }),
    text: Proj.attr('Text', {
      hidden: true
    })
  }, {
    displayMemberPath: 'text'
  })
});

export default Model;
