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
          'user-settings-service-checkbox': {
            'caption': 'Use user settings service'
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

    'ember-flexberry-dummy-application-user-edit': {
      'caption': 'Application user',
      'name-caption': 'Name',
      'eMail-caption': 'E-Mail',
      'phone1-caption': 'Phone1',
      'phone2-caption': 'Phone2',
      'phone3-caption': 'Phone3',
      'activated-caption': 'Activated',
      'vK-caption': 'VK',
      'facebook-caption': 'Facebook',
      'twitter-caption': 'Twitter',
      'birthday-caption': 'Birthday',
      'gender-caption': 'Gender',
      'vip-caption': 'VIP',
      'karma-caption': 'Karma',
      'name-validation-message-caption': 'Name is required',
      'eMail-validation-message-caption': 'E-Mail is required'
    },

    'ember-flexberry-dummy-comment-edit': {
      'caption': 'Comment',
      'text-caption': 'Text',
      'votes-caption': 'Votes',
      'moderated-caption': 'Moderated',
      'author-caption': 'Author',
      'userVotes-caption': 'User votes',
      'date-caption': 'Date',
      'author-validation-message-caption': 'Author is required'
    },

    'ember-flexberry-dummy-localization-edit': {
      'caption': 'Localization',
      'name-caption': 'Name',
      'name-validation-message-caption': 'Name is required'
    },

    'ember-flexberry-dummy-suggestion-edit': {
      'caption': 'Suggestion',
      'address-caption': 'Address',
      'text-caption': 'Text',
      'date-caption': 'Date',
      'votes-caption': 'Votes',
      'moderated-caption': 'Moderated',
      'type-caption': 'Type',
      'author-caption': 'Author',
      'editor1-caption': 'Editor',
      'files-caption': 'Files',
      'userVotes-caption': 'User votes',
      'comments-caption': 'Comments',
      'type-validation-message-caption': 'Type is required',
      'author-validation-message-caption': 'Author is required',
      'editor-validation-message-caption': 'Editor is required'
    },

    'ember-flexberry-dummy-suggestion-type-edit': {
      'caption': 'Suggestion type',
      'name-caption': 'Name',
      'moderated-caption': 'Moderated',
      'parent-caption': 'Parent',
      'localized-types-caption': 'Localized types',
      'name-validation-message-caption': 'Name is required'
    },

    'ember-flexberry-dummy-application-user-list': {
      'caption': 'Application users'
    },

    'ember-flexberry-dummy-localization-list': {
      'caption': 'Localizations'
    },

    'ember-flexberry-dummy-suggestion-list': {
      'caption': 'Suggestions'
    },

    'ember-flexberry-dummy-suggestion-type-list': {
      'caption': 'Suggestion types'
    },

    'log-service-examples': {
      'settings-example': {
        'caption': 'Log-service-examples/settings-example',
        'setting-column-header-caption': 'Log service setting',
        'settings-value-column-header-caption': 'Setting current value',
        'throw-exception-button-caption': 'Throw exception',
        'reject-rsvp-promise-button-caption': 'Reject promise',
        'ember-assert-button-caption': 'assert',
        'ember-logger-error-button-caption': 'Error',
        'ember-logger-warn-button-caption': 'Warn',
        'ember-deprecate-button-caption': 'Deprecate',
        'ember-logger-log-button-caption': 'Log',
        'ember-logger-info-button-caption': 'Info',
        'ember-logger-debug-button-caption': 'Debug',
        'throw-exception-button-message': 'Exception thrown',
        'reject-rsvp-promise-button-message': 'Promise rejected',
        'ember-assert-button-message': 'Ember.assert called',
        'ember-logger-error-button-message': 'Ember.Logger.error called',
        'ember-logger-warn-button-message': 'Ember.Logger.warn called',
        'ember-deprecate-button-message': 'Ember.deprecate called',
        'ember-logger-log-button-message': 'Ember.Logger.log called',
        'ember-logger-info-button-message': 'Ember.logger.info called',
        'ember-logger-debug-button-message': 'Ember.Logger.debug called'
      }
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
          'info-message': 'The page template looks like following:' +
            '{{pageTemplate}}' +
            'So, once the value is selected, the component will be rendered as &lt;span&gt;selected value&lt;/span&gt;,<br>' +
            'after that check browser\'s console, it must be free from \"Semantic-UI\" and other errors.'
        }
      },
      'flexberry-field': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-field/settings-example'
        }
      },
      'flexberry-file': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-file/settings-example'
        }
      },
      'flexberry-groupedit': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-groupedit/settings-example'
        },
        'model-update-example': {
          'caption': 'Components-examples/flexberry-groupedit/model-update-example',
          'addDetailButton': 'Add detail',
          'removeDetailButton': 'Remove detail',
        }
      },
      'flexberry-lookup': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-lookup/settings-example'
        },
        'customizing-window-example': {
          'caption': 'Components-examples/flexberry-lookup/customizing-window-example'
        },
        'limit-function-example': {
          'caption': 'Components-examples/flexberry-lookup/limit-function-example'
        },
        'dropdown-mode-example': {
          'caption': 'Components-examples/flexberry-lookup/dropdown-mode-example'
        }
      },
      'flexberry-menu': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-menu/settings-example'
        }
      },
      'flexberry-objectlistview': {
        'limit-function-example': {
          'caption': 'Components-examples/flexberry-objectlistview/limit-function-example'
        },
        'settings-example': {
          'caption': 'Components-examples/flexberry-objectlistview/settings-example'
        },
        'toolbar-custom-buttons-example': {
          'caption': 'Components-examples/flexberry-objectlistview/toolbar-custom-buttons-example',
          'custom-message': 'Hello!',
          'custom-button-name': 'Send hello'
        },
        'on-edit-form': {
          'caption': 'FlexberryObjectlistview custom data sample'
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
      'edit-form': {
        'readonly-mode': {
          'caption': 'Integration-examples/edit-form/readonly-mode',
          'readonly-flag-management-segment-caption': 'Form\'s readonly-mode management',
          'readonly-flag-value-segment-caption': 'Controller\'s \'readonly\' property value',
          'readonly-flag-caption': 'Form is in readonly mode',
          'flag-caption': 'Flag',
          'number-caption': 'Number',
          'text-caption': 'Text',
          'long-text-caption': 'Long text',
          'date-caption': 'Date',
          'time-caption': 'Time',
          'enumeration-caption': 'Enumeration',
          'file-caption': 'File',
          'master-caption': 'Master',
          'master-dropdown-caption': 'Master in dropdown mode'
        },
        'validation': {
          'caption': 'Integration-examples/edit-form/validation',
          'flag-caption': 'Flag',
          'number-caption': 'Number',
          'text-caption': 'Text',
          'long-text-caption': 'Long text',
          'date-caption': 'Date',
          'enumeration-caption': 'Enumeration',
          'file-caption': 'File',
          'master-caption': 'Master'
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
