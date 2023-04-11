import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo } from 'ember-flexberry-data/utils/attributes';

let Model = EmberFlexberryDataModel.extend({
  familiia: DS.attr('string'),
  name: DS.attr('string'),
  dataRozhdeniia: DS.attr('date'),
  departament: DS.belongsTo('ember-flexberry-dummy-departament', { inverse: null, async: false }),
});

Model.defineProjection('SotrudnikE', 'ember-flexberry-dummy-sotrudnik', {
  familiia: attr('Фамилия', { index: 0 }),
  name: attr('Имя', { index: 1 }),
  dataRozhdeniia: attr('Дата', { index: 2 }),
  departament: belongsTo('ember-flexberry-dummy-departament', 'Департамент', {
    vid: belongsTo('ember-flexberry-dummy-vid-departamenta', '', {

    }, { index: 4 })
  }, { index: 3, displayMemberPath: 'name' })
});
Model.defineProjection('SotrudnikL', 'ember-flexberry-dummy-sotrudnik', {
  familiia: attr('Фамилия', { index: 0 }),
  name: attr('Имя', { index: 1 }),
  dataRozhdeniia: attr('Дата', { index: 2 })
});

export default Model;
