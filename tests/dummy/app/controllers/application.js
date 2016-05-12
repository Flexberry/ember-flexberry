import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
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
          {
            link: 'ember-flexberry-dummy-application-user-list',
            title: 'Application users',
            children: null
          },
          {
            link: 'ember-flexberry-dummy-comment-list',
            title: 'Comment list',
            children: null
          },
          {
            link: 'ember-flexberry-dummy-localization-list',
            title: 'Localization',
            children: null
          },
          {
            link: 'ember-flexberry-dummy-suggestion-list',
            title: 'Suggestions',
            children: null
          },
          {
            link: 'ember-flexberry-dummy-suggestion-type-list',
            title: 'Suggestion types',
            children: null
          }
        ]
      }
    ]
  },
   actions: {
    toggleSidebar: function(direction) {
      Ember.$('.ui.sidebar').sidebar('toggle');
    }
  }
}
);
