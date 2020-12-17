import {
  <% if (parentModelName) { %>defineBaseModel,
  <% } if (projections) { %>defineProjections,
  <% } %>ValidationRules,
  Model as <%= className %>Mixin
} from '../mixins/regenerated/models/<%= name %>';
<%
if (parentModelName) { %>
import Ember from 'ember';
import <%= parentClassName %>Model from <%= (parentExternal ? "set path to '/" : "'./") + parentModelName + "'" %>;
import { ValidationRules as ParentValidationRules } from <%= (parentExternal ? "set path to mixin for '/" : "'../mixins/regenerated/models/") + parentModelName + "'" %>;<%
}
else { %>
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model-without-validation';
import OfflineModelMixin from 'ember-flexberry-data/mixins/offline-model';<%
} %>
import { buildValidations } from 'ember-cp-validations';

const Validations = buildValidations(<%= parentModelName ? 'Ember.$.extend({}, ParentValidationRules, ValidationRules)' : 'ValidationRules' %>, {
  dependentKeys: ['model.i18n.locale'],
});

let Model = <%= parentModelName ? parentClassName : 'EmberFlexberryData' %>Model.extend(<%= !parentModelName ? 'OfflineModelMixin, ' : '' %><%= className %>Mixin, Validations, {
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
