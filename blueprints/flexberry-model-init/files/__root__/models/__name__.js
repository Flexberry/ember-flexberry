<% if (parentModelName) {
%>import Ember from 'ember';<%
}

%>import { buildValidations } from 'ember-cp-validations';<%

if (!parentModelName) { %>
import { Projection, Offline } from 'ember-flexberry-data';<%
} %>

import {
  <% if (parentModelName) { %>defineBaseModel,
  <% } if (projections) { %>defineProjections,
  <% } %>ValidationRules,
  Model as <%= className %>Mixin
} from '../mixins/regenerated/models/<%= name %>';<%

if (parentModelName) { %>

import <%= parentClassName %>Model from <%= (parentExternal ? "set path to '/" : "'./") + parentModelName + "'" %>;
import { ValidationRules as ParentValidationRules } from <%= (parentExternal ? "set path to mixin for '/" : "'../mixins/regenerated/models/") + parentModelName + "'" %>;<%
} %>

const Validations = buildValidations(<%= parentModelName ? 'Ember.$.extend({}, ParentValidationRules, ValidationRules)' : 'ValidationRules' %>, {
  dependentKeys: ['model.i18n.locale'],
});

let Model = <%= parentModelName ? parentClassName : 'Projection.' %>Model.extend(<%= !parentModelName ? 'Offline.ModelMixin, ' : '' %><%= className %>Mixin, Validations, {
});<%

if (parentModelName || projections) { %>
<%
}

if (parentModelName) { %>
defineBaseModel(Model);<%
}
if (projections) { %>
defineProjections(Model);<%
} %>

export default Model;
