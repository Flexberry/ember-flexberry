import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
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

  // Model validation rules.
  validations: {
  }
});

// Edit form projection.
Model.defineProjection('CommentVoteE', 'ember-flexberry-dummy-comment-vote', {
  voteType: Proj.attr('Vote type'),
  applicationUser: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

export default Model;
