import Ember from 'ember';

export default Ember.Controller.extend({
  sitemap: Ember.computed('i18n.locale', function () {
    // let i18n = this.get('i18n');

    return {
      nodes: [
        {
          link: 'index',
          caption: 'Home',
          title: 'Home',
          children: null
        },
        {
          link: null,
          caption: 'Objects',
          title: 'Objects',
          children: [
<%=children%>
          ]
        }
      ]
    };
  }),
  actions: {
    toggleSidebar() {
      Ember.$('.ui.sidebar').sidebar('toggle');
    }
  }
});
