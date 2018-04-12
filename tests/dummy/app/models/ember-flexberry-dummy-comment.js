import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo, hasMany } from 'ember-flexberry-data/utils/attributes';

var Model = EmberFlexberryDataModel.extend({
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
  suggestion: belongsTo('ember-flexberry-dummy-suggestion', 'Suggestion', {
    address: attr('Address', {
      hidden: true
    })
  }),
  text: attr('Text'),
  votes: attr('Votes'),
  moderated: attr('Moderated'),
  author: belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  userVotes: hasMany('ember-flexberry-dummy-comment-vote', 'User votes', {
    voteType: attr('Vote type'),
    applicationUser: belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
      name: attr('Name', {
        hidden: true
      })
    }, {
      displayMemberPath: 'name'
    })
  })
});

// Detail's list projection.
Model.defineProjection('CommentD', 'ember-flexberry-dummy-comment', {
  text: attr('Text'),
  votes: attr('Votes'),
  moderated: attr('Moderated'),
  author: belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

export default Model;
