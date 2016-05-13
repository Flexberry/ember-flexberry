import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-projections';

var Model = BaseModel.extend({
  voteType: DS.attr('ember-flexberry-dummy-vote-type'),
  applicationUser: DS.belongsTo('ember-flexberry-dummy-application-user', { inverse: null, async: false }),
  comment: DS.belongsTo('ember-flexberry-dummy-comment', { inverse: 'userVotes', async: false }),
  validations: {

 }
});

Model.defineProjection('CommentVoteE', 'ember-flexberry-dummy-comment-vote', {
  voteType: Proj.attr('Vote type'),
  applicationUser: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
  name: Proj.attr('Name', { hidden: true })
  })
});

export default Model;
