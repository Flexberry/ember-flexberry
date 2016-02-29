import Ember from 'ember';

export default Ember.Controller.extend({
session: Ember.inject.service('session'),
  sitemap: {
nodes: [{
        link: 'index',
        title: 'Home',
        children: null
    }, {
        link: null,
        title: 'Objects',
        children: [<%=children%>]
    }]
}
}); 