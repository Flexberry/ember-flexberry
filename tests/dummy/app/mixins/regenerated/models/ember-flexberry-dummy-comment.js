import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  createTime: DS.attr('date'),
  creator: DS.attr('string'),
  editTime: DS.attr('date'),
  editor: DS.attr('string'),
  text: DS.attr('string'),
  votes: DS.attr('number'),
  moderated: DS.attr('boolean'),
  author: DS.belongsTo('ember-flexberry-dummy-application-user', { inverse: null, async: false }),
  suggestion: DS.belongsTo('ember-flexberry-dummy-suggestion', { inverse: 'comments', async: false, polymorphic: true }),
  userVotes: DS.hasMany('ember-flexberry-dummy-comment-vote', { inverse: 'comment', async: false }),
  getValidations: function () {
    let parentValidations = this._super();
    let thisValidations = {
      author: { presence: true },
      suggestion: { presence: true }
    };
    return Ember.$.extend(true, {}, parentValidations, thisValidations);
  },
  init: function () {
    this.set('validations', this.getValidations());
    this._super.apply(this, arguments);
  }
});
export let defineProjections = function (modelClass) {
  modelClass.defineProjection('AuditView', 'ember-flexberry-dummy-comment', {
    text: Projection.attr('Text'),
    votes: Projection.attr('Votes'),
    moderated: Projection.attr('Moderated'),
    author: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
      name: Projection.attr('Name', { hidden: true })
    }, { displayMemberPath: 'name' }),
    userVotes: Projection.hasMany('ember-flexberry-dummy-comment-vote', 'User votes', {
      voteType: Projection.attr('Vote type'),
      applicationUser: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
        name: Projection.attr('Name', { hidden: true })
      }, { displayMemberPath: 'name' })
    })
  });
  modelClass.defineProjection('CommentD', 'ember-flexberry-dummy-comment', {
    text: Projection.attr('Text'),
    votes: Projection.attr('Votes'),
    moderated: Projection.attr('Moderated'),
    author: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
      name: Projection.attr('Name', { hidden: true })
    }, { displayMemberPath: 'name' }),
    suggestion: Projection.belongsTo('ember-flexberry-dummy-suggestion', '', {

    }, { hidden: true })
  });
  modelClass.defineProjection('CommentE', 'ember-flexberry-dummy-comment', {
    suggestion: Projection.belongsTo('ember-flexberry-dummy-suggestion', 'Address', {
      address: Projection.attr('', { hidden: true })
    }, { hidden: true }),
    text: Projection.attr('Text'),
    votes: Projection.attr('Votes'),
    moderated: Projection.attr('Moderated'),
    author: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
      name: Projection.attr('Name', { hidden: true }),
      phone1: Projection.attr('Phone 1', { hidden: true })
    }, { displayMemberPath: 'name' }),
    userVotes: Projection.hasMany('ember-flexberry-dummy-comment-vote', 'User votes', {
      voteType: Projection.attr('Vote type'),
      applicationUser: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
        name: Projection.attr('Name', { hidden: true })
      }, { displayMemberPath: 'name' }),
      comment: Projection.belongsTo('ember-flexberry-dummy-comment', '', {

      }, { hidden: true })
    })
  });
};
