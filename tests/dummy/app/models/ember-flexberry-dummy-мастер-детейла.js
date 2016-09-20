import DS from 'ember-data';
import __BaseModel from './base';
import Proj from 'ember-flexberry-data';
let Model = __BaseModel.extend({
  полеМастераДетейла: DS.attr('boolean'),
  validations: {

  }
});
Model.defineProjection('МастерДетейла', 'ember-flexberry-dummy-мастер-детейла', {
  полеМастераДетейла: Proj.attr('Поле мастера детейла')
});
Model.defineProjection('СписокМастерДетейла', 'ember-flexberry-dummy-мастер-детейла', {
  полеМастераДетейла: Proj.attr('Поле мастера детейла')
});
export default Model;
