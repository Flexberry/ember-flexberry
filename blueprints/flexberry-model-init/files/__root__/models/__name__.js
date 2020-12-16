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
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import OfflineModelMixin from 'ember-flexberry-data/mixins/offline-model';<%
} %>

let Model = <%= parentModelName ? parentClassName : 'EmberFlexberryData' %>Model.extend(<%= !parentModelName ? 'OfflineModelMixin, ' : '' %><%= className %>Mixin, {
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
