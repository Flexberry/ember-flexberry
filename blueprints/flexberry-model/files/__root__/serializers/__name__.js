import <%if(parentModelName) {%><%=parentClassName%>Serializer from './<%=parentModelName%>';<%}else{%>__ApplicationSerializer from './application';<%}%>

export default <%if(parentModelName) {%><%=parentClassName%>Serializer<%}else{%>__ApplicationSerializer<%}%>.extend({
  attrs: {
<%= serializerAttrs %>
  },
  /**
  * Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey'
});
