import ApplicationSerializer from './application';

// TODO: ODataSerializer.extend
export default ApplicationSerializer.extend({
attrs: {
<%= serializerAttrs %>
},
/**
  * Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey'
});
