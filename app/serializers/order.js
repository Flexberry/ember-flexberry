import DS from 'ember-data';
import ApplicationSerializer from 'prototype-ember-cli-application/serializers/application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    employeeID: { serialize: 'id', deserialize: 'record' }
  },

  // Раньше можно было определить primaryKey как функцию, и задать один алгоритм для всех сериализаторов.
  // Щас либо по отдельности для каждого задавать это свойство, либо переопределять функции,
  // в которых задействован primaryKey (нужно иметь ввиду, что Ember Data в бете).
  primaryKey: 'OrderID'
});
