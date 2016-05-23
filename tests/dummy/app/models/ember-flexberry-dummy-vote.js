import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
  voteType: DS.attr('ember-flexberry-dummy-vote-type'),
  applicationUser: DS.belongsTo('ember-flexberry-dummy-application-user', { inverse: null, async: false }),
  suggestion: DS.belongsTo('ember-flexberry-dummy-suggestion', { inverse: 'userVotes', async: false }),
  validations: {

  }
});

Model.defineProjection('VoteE', 'ember-flexberry-dummy-vote', {
  voteType: Proj.attr('Vote type'),
  applicationUser: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
    name: Proj.attr('Name', { hidden: true })
  })
});

export default Model;
