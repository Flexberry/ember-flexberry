import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, hasMany } from 'ember-flexberry-data/utils/attributes';

var Model = EmberFlexberryDataModel.extend({
  togglerExampleMasterProperty: DS.attr('string'),
  togglerExampleDetail: DS.hasMany('ember-flexberry-dummy-toggler-example-detail', {
    inverse: 'togglerExampleMaster',
    async: false
  }),

  // Model validation rules.
  validations: {
    togglerExampleMasterProperty: {
      presence: {
        message: 'Master property is required'
      }
    }
  }
});

Model.defineProjection('TogglerExampleMasterE', 'ember-flexberry-dummy-toggler-example-master', {
  togglerExampleMasterProperty: attr('Наименование мастера'),
  togglerExampleDetail: hasMany('ember-flexberry-dummy-toggler-example-detail', '', {
    togglerExampleDetailProperty: attr('Наименование детейла')
  })
});
Model.defineProjection('TogglerExampleMasterL', 'ember-flexberry-dummy-toggler-example-master', {
  togglerExampleMasterProperty: attr('Наименование мастера'),
});

export default Model;
