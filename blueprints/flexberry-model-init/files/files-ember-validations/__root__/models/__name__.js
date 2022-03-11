import {
  <% if (namespace) { %>defineNamespace,
  <% } if (parentModelName) { %>defineBaseModel,
  <% } if (projections) { %>defineProjections,
  <% } %>Model as <%= className %>Mixin
} from '../mixins/regenerated/models/<%= name %>';
<%
if (parentModelName) { %>
import <%= parentClassName %>Model from <%= (parentExternal ? "set path to '/" : "'./") + parentModelName + "'" %>;<%
}
else { %>
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';<%
}
if (!parentModelName && additionalModelMixin && additionalModelMixinImport) { %>
import <%= additionalModelMixin %> from <%= additionalModelMixinImport %>; <%
} %>

let Model = <%= parentModelName ? parentClassName : 'EmberFlexberryData' %>Model.extend(<%= additionalModelMixin%><%= additionalModelMixin ? ', ' : '' %><%= className %>Mixin, {
});<%

if (namespace || parentModelName || projections) { %>
<%
}

if (namespace) { %>
defineNamespace(Model);<%
}
if (parentModelName) { %>
defineBaseModel(Model);<%
}
if (projections) { %>
defineProjections(Model);<%
} %>

export default Model;
