import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
  suggestion: DS.belongsTo('ember-flexberry-dummy-suggestion', {
    inverse: 'comments',
    async: false
  }),
  text: DS.attr('string'),
  votes: DS.attr('number'),
  moderated: DS.attr('boolean'),

  // This property is for flexberry-lookup component. No inverse relationship here.
  author: DS.belongsTo('ember-flexberry-dummy-application-user', {
    inverse: null,
    async: false
  }),

  // This property is for flexberry-groupedit component.
  // Inverse relationship is necessary here.
  userVotes: DS.hasMany('ember-flexberry-dummy-comment-vote', {
    inverse: 'comment',
    async: false
  }),

  // Model validation rules.
  validations: {
    author: {
      presence: {
        message: 'Author is required'
      }
    }
  }
});

// Edit form projection.
Model.defineProjection('CommentE', 'ember-flexberry-dummy-comment', {
  suggestion: Proj.belongsTo('ember-flexberry-dummy-suggestion', 'Suggestion', {
    address: Proj.attr('Address', {
      hidden: true
    })
  }),
  text: Proj.attr('Text'),
  votes: Proj.attr('Votes'),
  moderated: Proj.attr('Moderated'),
  author: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  userVotes: Proj.hasMany('ember-flexberry-dummy-comment-vote', 'User votes', {
    voteType: Proj.attr('Vote type'),
    applicationUser: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
      name: Proj.attr('Name', {
        hidden: true
      })
    }, {
      displayMemberPath: 'name'
    })
  })
});

// Detail's list projection.
Model.defineProjection('CommentD', 'ember-flexberry-dummy-comment', {
  text: Proj.attr('Text'),
  votes: Proj.attr('Votes'),
  moderated: Proj.attr('Moderated'),
  author: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

export default Model;
