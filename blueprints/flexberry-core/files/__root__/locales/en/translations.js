import Ember from 'ember';
import EmberFlexberryTranslations from 'ember-flexberry/locales/en/translations';

<%= importProperties %>

const translations = {};
Ember.$.extend(true, translations, EmberFlexberryTranslations);

Ember.$.extend(true, translations, {
  'models': {
<%= modelsImportedProperties %>,
    'ember-flexberry-dummy-suggestion': {
      'projections': {
        'SuggestionL': {
          'address': {
            'caption': 'Address'
          },
          'text': {
            'caption': 'Text'
          },
          'date': {
            'caption': 'Date'
          },
          'votes': {
            'caption': 'Votes'
          },
          'author': {
            'caption': 'Author',
            'eMail': {
              'caption': 'Email'
            }
          }
        },
        'SuggestionE': {
          'userVotes': {
            'voteType': {
              'caption': 'Vote Type'
            },
            'applicationUser': {
              'caption': 'Application User',
              'eMail': {
                'caption': 'Email'
              }
            }
          }
        }
      }
    }
  },

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
          'user-settings-service-checkbox': {
            'caption': 'Use service to save user settings'
          },
          'language-dropdown': {
            'caption': 'Application language',
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
        'log-service-examples': {
          'caption': 'Log service',
          'title': '',
          'application-log': {
            'caption': 'Application log',
            'title': ''
          },
          'settings-example': {
            'caption': 'Settings example',
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
          'flexberry-file': {
            'caption': 'flexberry-file',
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
            },
            'model-update-example': {
              'caption': 'Model update example',
              'title': ''
            }
          },
          'flexberry-lookup': {
            'caption': 'flexberry-lookup',
            'title': '',
            'settings-example': {
              'caption': 'Settings example',
              'title': ''
            },
            'customizing-window-example': {
              'caption': 'Window customization',
              'title': ''
            },
            'limit-function-example': {
              'caption': 'Limit function example',
              'title': ''
            },
            'lookup-block-form-example': {
              'caption': 'Lookup block form example',
              'title': ''
            },
            'lookup-in-modal': {
              'caption': 'Lookup in modal window',
              'title': ''
            },
            'dropdown-mode-example': {
              'caption': 'Dropdown mode example',
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
          'flexberry-objectlistview': {
            'caption': 'flexberry-objectlistview',
            'title': '',
            'limit-function-example': {
              'caption': 'Limit function example',
              'title': ''
            },
            'settings-example': {
              'caption': 'Settings example',
              'title': ''
            },
            'toolbar-custom-buttons-example': {
              'caption': 'Custom buttons on toolbar',
              'title': ''
            },
            'on-edit-form': {
              'caption': 'Placement on edit form',
              'title': ''
            },
            'custom-filter': {
              'caption': 'Custom filter',
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
          'edit-form': {
            'caption': 'Edit form',
            'title': '',
            'readonly-mode': {
              'caption': 'Readonly mode',
              'title': ''
            },
            'validation': {
              'caption': 'Validation',
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
<%= formsImportedProperties %>,
  },

});

export default translations;
