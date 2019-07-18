/**
  @module ember-flexberry
*/

import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

let Model = Projection.Model.extend({
  user: DS.attr('string'),
  module: DS.attr('string'),
  name: DS.attr('string'),
  value: DS.attr('string'),
});

Model.defineProjection('AdvLimitE', 'flexberry-adv-limit', {
  user: Projection.attr('string'),
  module: Projection.attr('string'),
  name: Projection.attr('string'),
  value: Projection.attr('string'),
});

/**
  Adv limit model.

  @class FlexberryAdvLimitModel
  @extends BaseModel
*/
export default Model;
