import Ember from 'ember';

export default Ember.Controller.extend({
  sitemap: Ember.computed('i18n.locale', function () {
    let i18n = this.get('i18n');

    return {
      nodes: [
        {
          link: 'index',
          caption: i18n.t('forms.application.sitemap.index.caption'),
          title: i18n.t('forms.application.sitemap.index.title'),
          children: null
        },
        {
          link: null,
          caption: i18n.t('forms.application.sitemap.application.caption'),
          title: i18n.t('forms.application.sitemap.application.title'),
          children: [<%=children%>]
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
