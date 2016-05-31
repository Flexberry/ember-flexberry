import Ember from 'ember';

export default Ember.Controller.extend({
  sitemap: {
    nodes: [{
      link: 'index',
      title: 'Home',
      children: null
    }, {
      link: null,
      title: 'Application',
      children: [{
        link: 'ember-flexberry-dummy-application-user-list',
        title: 'Application users',
        children: null
      }, {
        link: 'ember-flexberry-dummy-localization-list',
        title: 'Localization',
        children: null
      }, {
        link: 'ember-flexberry-dummy-suggestion-type-list',
        title: 'Suggestion types',
        children: null
      }, {
        link: 'ember-flexberry-dummy-suggestion-list',
        title: 'Suggestions',
        children: null
      }]
    }, {
      link: null,
      title: 'Components examples',
      children: [{
        link: null,
        title: 'flexberry-dropdown',
        children: [{
          link: 'components-examples/flexberry-dropdown/settings-example',
          title: 'Settings example',
          children: null
        }, {
          link: 'components-examples/flexberry-dropdown/conditional-render-example',
          title: 'Conditional render example',
          children: null
        }]
      }, {
        link: null,
        title: 'flexberry-menu',
        children: [{
          link: 'components-examples/flexberry-menu/settings-example',
          title: 'Settings example',
          children: null
        }]
      }, {
        link: null,
        title: 'flexberry-lookup',
        children: [{
          link: 'components-examples/flexberry-lookup/settings-example',
          title: 'Settings example',
          children: null
        }]
      }, {
        link: null,
        title: 'flexberry-groupedit',
        children: [{
          link: 'components-examples/flexberry-groupedit/settings-example',
          title: 'Settings example',
          children: null
        }]
      }]
    }]
  },
  locales: ['ru', 'en'],
  currentLocale: Ember.computed('i18n.locale', function() {
    return this.get('i18n.locale');
  }),
  actions: {
    toggleSidebar: function(direction) {
      Ember.$('.ui.sidebar').sidebar('toggle');
    },
    onLocaleChange(newLocale) {
      this.get('i18n').set('locale', newLocale);
    }
  }
});
