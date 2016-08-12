import Ember from 'ember';
import emberFlexberryTranslations from 'ember-flexberry/locales/ru/translations';

const translations = {};
Ember.$.extend(true, translations, emberFlexberryTranslations);

Ember.$.extend(true, translations, {
  'models': {
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
            },
            'items-example': {
              'caption': 'Пример элементов значений',
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

    'ember-flexberry-dummy-application-user-edit': {
      'caption': 'Пользователь приложения',
      'name-caption': 'Имя',
      'eMail-caption': 'E-mail',
      'phone1-caption': 'Номер телефона 1',
      'phone2-caption': 'Номер телефона 2',
      'phone3-caption': 'Номер телефона 3',
      'activated-caption': 'Учетная запись активирована',
      'vK-caption': 'VK',
      'facebook-caption': 'Facebook',
      'twitter-caption': 'Twitter',
      'birthday-caption': 'Дата рождения',
      'gender-caption': 'Пол',
      'vip-caption': 'VIP',
      'karma-caption': 'Карма',
      'name-validation-message-caption': 'Заполните поле "Имя"',
      'eMail-validation-message-caption': 'Заполните поле "E-mail"'
    },

    'ember-flexberry-dummy-comment-edit': {
      'caption': 'Комментарий',
      'text-caption': 'Текст комментария',
      'votes-caption': 'Количество голосов',
      'moderated-caption': 'Одобрено',
      'author-caption': 'Автор',
      'userVotes-caption': 'Голоса пользователей',
      'date-caption': 'Дата',
      'author-validation-message-caption': 'Заполните поле "Автор"'
    },

    'ember-flexberry-dummy-localization-edit': {
      'caption': 'Локализация',
      'name-caption': 'Наименование',
      'name-validation-message-caption': 'Заполните наименование'
    },

    'ember-flexberry-dummy-suggestion-edit': {
      'caption': 'Предложение',
      'address-caption': 'Адрес',
      'text-caption': 'Описание',
      'date-caption': 'Дата',
      'votes-caption': 'Количество голосов',
      'moderated-caption': 'Одобрено',
      'type-caption': 'Тип предложения',
      'author-caption': 'Автор предложения',
      'editor1-caption': 'Редактор предложения',
      'files-caption': 'Прикрепленные файлы',
      'userVotes-caption': 'Голоса пользователей',
      'comments-caption': 'Комментарии',
      'type-validation-message-caption': 'Заполните тип предложения',
      'author-validation-message-caption': 'Заполните поле "Автор"',
      'editor-validation-message-caption': 'Заполните поле "Редактор"'
    },

    'ember-flexberry-dummy-suggestion-type-edit': {
      'caption': 'Тип предложения',
      'name-caption': 'Наименование',
      'moderated-caption': 'Одобрено',
      'parent-caption': 'Иерархия',
      'localized-types-caption': 'Локализация типа',
      'name-validation-message-caption': 'Заполните наименование'
    },

    'ember-flexberry-dummy-application-user-list': {
      'caption': 'Пользователи приложения'
    },

    'ember-flexberry-dummy-localization-list': {
      'caption': 'Локализация'
    },

    'ember-flexberry-dummy-suggestion-list': {
      'caption': 'Предложения'
    },

    'ember-flexberry-dummy-suggestion-type-list': {
      'caption': 'Типы предложений'
    },

    'log-service-examples': {
      'settings-example': {
        'caption': 'Сервис логирования. Пример работы с настройками',
        'setting-column-header-caption': 'Настройка сервиса логирования',
        'settings-value-column-header-caption': 'Текущее значение настройки',
        'throw-exception-button-caption': 'Бросить исключение',
        'reject-rsvp-promise-button-caption': 'Отклонить promise',
        'ember-assert-button-caption': 'assert',
        'ember-logger-error-button-caption': 'Error',
        'ember-logger-warn-button-caption': 'Warn',
        'ember-deprecate-button-caption': 'Deprecate',
        'ember-logger-log-button-caption': 'Log',
        'ember-logger-info-button-caption': 'Info',
        'ember-logger-debug-button-caption': 'Debug',
        'throw-exception-button-message': 'Брошено исключение',
        'reject-rsvp-promise-button-message': 'Promise отклонен',
        'ember-assert-button-message': 'Вызван метод Ember.assert',
        'ember-logger-error-button-message': 'Вызван метод Ember.Logger.error',
        'ember-logger-warn-button-message': 'Вызван метод Ember.Logger.warn',
        'ember-deprecate-button-message': 'Вызван метод Ember.deprecate',
        'ember-logger-log-button-message': 'Вызван метод Ember.Logger.log',
        'ember-logger-info-button-message': 'Вызван метод Ember.logger.info',
        'ember-logger-debug-button-message': 'Вызван метод Ember.Logger.debug'
      }
    },

    'components-examples': {
      'flexberry-checkbox': {
        'settings-example': {
          'caption': 'Flexberry-checkbox. Пример работы с настройками'
        }
      },
      'flexberry-datepicker': {
        'settings-example': {
          'caption': 'Flexberry-datepicker. Пример работы с настройками'
        }
      },
      'flexberry-dropdown': {
        'settings-example': {
          'caption': 'Flexberry-dropdown. Пример работы с настройками'
        },
        'conditional-render-example': {
          'caption': 'Flexberry-dropdown. Пример условного рендеринга',
          'info-caption': 'Описание варианта использования',
          'info-message': 'Шаблон страницы выглядит следующим образом:' +
            '{{pageTemplate}}' +
            'После того как какое-либо значение будет выбрано, компонент будет заменен на ' +
            '&lt;span&gt;selected value&lt;/span&gt;,<br>' +
            'после этого следует проверить консоль браузера, она должна быть чиста от ошибок \"Semantic-UI\" и прочих ошибок.'
        },
        'items-example': {
          'caption': 'Flexberry-dropdown. Пример значений элементов',
          'checkbox-caption': 'использовать itemsObject'
        }
      },
      'flexberry-field': {
        'settings-example': {
          'caption': 'Flexberry-field. Пример работы с настройками'
        }
      },
      'flexberry-file': {
        'settings-example': {
          'caption': 'Flexberry-file. Пример работы с настройками'
        }
      },
      'flexberry-groupedit': {
        'settings-example': {
          'caption': 'Flexberry-groupedit. Пример работы с настройками'
        },
        'model-update-example': {
          'caption': 'Flexberry-groupedit. Обновление модели',
          'addDetailButton': 'Добавить детейл',
          'removeDetailButton': 'Удалить детейл',
        }
      },
      'flexberry-lookup': {
        'settings-example': {
          'caption': 'Flexberry-lookup. Пример работы с настройками'
        },
        'customizing-window-example': {
          'caption': 'Flexberry-lookup. Настройка окна',
          'titleLookup': 'Мастер'
        },
        'limit-function-example': {
          'caption': 'Flexberry-lookup. Функция ограничения',
          'titleLookup': 'Мастер'
        },
        'lookup-block-form-example': {
          'caption': 'Flexberry-lookup. Лукап в блочной форме',
          'message': 'Данный тест работает только в мобильной версии сайта. Чтобы запустить мобильную версию нужно:',
          'paragraph1': 'Перейти в режим разработчика (нажать “F12”).',
          'paragraph2': 'Включить мобильную версию сайта (нажать “Ctrl+Shift+M” в Chrome и Firefox)',
          'paragraph3': 'Обновить страницу (нажать “F5”)'
        },
        'lookup-in-modal': {
          'caption': 'Flexberry-lookup. Лукап в модальном окне',
          'captionModal': 'Кастомное модальное окно №1',
          'captionModalDouble': 'Кастомное модальное окно №2',
          'buttonModal': 'Модальное окно №1',
          'buttonModalDouble': 'Модальное окно №2',
          'buttonClose': 'Закрыть'
        },
        'dropdown-mode-example': {
          'caption': 'Flexberry-lookup. Режим dropdown'
        }
      },
      'flexberry-menu': {
        'settings-example': {
          'caption': 'Flexberry-menu. Пример работы с настройками',
          'titleIcon1': 'Значок выравнен по левому краю',
          'titleIcon2': 'Значок выравнен по правому краю',
          'titleIcon3': 'Подменю'
        }
      },
      'flexberry-objectlistview': {
        'limit-function-example': {
          'caption': 'Flexberry-objectlistview. Функция ограничения'
        },
        'settings-example': {
          'caption': 'Flexberry-objectlistview. Пример работы с настройками'
        },
        'toolbar-custom-buttons-example': {
          'caption': 'Flexberry-objectlistview. Пользовательские кнопки',
          'custom-message': 'Привет!',
          'custom-button-name': 'Передать привет'
        },
        'on-edit-form': {
          'caption': 'Flexberry-objectlistview. FlexberryObjectlistview пример произвольных данных'
        },
        'custom-filter': {
          'caption': 'Flexberry-objectlistview. Настройка фильтра'
        }
      },
      'flexberry-simpledatetime': {
        'settings-example': {
          'caption': 'Flexberry-simpledatetime. Пример работы с настройками'
        }
      },
      'flexberry-textarea': {
        'settings-example': {
          'caption': 'Flexberry-textarea. Пример работы с настройками'
        }
      },
      'flexberry-textbox': {
        'settings-example': {
          'caption': 'Flexberry-textbox. Пример работы с настройками'
        }
      },
      'flexberry-toggler': {
        'settings-example': {
          'caption': 'Flexberry-toggler. Пример работы с настройками',
          'togglerContent': 'Некоторое  сворачивающееся/разворачивающееся содержание'
        }
      }
    },
    'integration-examples': {
      'edit-form': {
        'readonly-mode': {
          'caption': 'Integration examples. Режим только для чтения',
          'readonly-flag-management-segment-caption': 'Управление режимом только для чтения формы',
          'readonly-flag-value-segment-caption': 'Значения свойства \'readonly\' контроллера',
          'readonly-flag-caption': 'Форма находится в режиме только для чтения',
          'flag-caption': 'Флаг',
          'number-caption': 'Число',
          'text-caption': 'Текст',
          'long-text-caption': 'Длинный текст',
          'date-caption': 'Дата',
          'time-caption': 'Время',
          'enumeration-caption': 'Перечисление',
          'file-caption': 'Файл',
          'master-caption': 'Мастер',
          'master-dropdown-caption': 'Мастер в режиме dropdown-а'
        },
        'validation': {
          'caption': 'Integration examples. Валидация',
          'flag-caption': 'Флаг',
          'number-caption': 'Число',
          'text-caption': 'Текст',
          'long-text-caption': 'Длинный текст',
          'date-caption': 'Дата',
          'enumeration-caption': 'Перечисление',
          'file-caption': 'Файл',
          'master-caption': 'Мастер'
        }
      }
    }
  },

  'components': {
    'settings-example': {
      'component-template-caption': 'Шаблон компонента',
      'controller-properties-caption': 'Свойства контроллера',
      'component-current-settings-caption': 'Текущие настройки компонента',
      'component-default-settings-caption': 'Настройки компонента по умолчанию',
      'component-with-applied-settings-caption': 'Компонент с примененными текущими настройками'
    }
  }
});

export default translations;
