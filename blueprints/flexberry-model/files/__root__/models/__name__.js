import DS from 'ember-data';
import <%if(parentModelName) {%><%=parentClasslName%> from './<%=parentModelName%>';<%}else{%>BaseModel from './base';<%}%>
import Proj from 'ember-flexberry-projections';

<%= model %>

<%= projections %>

export default Model;
