import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  createTime: DS.attr('date'),
  creator: DS.attr('string'),
  editTime: DS.attr('date'),
  editor: DS.attr('string'),
  voteType: DS.attr('ember-flexberry-dummy-vote-type'),
  author: DS.belongsTo('ember-flexberry-dummy-application-user', { inverse: null, async: false }),
  suggestion: DS.belongsTo('ember-flexberry-dummy-suggestion', { inverse: 'userVotes', async: false, polymorphic: true }),
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
  modelClass.defineProjection('AuditView', 'ember-flexberry-dummy-vote', {
    voteType: Projection.attr('Vote type'),
    author: Projection.belongsTo('ember-flexberry-dummy-application-user', '', {
      name: Projection.attr('', { hidden: true })
    }, { displayMemberPath: 'name' })
  });
  modelClass.defineProjection('VoteE', 'ember-flexberry-dummy-vote', {
    voteType: Projection.attr('Vote type'),
    author: Projection.belongsTo('ember-flexberry-dummy-application-user', '', {
      name: Projection.attr('', { hidden: true })
    }, { displayMemberPath: 'name' }),
    suggestion: Projection.belongsTo('ember-flexberry-dummy-suggestion', '', {

    }, { hidden: true })
  });
};
