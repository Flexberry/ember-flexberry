import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
let Model = Projection.Model.extend({
  name: DS.attr('string'),
});

Model.defineProjection('VidDepartamentaE', 'ember-flexberry-dummy-vid-departamenta', {
  name: Projection.attr('Название', { index: 0 })
});
Model.defineProjection('VidDepartamentaL', 'ember-flexberry-dummy-vid-departamenta', {
  name: Projection.attr('Название', { index: 0 })
});

export default Model;
