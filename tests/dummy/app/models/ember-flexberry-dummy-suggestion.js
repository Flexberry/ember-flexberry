import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
  address: DS.attr('string'),
  text: DS.attr('string'),
  votes: DS.attr('number'),
  moderated: DS.attr('boolean'),
  editor: DS.belongsTo('ember-flexberry-dummy-application-user', { inverse: null, async: false }),
  type: DS.belongsTo('ember-flexberry-dummy-suggestion-type', { inverse: null, async: false }),
  author: DS.belongsTo('ember-flexberry-dummy-application-user', { inverse: null, async: false }),
  files: DS.hasMany('ember-flexberry-dummy-suggestion-file', { inverse: 'suggestion', async: false }),
  comments: DS.hasMany('ember-flexberry-dummy-comment', { inverse: 'suggestion', async: false }),
  userVotes: DS.hasMany('ember-flexberry-dummy-vote', { inverse: 'suggestion', async: false }),
  validations: {

  }
});

Model.defineProjection('SuggestionE', 'ember-flexberry-dummy-suggestion', {
  address: Proj.attr('Address'),
  text: Proj.attr('Text'),
  date: Proj.attr('Date'),
  votes: Proj.attr('Votes'),
  moderated: Proj.attr('Moderated'),
  type: Proj.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: Proj.attr('Name', { hidden: true })
  }),
  author: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: Proj.attr('Name', { hidden: true })
  }),
  editor: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Editor', {
    name: Proj.attr('', { hidden: true })
  }),
  files: Proj.hasMany('ember-flexberry-dummy-suggestion-file', 'Files', {
    order: Proj.attr('Order'),
    file: Proj.attr('File')
  }),
  comments: Proj.hasMany('ember-flexberry-dummy-comment', 'Comments', {
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
  }),
  userVotes: Proj.hasMany('ember-flexberry-dummy-vote', 'User votes', {
    voteType: Proj.attr('Vote type'),
    applicationUser: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
      name: Proj.attr('Name', { hidden: true })
    })
  })
});

Model.defineProjection('SuggestionL', 'ember-flexberry-dummy-suggestion', {
  address: Proj.attr('Address'),
  text: Proj.attr('Text'),
  date: Proj.attr('Date'),
  votes: Proj.attr('Votes'),
  moderated: Proj.attr('Moderated'),
  type: Proj.belongsTo('ember-flexberry-dummy-suggestion-type', 'Name', {
    name: Proj.attr('Name')
  }),
  author: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Name', {
    name: Proj.attr('Name')
  }),
  editor: Proj.belongsTo('ember-flexberry-dummy-application-user', '', {
    name: Proj.attr('')
  })
});

export default Model;
