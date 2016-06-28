import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

let Model = BaseModel.extend({
  selfPole: DS.attr('string'),
  relation: DS.belongsTo('ember-flexberry-dummy-test-poly-base', { inverse: null, async: false, polymorphic: true }),

  // Model validation rules.
  validations: {
    relation: { presence: true }
  }
});

// Edit form projection.
Model.defineProjection('TestPolyEdit', 'ember-flexberry-dummy-test-poly', {
  selfPole: Proj.attr(''),
  relation: Proj.belongsTo('ember-flexberry-dummy-test-poly-base', '', {
    pole: Proj.attr('')
  }, { hidden: true })
});

// List form projection.
Model.defineProjection('TestPolyList', 'ember-flexberry-dummy-test-poly', {
  selfPole: Proj.attr('')
});

export default Model;
