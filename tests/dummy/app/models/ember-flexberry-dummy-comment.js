import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-projections';

var Model = BaseModel.extend({
  text: DS.attr('string'),
  votes: DS.attr('number'),
  moderated: DS.attr('boolean'),
  author: DS.belongsTo('ember-flexberry-dummy-application-user', { inverse: null, async: false }),
  suggestion: DS.belongsTo('ember-flexberry-dummy-suggestion', { inverse: 'comments', async: false }),
  userVotes: DS.hasMany('ember-flexberry-dummy-comment-vote', { inverse: 'comment', async: false }),
  validations: {

 }
});

Model.defineProjection('CommentD', 'ember-flexberry-dummy-comment', {
  text: Proj.attr('Text'),
  votes: Proj.attr('Votes'),
  moderated: Proj.attr('Moderated'),
  author: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: Proj.attr('Name', { hidden: true })
  }),
  userVotes: Proj.hasMany('ember-flexberry-dummy-comment-vote', 'User votes', {
    voteType: Proj.attr('Vote type'),
    applicationUser: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
      name: Proj.attr('Name', { hidden: true })
    })
  })
});

Model.defineProjection('CommentE', 'ember-flexberry-dummy-comment', {
  text: Proj.attr('Text'),
  votes: Proj.attr('Votes'),
  moderated: Proj.attr('Moderated'),
  suggestion: Proj.belongsTo('ember-flexberry-dummy-suggestion', 'Suggestion', {
    address: Proj.attr('', { hidden: true })
  }),
  author: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: Proj.attr('Name', { hidden: true })
  }),
  userVotes: Proj.hasMany('ember-flexberry-dummy-comment-vote', 'User votes', {
    voteType: Proj.attr('Vote type'),
    applicationUser: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
    name: Proj.attr('Name', { hidden: true })
  })
  })
});

Model.defineProjection('CommentL', 'ember-flexberry-dummy-comment', {
  text: Proj.attr('Text'),
  votes: Proj.attr('Votes'),
  moderated: Proj.attr('Moderated'),
  suggestion: Proj.belongsTo('ember-flexberry-dummy-suggestion', 'Address', {
    address: Proj.attr('Address')
  }),
  author: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Name', {
    name: Proj.attr('Name')
  }),
  userVotes: Proj.hasMany('ember-flexberry-dummy-comment-vote', 'User votes', {
    voteType: Proj.attr('Vote type'),
    applicationUser: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
      name: Proj.attr('Name', { hidden: true })
    })
  })
});

export default Model;
