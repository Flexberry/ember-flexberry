import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';

var Model = EmberFlexberryDataModel.extend({
  togglerExampleDetailProperty: DS.attr('string'),
  togglerExampleMaster: DS.belongsTo('ember-flexberry-dummy-toggler-example-master', {
    inverse: 'togglerExampleDetail',
    async: false
  }),

  // Model validation rules.
  validations: {
    togglerExampleDetailProperty: {
      presence: {
        message: 'Deteil property is required'
      }
    }
  }

});

Model.defineProjection('TogglerExampleDetailE', 'ember-flexberry-dummy-toggler-example-detail', {
  togglerExampleDetailProperty: attr('Наименование детейла')
});
Model.defineProjection('TogglerExampleDetailL', 'ember-flexberry-dummy-toggler-example-detail', {
  togglerExampleDetailProperty: attr('Наименование детейла')
});

export default Model;
