import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: {
    showinframe: 'inframe'
  },
  showinframe: null,
  shouldShowInFrame: function() {
    var inFrame = this.get('showinframe');
    return inFrame && inFrame.toLowerCase() === 'true';
  }.property('showinframe'),
  sitemap: {
    nodes: [{
      link: 'index',
      title: 'Home',
      children: null
    }, {
      link: null,
      title: 'Objects',
      children: [{
        link: 'employees',
        title: 'Employees',
        children: null
      }, {
        link: 'orders',
        title: 'Orders',
        children: null
      }]
    }]
  }
});
