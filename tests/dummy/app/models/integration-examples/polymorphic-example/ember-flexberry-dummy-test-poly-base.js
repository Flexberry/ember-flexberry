import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';

let Model = BaseModel.extend({
  pole: DS.attr('string'),

  // Model validation rules.
  validations: {

  }
});

export default Model;
