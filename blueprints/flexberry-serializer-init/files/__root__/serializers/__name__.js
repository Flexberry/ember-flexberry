import { Serializer as <%= className %>Serializer } from
  '../mixins/regenerated/serializers/<%= name %>';
import <%if(parentModelName) {%><%=parentClassName%>Serializer from <%= (parentExternal ? "set path to '" : "'./") + parentModelName %>';<%}else{%>__ApplicationSerializer from './application';<%}%>

export default <%if(parentModelName) {%><%=parentClassName%>Serializer<%}else{%>__ApplicationSerializer<%}%>.extend(<%= className %>Serializer, {
  /**
  * Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey'
});
