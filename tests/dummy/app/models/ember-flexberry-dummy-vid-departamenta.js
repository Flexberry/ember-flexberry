import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';

let Model = EmberFlexberryDataModel.extend({
  name: DS.attr('string'),
});

Model.defineProjection('VidDepartamentaE', 'ember-flexberry-dummy-vid-departamenta', {
  name: attr('Название', { index: 0 })
});
Model.defineProjection('VidDepartamentaL', 'ember-flexberry-dummy-vid-departamenta', {
  name: attr('Название', { index: 0 })
});

export default Model;
