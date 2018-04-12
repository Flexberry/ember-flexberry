import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
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

let Model = Projection.Model.extend(Validations, {
  name: DS.attr('string'),
  eMail: DS.attr('string'),
  birthday: DS.attr('date'),
});
Model.defineProjection('parentE', 'ember-flexberry-dummy-parent', {
  name: Projection.attr('Name'),
  eMail: Projection.attr('E-mail'),
  birthday: Projection.attr('Birthday')
});
Model.defineProjection('parentL', 'ember-flexberry-dummy-parent', {
  name: Projection.attr('Name'),
  eMail: Projection.attr('E-mail'),
  birthday: Projection.attr('Birthday')
});
export default Model;
