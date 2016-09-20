import DS from 'ember-data';
import __BaseModel from './base';
import Proj from 'ember-flexberry-data';
let Model = __BaseModel.extend({
  полеАгрегатора: DS.attr('string'),
  мастерАгрегатора: DS.belongsTo('ember-flexberry-dummy-мастер-агрегатора', { inverse: null, async: false }),
  русскийДетейл: DS.hasMany('ember-flexberry-dummy-русский-детейл', { inverse: 'русскийАгерегатор', async: false }),
  validations: {
    мастерАгрегатора: { presence: true }
  }
});
Model.defineProjection('РусскийАгерегатор', 'ember-flexberry-dummy-русский-агерегатор', {
  полеАгрегатора: Proj.attr('Поле агрегатора'),
  мастерАгрегатора: Proj.belongsTo('ember-flexberry-dummy-мастер-агрегатора', 'Мастер агрегатора', {
    полеМастераАгрегатора: Proj.attr('', { hidden: true })
  }, { displayMemberPath: 'полеМастераАгрегатора' }),
  русскийДетейл: Proj.hasMany('ember-flexberry-dummy-русский-детейл', 'Русский детейл', {
    полеДетейла: Proj.attr('Поле детейла'),
    перечислениеДетейла: Proj.attr('Перечисление детейла'),
    мастерДетейла: Proj.belongsTo('ember-flexberry-dummy-мастер-детейла', 'Мастер детейла', {
      полеМастераДетейла: Proj.attr('', { hidden: true })
    }, { displayMemberPath: 'полеМастераДетейла' })
  })
});
Model.defineProjection('СписокРусскийАгерегатор', 'ember-flexberry-dummy-русский-агерегатор', {
  полеАгрегатора: Proj.attr('Поле агрегатора'),
  мастерАгрегатора: Proj.belongsTo('ember-flexberry-dummy-мастер-агрегатора', 'Мастер агрегатора', {
    полеМастераАгрегатора: Proj.attr('', { hidden: true })
  }, { displayMemberPath: 'полеМастераАгрегатора' }),
  русскийДетейл: Proj.hasMany('ember-flexberry-dummy-русский-детейл', 'Русский детейл', {
    полеДетейла: Proj.attr('Поле детейла'),
    перечислениеДетейла: Proj.attr('Перечисление детейла'),
    мастерДетейла: Proj.belongsTo('ember-flexberry-dummy-мастер-детейла', 'Мастер детейла', {
      полеМастераДетейла: Proj.attr('', { hidden: true })
    }, { displayMemberPath: 'полеМастераДетейла' })
  })
});
export default Model;
