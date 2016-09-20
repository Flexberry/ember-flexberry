import DS from 'ember-data';
import __BaseModel from './base';
import Proj from 'ember-flexberry-data';

let Model = __BaseModel.extend({
  полеМастераАгрегатора: DS.attr('number'),
  validations: {

  }
});
Model.defineProjection('МастерАгрегатора', 'ember-flexberry-dummy-мастер-агрегатора', {
  полеМастераАгрегатора: Proj.attr('Поле мастера агрегатора')
});
Model.defineProjection('СписокМастерАгрегатора', 'ember-flexberry-dummy-мастер-агрегатора', {
  полеМастераАгрегатора: Proj.attr('Поле мастера агрегатора')
});
export default Model;
