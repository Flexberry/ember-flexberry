import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
let Model = Projection.Model.extend({
  familiia: DS.attr('string'),
  name: DS.attr('string'),
  dataRozhdeniia: DS.attr('date'),
  departament: DS.belongsTo('ember-flexberry-dummy-departament', { inverse: null, async: false }),
});

Model.defineProjection('SotrudnikE', 'ember-flexberry-dummy-sotrudnik', {
  familiia: Projection.attr('Фамилия', { index: 0 }),
  name: Projection.attr('Имя', { index: 1 }),
  dataRozhdeniia: Projection.attr('Дата', { index: 2 }),
  departament: Projection.belongsTo('ember-flexberry-dummy-departament', 'Департамент', {
    vid: Projection.belongsTo('ember-flexberry-dummy-vid-departamenta', '', {

    }, { index: 4 })
  }, { index: 3, displayMemberPath: 'name' })
});
Model.defineProjection('SotrudnikL', 'ember-flexberry-dummy-sotrudnik', {
  familiia: Projection.attr('Фамилия', { index: 0 }),
  name: Projection.attr('Имя', { index: 1 }),
  dataRozhdeniia: Projection.attr('Дата', { index: 2 })
});

export default Model;
