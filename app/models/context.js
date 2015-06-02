import DS from 'ember-data';

export default DS.Model.extend({
  username: DS.attr('string'),
  sitemap: DS.attr(),
  perPage: DS.attr('number')
});
