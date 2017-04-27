import { OfflineSerializer as <%= className %>Serializer } from '../mixins/regenerated/serializers/<%= name %>-offline';
import <%if(parentModelName) {%><%=parentClassName %>Serializer from './<%=parentModelName%>-offline';<%}else {%>__ApplicationSerializer from './application-offline';<%}%>

export default <%if(parentModelName) {%><%=parentClassName%>Serializer<%}else{%>__ApplicationSerializer<%}%>.extend(<%= className %>Serializer, {
});
