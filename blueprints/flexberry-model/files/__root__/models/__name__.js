import DS from 'ember-data';
import <%if(parentModelName) {%><%=parentClasslName%> from './<%=parentModelName%>';<%}else{%>BaseModel from 'ember-flexberry/models/base';<%}%>
import Proj from 'ember-flexberry-projections';

<%= model %>

<%= projections %>

export default Model;
