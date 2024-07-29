/**
  @module ember-flexberry
*/

import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';

let Model = EmberFlexberryDataModel.extend({
  user: DS.attr('string'),
  module: DS.attr('string'),
  name: DS.attr('string'),
  value: DS.attr('string'),
});

Model.defineProjection('AdvLimitE', 'flexberry-adv-limit', {
  user: attr('string'),
  module: attr('string'),
  name: attr('string'),
  value: attr('string'),
});

/**
  Adv limit model.

  @class FlexberryAdvLimitModel
  @extends BaseModel
*/
export default Model;
