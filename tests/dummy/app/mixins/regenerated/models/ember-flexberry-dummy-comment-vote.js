import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  createTime: DS.attr('date'),
  creator: DS.attr('string'),
  editTime: DS.attr('date'),
  editor: DS.attr('string'),
  voteType: DS.attr('ember-flexberry-dummy-vote-type'),
  applicationUser: DS.belongsTo('ember-flexberry-dummy-application-user', { inverse: null, async: false }),
  comment: DS.belongsTo('ember-flexberry-dummy-comment', { inverse: 'userVotes', async: false }),
  getValidations: function () {
    let parentValidations = this._super();
    let thisValidations = {
      applicationUser: { presence: true },
      comment: { presence: true }
    };
    return Ember.$.extend(true, {}, parentValidations, thisValidations);
  },
  init: function () {
    this.set('validations', this.getValidations());
    this._super.apply(this, arguments);
  }
});
export let defineProjections = function (modelClass) {
  modelClass.defineProjection('AuditView', 'ember-flexberry-dummy-comment-vote', {
    voteType: Projection.attr('Vote type'),
    applicationUser: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
      name: Projection.attr('Name', { hidden: true })
    }, { displayMemberPath: 'name' })
  });
  modelClass.defineProjection('CommentVoteE', 'ember-flexberry-dummy-comment-vote', {
    voteType: Projection.attr('Vote type'),
    applicationUser: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
      name: Projection.attr('Name', { hidden: true })
    }, { displayMemberPath: 'name' }),
    comment: Projection.belongsTo('ember-flexberry-dummy-comment', '', {

    }, { hidden: true })
  });
};
