import Ember from 'ember';<%
if (model) { %>
import DS from 'ember-data';<%
}

if (validations) { %>
import { validator } from 'ember-cp-validations';<%
}

if (projections) { %>
import { Projection } from 'ember-flexberry-data';<%
}%>

export let Model = Ember.Mixin.create({<%= model %>});

export let ValidationRules = {<%= validations %>};<%

if (parentModelName) { %>

export let defineBaseModel = function (modelClass) {
  modelClass.reopenClass({
    _parentModelName: '<%= parentModelName %>'
  });
};<%
}

if (projections) { %>

export let defineProjections = function (modelClass) {<%= projections %>};<%
} %>
