import Ember from 'ember';

import emberFlexberryTranslations from 'ember-flexberry/locales/en/translations';

import emberFlexberryDummySuggestionModel from './models/ember-flexberry-dummy-suggestion';
import emberFlexberryDummySuggestionTypeModel from './models/ember-flexberry-dummy-suggestion-type';
import emberFlexberryDummyApplicationUserModel from './models/ember-flexberry-dummy-application-user';
import emberFlexberryDummyLocalizationModel from './models/ember-flexberry-dummy-localization';
import emberFlexberryDummyCommentModel from './models/ember-flexberry-dummy-comment';
import emberFlexberryDummySuggestionFileModel from './models/ember-flexberry-dummy-suggestion-file';
import componentsExampleGroupeditDetailModel from './models/components-examples/flexberry-groupedit/shared/detail';
import componentsExampleEditFormReadonlyModeDetailModel from './models/components-examples/edit-form/readonly-mode/detail';
import integrationExampleEditFormReadonlyModeDetailModel from './models/integration-examples/edit-form/readonly-mode/detail';
import integrationExampleEditFormValidationBaseModel from './models/integration-examples/edit-form/validation/base';

const translations = {};
Ember.$.extend(true, translations, emberFlexberryTranslations);

Ember.$.extend(true, translations, {

  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  models: {
    'ember-flexberry-dummy-suggestion': emberFlexberryDummySuggestionModel,
    'ember-flexberry-dummy-suggestion-type': emberFlexberryDummySuggestionTypeModel,
    'components-examples/flexberry-groupedit/shared/detail': componentsExampleGroupeditDetailModel,
    'components-examples/edit-form/readonly-mode/detail': componentsExampleEditFormReadonlyModeDetailModel,
    'integration-examples/edit-form/readonly-mode/detail': integrationExampleEditFormReadonlyModeDetailModel,
    'integration-examples/edit-form/validation/base': integrationExampleEditFormValidationBaseModel,
    'ember-flexberry-dummy-application-user': emberFlexberryDummyApplicationUserModel,
    'ember-flexberry-dummy-localization': emberFlexberryDummyLocalizationModel,
    'ember-flexberry-dummy-comment': emberFlexberryDummyCommentModel,
    'ember-flexberry-dummy-suggestion-file': emberFlexberryDummySuggestionFileModel
  },

  'application-name': 'Test stand for ember-flexberry',

  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
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
            'title': 'Menu'
          },
          'user-settings-service-checkbox': {
            'caption': 'Use service to save user settings'
          },
          'show-menu': {
            'caption': 'Show menu'
          },
          'hide-menu': {
            'caption': 'Hide menu'
          },
          'language-dropdown': {
            'caption': 'Application language',
            'placeholder': 'Choose language'
          },
          'suggestion-file': {
            'caption': 'Suggestion file',
            'title': ''
          }
        },
        'login': {
          'caption': 'Login'
        },
        'logout': {
          'caption': 'Logout'
        }
      },

      'delete-rows-modal-dialog': {
        'confirm-button-caption': 'Delete',
        'cancel-button-caption': 'Cancel',
        'delete-row-caption': 'Delete row ?',
        'delete-rows-caption': 'Delete selected rows ?',
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
          },
          'multi': {
            'caption': 'Multi list',
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
          },
          'clear-log-form': {
            'caption': 'Clear log',
            'title': ''
          }
        },
        'lock': {
          'caption': 'Blocking',
          'title': 'Block list',
        },
        'components-examples': {
          'caption': 'Components examples',
          'title': '',
          'flexberry-button': {
            'caption': 'flexberry-button',
            'title': '',
            'settings-example': {
              'caption': 'Settings example',
              'title': ''
            }
          },
          'flexberry-checkbox': {
            'caption': 'flexberry-checkbox',
            'title': '',
            'settings-example': {
              'caption': 'Settings example',
              'title': ''
            }
          },
          'flexberry-ddau-checkbox': {
            'caption': 'flexberry-ddau-checkbox',
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
            },
            'empty-value-example': {
              'caption': 'Example dropdown with empty value',
              'title': ''
            },
            'items-example': {
              'caption': 'Example values of the items',
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
            },
            'flexberry-file-in-modal': {
              'caption': 'Flexberry file in modal window',
              'title': ''
            },
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
            },
            'custom-buttons-example': {
              'caption': 'Custom user buttons example',
              'title': ''
            },
            'configurate-row-example': {
              'caption': 'Configurate rows',
              'title': ''
            },
            'groupedit-with-lookup-with-computed-atribute': {
              'caption': 'Computed attributes LookUp  in GroupEdit',
              'title': ''
            },
            'readonly-columns-by-configurate-row-example': {
              'caption': 'GrouptEdit readonly columns by configurateRow',
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
            'compute-autocomplete': {
              'caption': 'Example lookup with compute autocomplete',
              'title': ''
            },
            'numeric-autocomplete': {
              'caption': 'Example lookup with autocomplete and dropdwon with numeric displayAttributeName',
              'title': ''
            },
            'hierarchy-olv-in-lookup-example': {
              'caption': 'Example hierarchical OLV in lookup',
              'title': ''
            },
            'limit-function-example': {
              'caption': 'Limit function example',
              'title': ''
            },
            'autofill-by-limit-example': {
              'caption': 'Example autofillByLimit',
              'title': ''
            },
            'limit-function-through-dynamic-properties-example': {
              'caption': 'Limit function with dinamic properties example',
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
            },
            'default-ordering-example': {
              'caption': 'Default ordering example',
              'title': ''
            },
            'autocomplete-order-example': {
              'caption': 'Example for autocomplete with order',
              'title': ''
            },
            'user-settings-example': {
              'caption': 'Example for modal dialog olv user settiings',
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
            'inheritance-models': {
              'caption': 'Inheritance models',
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
            'list-on-editform': {
              'caption': 'Placement of the list of detail of the master on the editing form',
              'title': ''
            },
            'custom-filter': {
              'caption': 'Custom filter',
              'title': ''
            },
            'edit-form-with-detail-list': {
              'caption': 'List example',
              'title': ''
            },
            'hierarchy-example': {
              'caption': 'Hierarchy example',
              'title': ''
            },
            'hierarchy-paging-example': {
              'caption': 'Hierarchy with paginig example',
              'title': ''
            },
            'configurate-rows': {
              'caption': 'Configurate rows',
              'title': ''
            },
            'selected-rows': {
              'caption': 'Selected rows',
              'title': ''
            },
            'downloading-files-from-olv-list': {
              'caption': 'Downloading files from the list',
              'title': ''
            },
            'object-list-view-resize': {
              'caption': 'Columns markup',
              'title': ''
            },
            'return-from-ediform': {
              'title': 'Return from edit-form to list-form with queryParameter',
              'return-button': 'Return'
            },
            'lock-services-editor-view-list': {
              'caption': 'Example displaying username which the object was locked',
              'title': ''
            },
            'limited-text-size-example': {
              'caption': 'Limited text size example',
              'title': ''
            },
          },
          'flexberry-simpledatetime': {
            'caption': 'flexberry-simpledatetime',
            'title': '',
            'settings-example': {
              'caption': 'Settings example',
              'title': ''
            }
          },
          'flexberry-text-cell': {
            'caption': 'flexberry-text-cell',
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
            },
            'settings-example-inner': {
              'caption': 'Settings example (toggler in a toggler)',
              'title': ''
            },
            'ge-into-toggler-example': {
              'caption': 'GroupEdit into toggler example',
            }
          },
          'flexberry-tree': {
            'caption': 'flexberry-tree',
            'title': '',
            'settings-example': {
              'caption': 'Settings example',
              'title': ''
            }
          },
          'ui-message': {
            'caption': 'ui-message',
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
        },
        'user-setting-forms': {
          'caption': 'User settings',
          'title': '',
          'user-setting-delete': {
            'caption': 'Settings deletion',
            'title': ''
          }
        },
        'components-acceptance-tests': {
          'caption': 'Acceptance tests',
          'title': '',
        },
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

    'list-form': {
      'delete-success-message-caption': 'Delete operation succeed',
      'delete-success-message': 'Object deleted',
      'delete-error-message-caption': 'Delete operation failed',
      'load-success-message-caption': 'Load operation succeed',
      'load-success-message': 'Object loaded',
      'load-error-message-caption': 'Load operation failed'
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

    'ember-flexberry-dummy-comment-vote-edit': {
      'caption': 'User Vote',
      'voteType-caption': 'Vote type',
      'applicationUser-caption': 'Application user',
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
      'editor-validation-message-caption': 'Editor is required',
      'readonly-groupedit-with-lookup-with-computed-atribute-field': 'Readonly for LookUp "Application User" in GroupEdit "User votes"',
      'limit-function-groupedit-with-lookup-with-computed-atribute-field': 'Limitations for LookUp "Application User" in GroupEdit "User votes"'
    },

    'ember-flexberry-dummy-suggestion-file-list': {
      'header': 'Suggestion files',
    },

    'ember-flexberry-dummy-suggestion-file-edit': {
      'header': 'Suggestion file',
      'suggestion': 'Suggestion',
      'order': 'Order',
      'file': 'File',
    },

    'ember-flexberry-dummy-toggler-example-master-e': {
      'caption': 'Master',
      'toggler-example-master-property-caption': 'Master property',
      'toggler-example-deteil-property-caption': 'Deteil'
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

    'ember-flexberry-dummy-multi-list': {
      'caption': 'Multi list form',
      'multi-edit-form': 'Multi list edit form'
    },

    'log-service-examples': {
      'settings-example': {
        'caption': 'Log service. Settings example',
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
        'ember-logger-warn-button-message': 'Ember.warn called',
        'ember-deprecate-button-message': 'Ember.deprecate called',
        'ember-logger-log-button-message': 'Ember.Logger.log called',
        'ember-logger-info-button-message': 'Ember.Logger.info called',
        'ember-logger-debug-button-message': 'Ember.debug called'
      }
    },

    'new-platform-flexberry-services-lock-list': {
      'change-user-name': 'Change user name',
      'open-read-only': 'Open read only',
      'unlock-object': 'Unlock object',
      'enter-new-user-name': 'Enter new user name:',
    },

    'components-examples': {
      'flexberry-button': {
        'settings-example': {
          'caption': 'Settings example for flexberry-button'
        }
      },
      'flexberry-checkbox': {
        'settings-example': {
          'caption': 'Flexberry-checkbox. Settings example'
        }
      },
      'flexberry-ddau-checkbox': {
        'settings-example': {
          'caption': 'Settings example for flexberry-ddau-checkbox'
        }
      },
      'flexberry-datepicker': {
        'settings-example': {
          'caption': 'Flexberry-datepicker. Settings example'
        }
      },
      'flexberry-dropdown': {
        'settings-example': {
          'caption': 'Flexberry-dropdown. Settings example'
        },
        'conditional-render-example': {
          'caption': 'Flexberry-dropdown. Conditional render example',
          'info-caption': 'Use case description',
          'info-message': 'The page template looks like following:' +
            '{{pageTemplate}}' +
            'So, once the value is selected, the component will be rendered as &lt;span&gt;selected value&lt;/span&gt;,<br>' +
            'after that check browser\'s console, it must be free from \'Semantic-UI\' and other errors.'
        },
        'empty-value-example': {
          'caption': 'Flexberry-dropdown. Example dropdown with empty value',
          'message': 'When you open the form in the Dropdown should not be empty. Should be: Enum value №2.',
          'enumeration-caption': 'Dropdown with empty value',
        },
        'items-example': {
          'caption': 'Flexberry-dropdown. Example values of the items',
          'checkbox-caption': 'use the itemsObject'
        }
      },
      'flexberry-field': {
        'settings-example': {
          'caption': 'Flexberry-field. Settings example'
        }
      },
      'flexberry-file': {
        'settings-example': {
          'caption': 'Flexberry-file. Settings example'
        }
      },
      'flexberry-groupedit': {
        'settings-example': {
          'caption': 'Flexberry-groupedit. Settings example'
        },
        'custom-buttons-example': {
          'caption': 'Flexberry-groupedit. Custom buttons example',
          'custom-message': 'Hello!',
          'custom-button-name': 'Send hello',
          'disable-button-name': 'Disable adjacent button',
          'enable-button-name': 'Enable adjacent button',
        },
        'configurate-row-example': {
          'caption': 'Flexberry-groupedit. Configurate rows',
          'confirm': 'Are you sure ?'
        },
        'model-update-example': {
          'caption': 'Flexberry-groupedit. Model update example',
          'addDetailButton': 'Add detail',
          'removeDetailButton': 'Remove detail',
        }
      },
      'flexberry-lookup': {
        'settings-example': {
          'caption': 'Flexberry-lookup. Settings example'
        },
        'customizing-window-example': {
          'caption': 'Flexberry-lookup. Window customization',
          'titleLookup': 'Master'
        },
        'compute-autocomplete': {
          'caption': 'Example lookup with compute autocomplete',
          'title': ''
        },
        'numeric-autocomplete': {
          'caption': 'Example lookup with autocomplete and dropdwon with numeric displayAttributeName',
          'title': ''
        },
        'hierarchy-olv-in-lookup-example': {
          'caption': 'Flexberry-lookup. Example hierarchical OLV in lookup',
          'titleLookup': 'Master'
        },
        'limit-function-example': {
          'caption': 'Flexberry-lookup. Limit function example',
          'titleLookup': 'Master'
        },
        'limit-function-through-dynamic-properties-example': {
          'caption': 'Flexberry-lookup. Limit function through dynamic properties example',
          'titleLookup': 'Master',
          'captionFirstLimitFunction': 'Limit function №1',
          'captionSecondLimitFunction': 'Limit function №2',
          'captionClearLimitFunction': 'Clear limit function'
        },
        'autofill-by-limit-example': {
          'caption': 'Flexberry-lookup. Example autofillByLimit in lookup',
          'titleLookup': 'Master'
        },
        'lookup-block-form-example': {
          'caption': 'Flexberry-lookup. Lookup block form example'
        },
        'lookup-in-modal': {
          'caption': 'Flexberry-lookup. Lookup in modal window',
          'captionModal': 'Custom modal window №1',
          'captionModalDouble': 'Custom modal window №2',
          'buttonModal': 'Modal window №1',
          'buttonModalDouble': 'Modal window №2',
          'buttonClose': 'Close'
        },
        'dropdown-mode-example': {
          'caption': 'Flexberry-lookup. Dropdown mode example'
        },
        'default-ordering-example': {
          'caption': 'Flexberry-lookup. Default ordering example',
          'titleLookup': 'Master'
        },
        'autocomplete-order-example': {
          'caption': 'Flexberry-lookup. Example for autocomplete with order',
          'titleLookup': 'Master'
        },
      },
      'flexberry-menu': {
        'settings-example': {
          'caption': 'Flexberry-menu. Settings example',
          'titleIcon1': 'Left side aligned icon',
          'titleIcon2': 'Right side aligned icon',
          'titleIcon3': 'Submenu',
          'titleIcon4': 'Row buttons'
        }
      },
      'flexberry-objectlistview': {
        'limit-function-example': {
          'caption': 'Flexberry-objectlistview. Limit function example',
          'captionFirstLimitFunction': 'Limit function №1',
          'captionSecondLimitFunction': 'Limit function №2',
          'captionClearLimitFunction': 'Clear limit function'
        },
        'inheritance-models': {
          'caption': 'Flexberry-objectlistview. Inheritance models example',
          'message': 'Сheck projection in OLV. (ProjectionE=ProjectionL)',
          'projectionBase': 'Projection \'Base\': Name, E-mail, Birthday',
          'projectionSuccessorPhone': 'Projection \'Successor phone\': Name, Phone1, Phone2, Phone3',
          'projectionSuccessorSoc': 'Projection \'Successor social network\': Name, VK, Facebook, Twitter',
          'buttonRoot': 'Base',
          'buttonSuccessorPhone': 'Successor phone',
          'buttonSuccessorSoc': 'Successor social network',
          'name-caption': 'Name',
          'eMail-caption': 'E-Mail',
          'phone1-caption': 'Phone1',
          'phone2-caption': 'Phone2',
          'phone3-caption': 'Phone3',
          'vK-caption': 'VK',
          'facebook-caption': 'Facebook',
          'twitter-caption': 'Twitter',
          'birthday-caption': 'Birthday'
        },
        'settings-example': {
          'caption': 'Flexberry-objectlistview. Settings example'
        },
        'limited-text-size-example': {
          'caption': 'Flexberry-objectlistview. Limited text size example'
        },
        'toolbar-custom-buttons-example': {
          'caption': 'Flexberry-objectlistview. Custom buttons on toolbar',
          'custom-message': 'Hello!',
          'custom-button-name': 'Send hello',
          'disable-button-name': 'Disable adjacent button',
          'enable-button-name': 'Enable adjacent button',
          'custom-row-button-name': 'Custom button in row',
        },
        'on-edit-form': {
          'caption': 'Flexberry-objectlistview. FlexberryObjectlistview on edit form',
          'add-button-name': 'Добавить'
        },
        'list-on-editform': {
          'caption': 'List of children Type'
        },
        'custom-filter': {
          'caption': 'Flexberry-objectlistview. Custom filter'
        },
        'hierarchy-example': {
          'caption': 'Flexberry-objectlistview. Hierarchy example'
        },
        'hierarchy-paging-example': {
          'caption': 'Flexberry-objectlistview. Hierarchy paging example'
        },
        'configurate-rows': {
          'caption': 'Flexberry-objectlistview. Configurate rows'
        },
        'selected-rows': {
          'caption': 'Flexberry-objectlistview. Setected rows'
        },
        'downloading-files-from-olv-list': {
          'caption': 'Flexberry-objectlistview. Downloading files from the list'
        },
        'object-list-view-resize': {
          'caption': 'Flexberry-objectlistview. Columns markup',
          'button-сaption': 'Add',
          'title': ''
        },
        'lock-services-editor-view': {
          'blocked-by': 'Blocked by user',
        },
      },
      'flexberry-simpleolv': {
        'limit-function-example': {
          'caption': 'Flexberry-simpleolv. Limit function example',
          'captionFirstLimitFunction': 'Limit function №1',
          'captionSecondLimitFunction': 'Limit function №2',
          'captionClearLimitFunction': 'Clear limit function'
        },
        'settings-example': {
          'caption': 'Flexberry-simpleolv. Settings example'
        },
        'toolbar-custom-buttons-example': {
          'caption': 'Flexberry-simpleolv. Custom buttons on toolbar',
          'custom-message': 'Hello!',
          'custom-button-name': 'Send hello'
        },
        'on-edit-form': {
          'caption': 'Flexberry-simpleolv. FlexberryObjectlistview custom data sample'
        },
        'custom-filter': {
          'caption': 'Flexberry-simpleolv. Custom filter',
          'addObjects-button': 'Add objects'
        },
        'configurate-rows': {
          'caption': 'Flexberry-simpleolv. Configurate rows'
        },
        'selected-rows': {
          'caption': 'Flexberry-simpleolv. Setected rows'
        }
      },
      'flexberry-simpledatetime': {
        'settings-example': {
          'caption': 'Flexberry-simpledatetime. Settings example'
        }
      },
      'flexberry-text-cell': {
        'settings-example': {
          'caption': 'Flexberry-text-cell. Settings example'
        }
      },
      'flexberry-textarea': {
        'settings-example': {
          'caption': 'Flexberry-textarea. Settings example'
        }
      },
      'flexberry-textbox': {
        'settings-example': {
          'caption': 'Flexberry-textbox. Settings example'
        }
      },
      'flexberry-toggler': {
        'settings-example': {
          'caption': 'Flexberry-toggler. Settings example',
          'togglerContent': 'Some expandable/collapsable content'
        },
        'settings-example-inner': {
          'caption': 'Flexberry-toggler. Settings example',
          'togglerContent': 'Some expandable/collapsable content',
          'innerTogglerContent': 'Some expandable/collapsable content in an inner toggler'
        },
        'ge-into-toggler-example': {
          'caption': 'Flexberry-toggler. GroupEdit into toggler example'
        }
      },
      'flexberry-tree': {
        'settings-example': {
          'caption': 'Settings example for flexberry-tree',
          'json-tree-tab-caption': 'JSON-object-defined tree',
          'json-tree-latest-clicked-node-caption': 'Latest clicked tree node settings',
          'json-tree-latest-clicked-node-placeholder': 'Click on any tree node to display it\'s settings'
        }
      },
      'ui-message': {
        'settings-example': {
          'caption': 'Ui-message. Settings example',
          'captionMessage': 'Result of checking',
          'messageError': 'Operation is failed',
          'messageSuccess': 'Operation is success',
          'messageWarning': 'Partially implemented',
          'messageInfo': 'Note!'
        }
      }
    },
    'integration-examples': {
      'edit-form': {
        'readonly-mode': {
          'caption': 'Integration examples. Readonly mode',
          'readonly-flag-management-segment-caption': 'Form\'s readonly-mode management',
          'readonly-flag-value-segment-caption': 'Controller\'s \'readonly\' property value',
          'readonly-flag-caption': 'Form is in readonly mode',
          'flag-caption': 'Flag',
          'number-caption': 'Number',
          'text-caption': 'Text',
          'long-text-caption': 'Long text',
          'date-caption': 'Date',
          'time-caption': 'Date + Time',
          'enumeration-caption': 'Enumeration',
          'file-caption': 'File',
          'master-caption': 'Master',
          'master-dropdown-caption': 'Master in dropdown mode'
        },
        'validation': {
          'caption': 'Integration examples. Validation',
          'summary-caption': 'Validation errors:',
          'flag-caption': 'Flag',
          'number-caption': 'Number',
          'text-caption': 'Text',
          'long-text-caption': 'Long text',
          'date-caption': 'Date',
          'enumeration-caption': 'Enumeration',
          'file-caption': 'File',
          'master-caption': 'Master',
          'details-caption': 'Details'
        }
      }
    },
    'user-setting-forms': {
      'user-setting-delete': {
        'caption': 'User settings',
        'all-del-button-name': 'Delete all!',
        'message': 'Settings were removed'
      }
    }
  },

  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
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
