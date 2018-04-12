import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo } from 'ember-flexberry-data/utils/attributes';

var Model = EmberFlexberryDataModel.extend({
  // Inversed relationship for ember-flexberry-dummy-suggestion.userVotes.
  // It's not a property for flexberry-lookup component.
  suggestion: DS.belongsTo('ember-flexberry-dummy-suggestion', {
    inverse: 'userVotes',
    async: false
  }),
  voteType: DS.attr('ember-flexberry-dummy-vote-type'),

  // This property is for flexberry-lookup component. No inverse relationship here.
  author: DS.belongsTo('ember-flexberry-dummy-application-user', { inverse: null, async: false }),

  // Model validation rules.
  validations: {
  }
});

// Edit form projection.
Model.defineProjection('VoteE', 'ember-flexberry-dummy-vote', {
  voteType: attr('Vote type'),
  author: belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

export default Model;
