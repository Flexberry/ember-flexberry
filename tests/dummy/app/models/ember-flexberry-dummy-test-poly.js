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
  selfPole: Proj.attr('Self Pole'),
  relation: Proj.belongsTo('ember-flexberry-dummy-test-poly-base', 'Pole', {
    pole: Proj.attr('Pole')
  }, { displayMemberPath: 'pole' })
});

// List form projection.
Model.defineProjection('TestPolyList', 'ember-flexberry-dummy-test-poly', {
  selfPole: Proj.attr('SelfPole'),
  relation: Proj.belongsTo('ember-flexberry-dummy-test-poly-base', 'Pole', {
    pole: Proj.attr('Pole')
  }, { displayMemberPath: 'pole' })
});

export default Model;
