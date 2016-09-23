import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
  полеМастераАгрегатора: DS.attr('number'),
  validations: {

  }
});
Model.defineProjection('МастерАгрегатора', 'ember-flexberry-dummy-мастер-агрегатора', {
  полеМастераАгрегатора: Projection.attr('Поле мастера агрегатора')
});
Model.defineProjection('СписокМастерАгрегатора', 'ember-flexberry-dummy-мастер-агрегатора', {
  полеМастераАгрегатора: Projection.attr('Поле мастера агрегатора')
});
export default Model;
