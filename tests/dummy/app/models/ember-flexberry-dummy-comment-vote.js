import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo } from 'ember-flexberry-data/utils/attributes';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  applicationUser: validator('presence', {
    presence: true,
    message: 'ApplicationUser is required',
  }),
});

let Model = EmberFlexberryDataModel.extend(Validations, {
  // Inversed relationship for ember-flexberry-dummy-comment.userVotes.
  // It's not a property for flexberry-lookup component.
  comment: DS.belongsTo('ember-flexberry-dummy-comment', {
    inverse: 'userVotes',
    async: false
  }),
  voteType: DS.attr('ember-flexberry-dummy-vote-type'),

  // This property is for flexberry-lookup component. No inverse relationship here.
  applicationUser: DS.belongsTo('ember-flexberry-dummy-application-user', {
    inverse: null,
    async: false
  }),
});

// Edit form projection.
Model.defineProjection('CommentVoteE', 'ember-flexberry-dummy-comment-vote', {
  voteType: attr('Vote type'),
  applicationUser: belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

export default Model;
