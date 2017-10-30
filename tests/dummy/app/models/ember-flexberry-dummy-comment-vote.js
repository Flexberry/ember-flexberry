import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
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
  voteType: Projection.attr('Vote type'),
  applicationUser: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
    name: Projection.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

export default Model;
