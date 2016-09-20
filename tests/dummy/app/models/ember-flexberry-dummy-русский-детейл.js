import DS from 'ember-data';
import __BaseModel from './base';
import Proj from 'ember-flexberry-data';
let Model = __BaseModel.extend({
  полеДетейла: DS.attr('number'),
  перечислениеДетейла: DS.attr('ember-flexberry-dummy-перечисление'),
  мастерДетейла: DS.belongsTo('ember-flexberry-dummy-мастер-детейла', { inverse: null, async: false }),
  русскийАгерегатор: DS.belongsTo('ember-flexberry-dummy-русский-агерегатор', { inverse: 'русскийДетейл', async: false }),
  validations: {
    мастерДетейла: { presence: true },
    русскийАгерегатор: { presence: true }
  }
});
Model.defineProjection('РусскийДетейл', 'ember-flexberry-dummy-русский-детейл', {
  полеДетейла: Proj.attr('Поле детейла'),
  перечислениеДетейла: Proj.attr('Перечисление детейла'),
  мастерДетейла: Proj.belongsTo('ember-flexberry-dummy-мастер-детейла', 'Мастер детейла', {
    полеМастераДетейла: Proj.attr('', { hidden: true })
  }, { displayMemberPath: 'полеМастераДетейла' })
});
export default Model;
