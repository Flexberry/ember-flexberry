import DS from 'ember-data';
import ApplicationSerializer from './application';

// TODO: ODataSerializer.extend
export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
attrs: {
<%= serializerAttrs %>
},
/**
  * Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey'
});
