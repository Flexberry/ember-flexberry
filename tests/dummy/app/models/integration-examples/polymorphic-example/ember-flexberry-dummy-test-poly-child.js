import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

let Model = BaseModel.extend({
  childPole: DS.attr('number'),

  // Model validation rules.
  validations: {

  }
});

// Edit form projection.
Model.defineProjection('TestPolyChildEdit', 'ember-flexberry-dummy-test-poly-child', {
  pole: Proj.attr(''),
  childPole: Proj.attr('')
});

// List form projection.
Model.defineProjection('TestPolyChildList', 'ember-flexberry-dummy-test-poly-child', {
  pole: Proj.attr(''),
  childPole: Proj.attr('')
});

export default Model;
