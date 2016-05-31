import Ember from 'ember';
import emberFlexberryTranslations from 'ember-flexberry/locales/en/translations';

const translations = {};
Ember.merge(translations, emberFlexberryTranslations);

Ember.merge(translations, {
  'home': {
    'greeting': 'Welcome to ember-flexberry test stand!'
  },

  'header': {
    'toolbar': {
      'menu': {
        'title': 'Menu'
      }
    }
  },

  'site-map': {
    'brand': {
      title: 'Test stand for ember-flexberry'
    },
    'addon-version': {
      'title': 'Addon version {{version}}',
      'link': {
        'title': 'It is version of ember-flexberry addon, which uses in this dummy application ' +
        '(npm version + commit sha). ' +
        'Click to open commit on GitHub.'
      }
    },
    'home': {
      'title': 'Home'
    },
    'application': {
      'title': 'Application'
    },
    'application-users': {
      'title': 'Application users'
    },
    'localizations': {
      'title': 'Localizations'
    },
    'suggestion-types': {
      'title': 'Suggestion types'
    },
    'suggestions': {
      'title': 'Suggestions'
    },
    'components-examples': {
      'title': 'Components examples',
      'flexberry-checkbox': {
        'settings-example': {
          title: 'Settings example'
        }
      },
      'flexberry-dropdown': {
        'settings-example': {
          title: 'Settings example'
        },
        'conditional-render-example': {
          'title': 'Conditional render example'
        }
      },
      'flexberry-menu': {
        'settings-example': {
          title: 'Settings example'
        }
      },
      'flexberry-lookup': {
        'settings-example': {
          title: 'Settings example'
        }
      },
      'flexberry-groupedit': {
        'settings-example': {
          title: 'Settings example'
        }
      }
    }
  },

  'footer': {
    'brand': {
      title: 'Test stand for ember-flexberry'
    },
    'addon-version': {
      'title': 'Addon version {{version}}',
      'link': {
        'title': 'It is version of ember-flexberry addon, which uses in this dummy application ' +
        '(npm version + commit sha). ' +
        'Click to open commit on GitHub.'
      }
    }
  },

  components: {
    'settings-example': {
      'component-template-header': 'Component template',
      'controller-properties-header': 'Controller properties',
      'component-current-settings-header': 'Component current settings values',
      'component-default-settings-header': 'Component default settings values',
      'component-header': 'Component with it\'s current settings applied'
    }
  }
});

export default translations;
