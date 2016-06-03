import Ember from 'ember';

export default Ember.Controller.extend({
  sitemap: {
    nodes: [
      {
        link: 'index',
        title: 'Home',
        children: null
      },
      {
        link: null,
        title: 'Objects',
        children: [
<%=children%>
        ]
      }
    ]
  },
  actions: {
    toggleSidebar: function () {
      Ember.$('.ui.sidebar').sidebar('toggle');
    }
  }
});
