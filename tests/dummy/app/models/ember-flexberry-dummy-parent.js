import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
var Model = Projection.Model.extend({
  name: DS.attr('string'),
  eMail: DS.attr('string'),
  birthday: DS.attr('date'),
  validations: {
    name: {
      presence: {
        message: 'Name is required'
      }
    },
    eMail: {
      presence: {
        message: 'User email is required'
      }
    }
  }
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
