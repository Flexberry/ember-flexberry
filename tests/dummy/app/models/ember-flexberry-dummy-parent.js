import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  name: validator('presence', {
    presence: true,
    message: 'Name is required',
  }),
  eMail: validator('presence', {
    presence: true,
    message: 'User email is required',
  }),
});

let Model = EmberFlexberryDataModel.extend(Validations, {
  name: DS.attr('string'),
  eMail: DS.attr('string'),
  birthday: DS.attr('date'),
});
Model.defineProjection('parentE', 'ember-flexberry-dummy-parent', {
  name: attr('Name'),
  eMail: attr('E-mail'),
  birthday: attr('Birthday')
});
Model.defineProjection('parentL', 'ember-flexberry-dummy-parent', {
  name: attr('Name'),
  eMail: attr('E-mail'),
  birthday: attr('Birthday')
});
export default Model;
