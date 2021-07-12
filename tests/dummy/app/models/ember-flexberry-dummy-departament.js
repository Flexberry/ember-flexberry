import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
let Model = Projection.Model.extend({
  name: DS.attr('string'),
  vid: DS.belongsTo('ember-flexberry-dummy-vid-departamenta', { inverse: null, async: false }),
});

Model.defineProjection('DepartamentE', 'ember-flexberry-dummy-departament', {
  name: Projection.attr('Название', { index: 0 }),
  vid: Projection.belongsTo('ember-flexberry-dummy-vid-departamenta', 'Вид', {

  }, { index: 1, displayMemberPath: 'name' })
});
Model.defineProjection('DepartamentL', 'ember-flexberry-dummy-departament', {
  name: Projection.attr('Название', { index: 0 })
});

export default Model;
