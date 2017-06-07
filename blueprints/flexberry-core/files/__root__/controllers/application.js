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
        }, <%=children%>
      ]
    };
  }),
  actions: {
    toggleSidebar() {
      Ember.$('.ui.sidebar').sidebar('toggle');
      if (Ember.$('.inverted.vertical.menu').hasClass('visible')) {
        Ember.$('.sidebar.icon.text-menu-1').removeClass('hidden-menu');
        Ember.$('.sidebar.icon.text-menu-2').addClass('hidden-menu');
      } else {
        Ember.$('.sidebar.icon.text-menu-1').addClass('hidden-menu');
        Ember.$('.sidebar.icon.text-menu-2').removeClass('hidden-menu');
      }

      Ember.$('.ui.sidebar').sidebar({
        onHide: function() {
          Ember.$('.sidebar.icon.text-menu-1').removeClass('hidden-menu');
          Ember.$('.sidebar.icon.text-menu-2').addClass('hidden-menu');
        }
      });
    }
  }
});
