import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
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
});

// Edit form projection.
Model.defineProjection('CommentE', 'ember-flexberry-dummy-comment', {
  suggestion: Projection.belongsTo('ember-flexberry-dummy-suggestion', 'Suggestion', {
    address: Projection.attr('Address', {
      hidden: true
    })
  }),
  text: Projection.attr('Text'),
  votes: Projection.attr('Votes'),
  moderated: Projection.attr('Moderated'),
  author: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: Projection.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  userVotes: Projection.hasMany('ember-flexberry-dummy-comment-vote', 'User votes', {
    voteType: Projection.attr('Vote type'),
    applicationUser: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
      name: Projection.attr('Name', {
        hidden: true
      })
    }, {
      displayMemberPath: 'name'
    })
  })
});

// Detail's list projection.
Model.defineProjection('CommentD', 'ember-flexberry-dummy-comment', {
  text: Projection.attr('Text'),
  votes: Projection.attr('Votes'),
  moderated: Projection.attr('Moderated'),
  author: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: Projection.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

export default Model;
