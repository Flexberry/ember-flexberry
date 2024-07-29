import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo } from 'ember-flexberry-data/utils/attributes';

let Model = EmberFlexberryDataModel.extend({
  name: DS.attr('string'),
  vid: DS.belongsTo('ember-flexberry-dummy-vid-departamenta', { inverse: null, async: false }),
});

Model.defineProjection('DepartamentE', 'ember-flexberry-dummy-departament', {
  name: attr('Название', { index: 0 }),
  vid: belongsTo('ember-flexberry-dummy-vid-departamenta', 'Вид', {

  }, { index: 1, displayMemberPath: 'name' })
});
Model.defineProjection('DepartamentL', 'ember-flexberry-dummy-departament', {
  name: attr('Название', { index: 0 })
});

export default Model;
