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
            'caption': 'Адрес'
          },
          'text': {
            'caption': 'Текст'
          },
          'date': {
            'caption': 'Дата'
          },
          'votes': {
            'caption': 'Голоса'
          },
          'author': {
            'caption': 'Автор',
            'eMail': {
              'caption': 'Почта'
            }
          }
        },
        'SuggestionE': {
          'address': {
            'caption': 'Адрес'
          },
          'userVotes': {
            'voteType': {
              'caption': 'Тип голосования'
            },
            'applicationUser': {
              'caption': 'Пользователь',
              'eMail': {
                'caption': 'Почта'
              }
            }
          }
        }
      }
    }
  },

  'application-name': 'Тестовый стенд ember-flexberry',

  'forms': {
    'loading': {
      'spinner-caption': 'Данные загружаются, пожалуйста подождите...'
    },
    'index': {
      'greeting': 'Добро пожаловать на тестовый стенд ember-flexberry!'
    },

    'application': {
      'header': {
        'menu': {
          'sitemap-button': {
            'caption': '',
            'title': 'Меню'
          },
          'user-settings-service-checkbox': {
            'caption': 'Использовать сервис сохранения пользовательских настроек'
          },
          'language-dropdown': {
            'caption': 'Язык приложения',
            'placeholder': 'Выберите язык'
          }
        }
      },

      'footer': {
        'application-name': 'Тестовый стенд ember-flexberry',
        'application-version': {
          'caption': 'Версия аддона {{version}}',
          'title': 'Это версия аддона ember-flexberry, которая сейчас используется в этом тестовом приложении ' +
          '(версия npm-пакета + хэш коммита). ' +
          'Кликните, чтобы перейти на GitHub.'
        }
      },

      'sitemap': {
        'application-name': {
          'caption': 'Тестовый стенд ember-flexberry',
          'title': ''
        },
        'application-version': {
          'caption': 'Версия аддона {{version}}',
          'title': 'Это версия аддона ember-flexberry, которая сейчас используется в этом тестовом приложении ' +
          '(версия npm-пакета + хэш коммита). ' +
          'Кликните, чтобы перейти на GitHub.'
        },
        'index': {
          'caption': 'Главная',
          'title': ''
        },
        'application': {
          'caption': 'Приложение',
          'title': '',
          'application-users': {
            'caption': 'Пользователи приложения',
            'title': ''
          },
          'localizations': {
            'caption': 'Локализация',
            'title': ''
          },
          'suggestion-types': {
            'caption': 'Типы предложений',
            'title': ''
          },
          'suggestions': {
            'caption': 'Предложения',
            'title': ''
          }
        },
        'log-service-examples': {
          'caption': 'Сервис логирования',
          'title': '',
          'application-log': {
            'caption': 'Лог приложения',
            'title': ''
          },
          'settings-example': {
            'caption': 'Пример работы с настройками',
            'title': ''
          }
        },
        'components-examples': {
          'caption': 'Примеры компонентов',
          'title': '',
          'flexberry-checkbox': {
            'caption': 'flexberry-checkbox',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            }
          },
          'flexberry-datepicker': {
            'caption': 'flexberry-datepicker',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            }
          },
          'flexberry-dropdown': {
            'caption': 'flexberry-dropdown',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            },
            'conditional-render-example': {
              'caption': 'Пример условного рендеринга',
              'title': ''
            }
          },
          'flexberry-field': {
            'caption': 'flexberry-field',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            }
          },
          'flexberry-file': {
            'caption': 'flexberry-file',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            }
          },
          'flexberry-groupedit': {
            'caption': 'flexberry-groupedit',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            },
            'model-update-example': {
              'caption': 'Обновление модели',
              'title': ''
            }
          },
          'flexberry-lookup': {
            'caption': 'flexberry-lookup',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            },
            'customizing-window-example': {
              'caption': 'Настройка окна',
              'title': ''
            },
            'limit-function-example': {
              'caption': 'Функция ограничения',
              'title': ''
            },
            'lookup-block-form-example': {
              'caption': 'Лукап в блочной форме',
              'title': ''
            },
            'lookup-in-modal': {
              'caption': 'Лукап в модальном окне',
              'title': ''
            },
            'dropdown-mode-example': {
              'caption': 'Режим dropdown',
              'title': ''
            }
          },
          'flexberry-menu': {
            'caption': 'flexberry-menu',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            }
          },
          'flexberry-objectlistview': {
            'caption': 'flexberry-objectlistview',
            'title': '',
            'limit-function-example': {
              'caption': 'Функция ограничения',
              'title': ''
            },
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            },
            'toolbar-custom-buttons-example': {
              'caption': 'Пользовательские кнопки',
              'title': ''
            },
            'on-edit-form': {
              'caption': 'Размещение на форме редактирования',
              'title': ''
            },
            'custom-filter': {
              'caption': 'Настройка фильтра',
              'title': ''
            }
          },
          'flexberry-simpledatetime': {
            'caption': 'flexberry-simpledatetime',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            }
          },
          'flexberry-textarea': {
            'caption': 'flexberry-textarea',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            }
          },
          'flexberry-textbox': {
            'caption': 'flexberry-textbox',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            }
          },
          'flexberry-toggler': {
            'caption': 'flexberry-toggler',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            }
          }
        },
        'integration-examples': {
          'caption': 'Примеры интеграции',
          'title': '',
          'edit-form': {
            'caption': 'Форма редактирования',
            'title': '',
            'readonly-mode': {
              'caption': 'Режим только для чтения',
              'title': ''
            },
            'validation': {
              'caption': 'Валидация',
              'title': ''
            }
          }
        }
      }
    },

    'edit-form': {
      'save-success-message-caption': 'Сохранение завершилось успешно',
      'save-success-message': 'Объект сохранен',
      'save-error-message-caption': 'Ошибка сохранения',
      'delete-success-message-caption': 'Удаление завершилось успешно',
      'delete-success-message': 'Объект удален',
      'delete-error-message-caption': 'Ошибка удаления'
    },
<%= formsImportedProperties %>,
  },

});

export default translations;
