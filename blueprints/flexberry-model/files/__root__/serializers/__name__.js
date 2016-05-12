import <%if(parentModelName) {%><%=parentClasslName%>Serializer from './<%=parentModelName%>';<%}else{%>__ApplicationSerializer from './application';<%}%>

export default <%if(parentModelName) {%><%=parentClasslName%>Serializer<%}else{%>__ApplicationSerializer<%}%>.extend({
attrs: {
<%= serializerAttrs %>
},
/**
  * Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey'
});
