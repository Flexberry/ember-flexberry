import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';
var Model = EmberFlexberryDataModel.extend({
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
