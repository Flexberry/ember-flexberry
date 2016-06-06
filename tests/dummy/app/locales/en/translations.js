import Ember from 'ember';
import emberFlexberryTranslations from 'ember-flexberry/locales/en/translations';

const translations = {};
Ember.$.extend(true, translations, emberFlexberryTranslations);

Ember.$.extend(true, translations, {
  'application-name': 'Test stand for ember-flexberry',

  'forms': {
    'loading': {
      'spinner-caption': 'Loading stuff, please have a cold beer...'
    },
    'index': {
      'greeting': 'Welcome to ember-flexberry test stand!'
    },

    'application': {
      'header': {
        'menu': {
          'sitemap-button': {
            'caption': '',
            'title': 'Menu'
          },
          'language-dropdown': {
            'placeholder': 'Choose language'
          }
        }
      },

      'footer': {
        'application-name': 'Test stand for ember-flexberry',
        'application-version': {
          'caption': 'Addon version {{version}}',
          'title': 'It is version of ember-flexberry addon, which uses in this dummy application ' +
            '(npm version + commit sha). ' +
            'Click to open commit on GitHub.'
        }
      },

      'sitemap': {
        'application-name': {
          'caption': 'Test stand for ember-flexberry',
          'title': ''
        },
        'application-version': {
          'caption': 'Addon version {{version}}',
          'title': 'It is version of ember-flexberry addon, which uses in this dummy application ' +
            '(npm version + commit sha). ' +
            'Click to open commit on GitHub.'
        },
        'index': {
          'caption': 'Home',
          'title': ''
        },
        'application': {
          'caption': 'Application',
          'title': '',
          'application-users': {
            'caption': 'Application users',
            'title': ''
          },
          'localizations': {
            'caption': 'Localizations',
            'title': ''
          },
          'suggestion-types': {
            'caption': 'Suggestion types',
            'title': ''
          },
          'suggestions': {
            'caption': 'Suggestions',
            'title': ''
          }
        },
        'components-examples': {
          'caption': 'Components examples',
          'title': '',
          'flexberry-checkbox': {
            'caption': 'flexberry-checkbox',
            'title': '',
            'settings-example': {
              'caption': 'Settings example',
              'title': ''
            }
          },
          'flexberry-datepicker': {
            'caption': 'flexberry-datepicker',
            'title': '',
            'settings-example': {
              'caption': 'Settings example',
              'title': ''
            }
          },
          'flexberry-dropdown': {
            'caption': 'flexberry-dropdown',
            'title': '',
            'settings-example': {
              'caption': 'Settings example',
              'title': ''
            },
            'conditional-render-example': {
              'caption': 'Conditional render example',
              'title': ''
            }
          },
          'flexberry-field': {
            'caption': 'flexberry-field',
            'title': '',
            'settings-example': {
              'caption': 'Settings example',
              'title': ''
            }
          },
          'flexberry-groupedit': {
            'caption': 'flexberry-groupedit',
            'title': '',
            'settings-example': {
              'caption': 'Settings example',
              'title': ''
            }
          },
          'flexberry-lookup': {
            'caption': 'flexberry-lookup',
            'title': '',
            'settings-example': {
              'caption': 'Settings example',
              'title': ''
            }
          },
          'flexberry-menu': {
            'caption': 'flexberry-menu',
            'title': '',
            'settings-example': {
              'caption': 'Settings example',
              'title': ''
            }
          },
          'flexberry-simpledatetime': {
            'caption': 'flexberry-simpledatetime',
            'title': '',
            'settings-example': {
              'caption': 'Settings example',
              'title': ''
            }
          },
          'flexberry-textarea': {
            'caption': 'flexberry-textarea',
            'title': '',
            'settings-example': {
              'caption': 'Settings example',
              'title': ''
            }
          },
          'flexberry-textbox': {
            'caption': 'flexberry-textbox',
            'title': '',
            'settings-example': {
              'caption': 'Settings example',
              'title': ''
            }
          },
          'flexberry-toggler': {
            'caption': 'flexberry-toggler',
            'title': '',
            'settings-example': {
              'caption': 'Settings example',
              'title': ''
            }
          }
        },
        'integration-examples': {
          'caption': 'Integration examples',
          'title': '',
          'validations': {
            'caption': 'Validations',
            'title': '',
            'different-components-integration': {
              'caption': 'Different components integration',
              'title': ''
            }
          }
        }
      }
    },

    'edit-form': {
      'save-success-message-caption': 'Save operation succeed',
      'save-success-message': 'Object saved',
      'save-error-message-caption': 'Save operation failed',
      'delete-success-message-caption': 'Delete operation succeed',
      'delete-success-message': 'Object deleted',
      'delete-error-message-caption': 'Delete operation failed'
    },

    'ember-flexberry-dummy-application-user-edit': {
      'caption':'Application user',
      'name-caption':'Name',
      'eMail-caption':'E-Mail',
      'phone1-caption':'Phone1',
      'phone2-caption':'Phone2',
      'phone3-caption':'Phone3',
      'activated-caption':'Activated',
      'vK-caption':'VK',
      'facebook-caption':'Facebook',
      'twitter-caption':'Twitter',
      'birthday-caption':'Birthday',
      'gender-caption':'Gender',
      'vip-caption':'VIP',
      'karma-caption':'Karma'
    },

    'ember-flexberry-dummy-comment-edit':{
      'caption':'Comment',
      'text-caption':'Text',
      'votes-caption':'Votes',
      'moderated-caption':'Moderated',
      'author-caption': 'Author',
      'userVotes-caption':'User votes',
      'date-caption': 'Date'
    },

    'ember-flexberry-dummy-localization-edit':{
      'caption':'Localization',
      'name-caption':'Name'
    },

    'ember-flexberry-dummy-suggestion-edit':{
      'caption':'Suggestion',
      'address-caption':'Address',
      'text-caption':'Text',
      'date-caption':'Date',
      'votes-caption':'Votes',
      'moderated-caption':'Moderated',
      'type-caption':'Type',
      'author-caption':'Author',
      'editor-caption':'Editor',
      'files-caption':'Files',
      'userVotes-caption':'User votes',
      'comments-caption':'Comments'
    },

    'ember-flexberry-dummy-suggestion-type-edit':{
      'caption':'Suggestion type',
      'name-caption':'Name',
      'moderated-caption':'Moderated',
      'parent-caption':'Parent',
      'localizedTypes-caption':'Localized types'
    },

    'ember-flexberry-dummy-application-user-list':{
      'caption':'Application users'
    },

    'ember-flexberry-dummy-localization-list':{
      'caption':'Localizations'
    },

    'ember-flexberry-dummy-suggestion-list':{
      'caption':'Suggestions'
    },

    'ember-flexberry-dummy-suggestion-type-list':{
      'caption':'Suggestion types'
    },

    'components-examples': {
      'flexberry-checkbox': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-checkbox/settings-example'
        }
      },
      'flexberry-datepicker': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-datepicker/settings-example'
        }
      },
      'flexberry-dropdown': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-dropdown/settings-example'
        },
        'conditional-render-example': {
          'caption': 'Components-examples/flexberry-dropdown/conditional-render-example',
          'info-caption': 'Use case description',
          'info-message': 'The page template looks like following:<br>' +
            '{{pageTemplate}}' +
            '<br>' +
            'So, once the value is selected, the component will be rendered as &lt;span&gt;selected value&lt;/span&gt;,<br>' +
            'after that check browser\'s console, it must be free from \"Semantic-UI\" and other errors.'
        }
      },
      'flexberry-field': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-field/settings-example'
        }
      },
      'flexberry-groupedit': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-groupedit/settings-example'
        }
      },
      'flexberry-lookup': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-lookup/settings-example'
        }
      },
      'flexberry-menu': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-menu/settings-example'
        }
      },
      'flexberry-simpledatetime': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-simpledatetime/settings-example'
        }
      },
      'flexberry-textarea': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-textarea/settings-example'
        }
      },
      'flexberry-textbox': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-textbox/settings-example'
        }
      },
      'flexberry-toggler': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-toggler/settings-example'
        }
      }
    },
    'integration-examples': {
      'validations': {
        'different-components-integration': {
          'caption': 'Integration-examples/validations/different-components-integration'
        }
      }
    }
  },

  'components': {
    'settings-example': {
      'component-template-caption': 'Component template',
      'controller-properties-caption': 'Controller properties',
      'component-current-settings-caption': 'Component current settings values',
      'component-default-settings-caption': 'Component default settings values',
      'component-with-applied-settings-caption': 'Component with it\'s current settings applied'
    }
  }
});

export default translations;
