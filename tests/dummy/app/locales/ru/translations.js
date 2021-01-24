import Ember from 'ember';

import emberFlexberryTranslations from 'ember-flexberry/locales/ru/translations';

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

  'application-name': 'Тестовый стенд ember-flexberry',

  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
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
            'title': 'Меню'
          },
          'user-settings-service-checkbox': {
            'caption': 'Использовать сервис сохранения пользовательских настроек'
          },
          'show-menu': {
            'caption': 'Показать меню'
          },
          'hide-menu': {
            'caption': 'Скрыть меню'
          },
          'language-dropdown': {
            'caption': 'Язык приложения',
            'placeholder': 'Выберите язык'
          }
        },
        'login': {
          'caption': 'Вход'
        },
        'logout': {
          'caption': 'Выход'
        }
      },

      'delete-rows-modal-dialog': {
        'confirm-button-caption': 'Удалить',
        'cancel-button-caption': 'Отмена',
        'delete-row-caption': 'Удалить строку ?',
        'delete-rows-caption': 'Удалить выбранные строки ?',
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
          },
          'multi': {
            'caption': 'Несколько списков',
            'title': ''
          },
          'suggestion-file': {
            'caption': 'Файлы предложения',
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
          },
          'clear-log-form': {
            'caption': 'Очистка лога',
            'title': ''
          }
        },
        'lock': {
          'caption': 'Блокировки',
          'title': 'Список блокировок',
        },
        'components-examples': {
          'caption': 'Примеры компонентов',
          'title': '',
          'flexberry-button': {
            'caption': 'flexberry-button',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            }
          },
          'flexberry-checkbox': {
            'caption': 'flexberry-checkbox',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            },
            'three-state-example': {
              'caption': 'Пример с тремя состояниями',
              'title': ''
            }
          },
          'flexberry-ddau-checkbox': {
            'caption': 'flexberry-ddau-checkbox',
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
            'empty-value-example': {
              'caption': 'Пример dropdown-а с пустым значением',
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
            },
            'flexberry-file-in-modal': {
              'caption': 'Пример файла в модальном окне',
              'title': ''
            },
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
            },
            'custom-buttons-example': {
              'caption': 'Пользовательские кнопки',
              'title': ''
            },
            'configurate-row-example': {
              'caption': 'Настройка строк',
              'title': ''
            },
            'groupedit-with-lookup-with-computed-atribute': {
              'caption': 'Computed атрибуты LookUp в GroupEdit',
              'title': ''
            },
            'readonly-columns-by-configurate-row-example': {
              'caption': 'Установка readonly columns через configurateRow в GrouptEdit',
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
            'compute-autocomplete': {
              'caption': 'Пример лукапа с вычислимым автокомплитом',
              'title': ''
            },
            'numeric-autocomplete': {
              'caption': 'Пример лукапа c автокомплитом и dropdwon с числовым displayAttributeName',
              'title': ''
            },
            'hierarchy-olv-in-lookup-example': {
              'caption': 'Пример иерархического OLV-а в lookup-e',
              'title': ''
            },
            'limit-function-example': {
              'caption': 'Функция ограничения',
              'title': ''
            },
            'autofill-by-limit-example': {
              'caption': 'Пример autofillByLimit',
              'title': ''
            },
            'limit-function-through-dynamic-properties-example': {
              'caption': 'Функция ограничения через динамические свойства',
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
            },
            'default-ordering-example': {
              'caption': 'Сортировка по умолчанию',
              'title': ''
            },
            'autocomplete-order-example': {
              'caption': 'Пример сортировки при автокомплите',
              'title': ''
            },
            'user-settings-example': {
              'caption': 'Пример настройки OLV модального окна',
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
            'inheritance-models': {
              'caption': 'Наследуемые модели',
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
            'list-on-editform': {
              'caption': 'Размещение списка детейлов мастера на форме редактирования',
              'title': ''
            },
            'custom-filter': {
              'caption': 'Настройка фильтра',
              'title': ''
            },
            'edit-form-with-detail-list': {
              'caption': 'Пример списка',
              'title': ''
            },
            'hierarchy-example': {
              'caption': 'Пример иерархии на списке',
              'title': ''
            },
            'hierarchy-paging-example': {
              'caption': 'Пример иерархии c пейджингом',
              'title': ''
            },
            'configurate-rows': {
              'caption': 'Раскраска строк',
              'title': ''
            },
            'selected-rows': {
              'caption': 'Выбранные строки',
              'title': ''
            },
            'downloading-files-from-olv-list': {
              'caption': 'Пример скачивания файлов со списка',
              'title': ''
            },
            'object-list-view-resize': {
              'caption': 'Разметка столбцов',
              'title': ''
            },
            'return-from-ediform': {
              'title': 'Возвращение с edit-form на list-form с queryParametr',
              'return-button': 'Вернутся'
            },
            'lock-services-editor-view-list': {
              'caption': 'Пример отображение имени пользователя заблокировшего объект',
              'title': ''
            },
            'limited-text-size-example': {
              'caption': 'Пример ограничения длины текста в ячейках',
              'title': ''
            },
          },
          'flexberry-simpledatetime': {
            'caption': 'flexberry-simpledatetime',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            }
          },
          'flexberry-text-cell': {
            'caption': 'flexberry-text-cell',
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
            },
            'settings-example-inner': {
              'caption': 'Пример работы с настройками (toggler в toggler)',
              'title': ''
            },
            'ge-into-toggler-example': {
              'caption': 'GroupEdit в toggler example',
            }
          },
          'flexberry-tree': {
            'caption': 'flexberry-tree',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            }
          },
          'ui-message': {
            'caption': 'ui-message',
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
        },
        'user-setting-forms': {
          'caption': 'Пользовательские настройки',
          'title': '',
          'user-setting-delete': {
            'caption': 'Удаление настроек',
            'title': ''
          }
        },
        'components-acceptance-tests': {
          'caption': 'Acceptance тесты',
          'title': '',
        },
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

    'list-form': {
      'delete-success-message-caption': 'Удаление завершилось успешно',
      'delete-success-message': 'Объект удален',
      'delete-error-message-caption': 'Ошибка удаления',
      'load-success-message-caption': 'Загрузка данных завершилась успешно',
      'load-success-message': 'Объект загружен',
      'load-error-message-caption': 'Ошибка загрузки данных',
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

    'ember-flexberry-dummy-comment-vote-edit': {
      'caption': 'Голос пользователя',
      'voteType-caption': 'Тип голоса',
      'applicationUser-caption': 'Пользователь приложения',
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
      'editor-validation-message-caption': 'Заполните поле "Редактор"',
      'readonly-groupedit-with-lookup-with-computed-atribute-field': 'Readonly для LookUp "Пользователь приложения" в GroupEdit "Голоса пользователей"',
      'limit-function-groupedit-with-lookup-with-computed-atribute-field': 'Ограничения для LookUp "Пользователь приложения" в GroupEdit "Голоса пользователей"'
    },

    'ember-flexberry-dummy-suggestion-file-list': {
      'header': 'Файлы предложения',
    },

    'ember-flexberry-dummy-suggestion-file-edit': {
      'header': 'Файл предложения',
      'suggestion': 'Предложение',
      'order': 'Номер',
      'file': 'Файл',
    },

    'ember-flexberry-dummy-toggler-example-master-e': {
      'caption': 'Мастер',
      'toggler-example-master-property-caption': 'Свойство мастера',
      'toggler-example-deteil-property-caption': 'Детейл'
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

    'ember-flexberry-dummy-multi-list': {
      'caption': 'Несколько списков на форме',
      'multi-edit-form': 'Несколько списков на эдитформе'
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
        'ember-logger-warn-button-message': 'Вызван метод Ember.warn',
        'ember-deprecate-button-message': 'Вызван метод Ember.deprecate',
        'ember-logger-log-button-message': 'Вызван метод Ember.Logger.log',
        'ember-logger-info-button-message': 'Вызван метод Ember.Logger.info',
        'ember-logger-debug-button-message': 'Вызван метод Ember.debug'
      }
    },

    'new-platform-flexberry-services-lock-list': {
      'change-user-name': 'Изменить имя пользователя',
      'open-read-only': 'Открывать только для чтения',
      'unlock-object': 'Снимать блокировку',
      'enter-new-user-name': 'Введите новое имя пользователя:',
    },

    'components-examples': {
      'flexberry-button': {
        'settings-example': {
          'caption': 'Пример работы с настройками flexberry-button'
        }
      },
      'flexberry-checkbox': {
        'settings-example': {
          'caption': 'Flexberry-checkbox. Пример работы с настройками'
        },
        'three-state-example': {
          'caption': 'Пример с тремя состояниями',
          'indeterminate-button': 'Выставить пустое значение'
        }
      },
      'flexberry-ddau-checkbox': {
        'settings-example': {
          'caption': 'Пример работы с настройками flexberry-ddau-checkbox'
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
            'после этого следует проверить консоль браузера, она должна быть чиста от ошибок \'Semantic-UI\' и прочих ошибок.'
        },
        'empty-value-example': {
          'caption': 'Flexberry-dropdown. Пример dropdown-а с пустым значением',
          'message': 'При открытии формы в dropdown-е должно быть не пустое значение. Должно быть Enum value №2.',
          'enumeration-caption': 'Dropdown с пустым значением',
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
        'custom-buttons-example': {
          'caption': 'Flexberry-groupedit. Пользовательские кнопки',
          'custom-message': 'Привет!',
          'custom-button-name': 'Передать привет',
          'disable-button-name': 'Отключить соседнюю кнопку',
          'enable-button-name': 'Включить соседнюю кнопку',
        },
        'configurate-row-example': {
          'caption': 'Flexberry-groupedit. Настройка строк',
          'confirm': 'Вы уверены ?'
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
        'compute-autocomplete': {
          'caption': 'Пример лукапа с вычислимым автокомплитом',
          'title': ''
        },
        'numeric-autocomplete': {
          'caption': 'Пример лукапа c автокомплитом и dropdwon с числовым displayAttributeName',
          'title': ''
        },
        'hierarchy-olv-in-lookup-example': {
          'caption': 'Flexberry-lookup. Пример иерархического OLV-а в lookup-e',
          'titleLookup': 'Мастер'
        },
        'autofill-by-limit-example': {
          'caption': 'Flexberry-lookup. Пример autofillByLimit в lookup-e',
          'titleLookup': 'Мастер'
        },
        'limit-function-example': {
          'caption': 'Flexberry-lookup. Функция ограничения',
          'titleLookup': 'Мастер'
        },
        'limit-function-through-dynamic-properties-example': {
          'caption': 'Flexberry-lookup. Функция ограничения через динамические свойства',
          'titleLookup': 'Мастер',
          'captionFirstLimitFunction': 'Функция ограничения №1',
          'captionSecondLimitFunction': 'Функция ограничения №2',
          'captionClearLimitFunction': 'Очистить функцию ограничения'
        },
        'lookup-block-form-example': {
          'caption': 'Flexberry-lookup. Лукап в блочной форме'
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
        },
        'default-ordering-example': {
          'caption': 'Flexberry-lookup. Сортировка по умолчанию',
          'titleLookup': 'Мастер'
        },
        'autocomplete-order-example': {
          'caption': 'Flexberry-lookup. Пример сортировки при автокомплите',
          'titleLookup': 'Мастер'
        },
        'user-settings-example': {
          'not-user-user-setting-caption': 'Отключить использование пользовательских настроек для OLV лукапа',
          'clear-user-setting': 'Сбросить настройки пользователя'
        }
      },
      'flexberry-menu': {
        'settings-example': {
          'caption': 'Flexberry-menu. Пример работы с настройками',
          'titleIcon1': 'Значок выравнен по левому краю',
          'titleIcon2': 'Значок выравнен по правому краю',
          'titleIcon3': 'Подменю',
          'titleIcon4': 'Кнопки в строке'
        }
      },
      'flexberry-objectlistview': {
        'limit-function-example': {
          'caption': 'Flexberry-objectlistview. Функция ограничения',
          'captionFirstLimitFunction': 'Функция ограничения №1',
          'captionSecondLimitFunction': 'Функция ограничения №2',
          'captionClearLimitFunction': 'Очистить функцию ограничения'
        },
        'inheritance-models': {
          'caption': 'Flexberry-objectlistview. Пример наследуемых моделей',
          'message': 'Проверьте представление в OLV. (ПредставлениеE=ПредставлениеL)',
          'projectionBase': 'Представление \'Предок\': Name, E-mail, Birthday',
          'projectionSuccessorPhone': 'Представление \'Наследник телефоны\': Name, Phone1, Phone2, Phone3',
          'projectionSuccessorSoc': 'Представление \'Наследник соц сети\': Name, VK, Facebook, Twitter',
          'buttonRoot': 'Предок',
          'buttonSuccessorPhone': 'Наследник телефоны',
          'buttonSuccessorSoc': 'Наследник соц сети',
          'name-caption': 'Имя',
          'eMail-caption': 'E-mail',
          'phone1-caption': 'Номер телефона 1',
          'phone2-caption': 'Номер телефона 2',
          'phone3-caption': 'Номер телефона 3',
          'vK-caption': 'VK',
          'facebook-caption': 'Facebook',
          'twitter-caption': 'Twitter',
          'birthday-caption': 'Дата рождения',
        },
        'settings-example': {
          'caption': 'Flexberry-objectlistview. Пример работы с настройками'
        },
        'limited-text-size-example': {
          'caption': 'Flexberry-objectlistview. Пример ограничения длины текста в ячейках'
        },
        'toolbar-custom-buttons-example': {
          'caption': 'Flexberry-objectlistview. Пользовательские кнопки',
          'custom-message': 'Привет!',
          'custom-button-name': 'Передать привет',
          'disable-button-name': 'Отключить соседнюю кнопку',
          'enable-button-name': 'Включить соседнюю кнопку',
          'custom-row-button-name': 'Пользовательская кнопка в строке',
        },
        'on-edit-form': {
          'caption': 'Flexberry-objectlistview. FlexberryObjectlistview на форме редактирования',
          'add-button-name': 'Добавить'
        },
        'list-on-editform': {
          'caption': 'Список детейлов Тип предложения'
        },
        'custom-filter': {
          'caption': 'Flexberry-objectlistview. Настройка фильтра'
        },
        'hierarchy-example': {
          'caption': 'Flexberry-objectlistview. Пример иерархии на списке'
        },
        'hierarchy-paging-example': {
          'caption': 'Flexberry-objectlistview. Пример иерархии c пейджингом на списке'
        },
        'configurate-rows': {
          'caption': 'Flexberry-objectlistview. Раскраска строк'
        },
        'selected-rows': {
          'caption': 'Flexberry-objectlistview. Выбранные строки'
        },
        'downloading-files-from-olv-list': {
          'caption': 'Flexberry-objectlistview. Скачивание файлов со списка'
        },
        'object-list-view-resize': {
          'caption': 'Flexberry-objectlistview. Разметка столбцов',
          'button-сaption': 'Добавить',
          'title': ''
        },
        'lock-services-editor-view': {
          'blocked-by': 'Заблокированно пользователем',
        },
      },
      'flexberry-simpleolv': {
        'limit-function-example': {
          'caption': 'Flexberry-simpleolv. Функция ограничения',
          'captionFirstLimitFunction': 'Функция ограничения №1',
          'captionSecondLimitFunction': 'Функция ограничения №2',
          'captionClearLimitFunction': 'Очистить функцию ограничения'
        },
        'settings-example': {
          'caption': 'Flexberry-simpleolv. Пример работы с настройками'
        },
        'toolbar-custom-buttons-example': {
          'caption': 'Flexberry-simpleolv. Пользовательские кнопки',
          'custom-message': 'Привет!',
          'custom-button-name': 'Передать привет'
        },
        'on-edit-form': {
          'caption': 'Flexberry-simpleolv. FlexberryObjectlistview пример произвольных данных'
        },
        'custom-filter': {
          'caption': 'Flexberry-simpleolv. Настройка фильтра',
          'addObjects-button': 'Добавить объекты'
        },
        'configurate-rows': {
          'caption': 'Flexberry-simpleolv. Раскраска строк'
        },
        'selected-rows': {
          'caption': 'Flexberry-simpleolv. Выбранные строки'
        }
      },
      'flexberry-simpledatetime': {
        'settings-example': {
          'caption': 'Flexberry-simpledatetime. Пример работы с настройками'
        }
      },
      'flexberry-text-cell': {
        'settings-example': {
          'caption': 'Flexberry-text-cell. Пример работы с настройками'
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
        },
        'settings-example-inner': {
          'caption': 'Flexberry-toggler. Пример работы с настройками',
          'togglerContent': 'Некоторое  сворачивающееся/разворачивающееся содержание',
          'innerTogglerContent': 'Некоторое  сворачивающееся/разворачивающееся содержание внутреннего тогглера'
        },
        'ge-into-toggler-example': {
          'caption': 'Flexberry-toggler. GroupEdit в toggler example'
        }
      },
      'flexberry-tree': {
        'settings-example': {
          'caption': 'Пример работы с настройками flexberry-tree',
          'json-tree-tab-caption': 'Дерево заданное JSON-объектом',
          'json-tree-latest-clicked-node-caption': 'Настройки последней кликнутой вершины дерева',
          'json-tree-latest-clicked-node-placeholder': 'Кликните на любую вершину дерева, чтобы отобразить её настройки'
        }
      },
      'ui-message': {
        'settings-example': {
          'caption': 'Ui-message. Пример работы с настройками',
          'captionMessage': 'Результат проверки',
          'messageError': 'Операция не выполнена',
          'messageSuccess': 'Операция выполнена успешно',
          'messageWarning': 'Частично выполнено',
          'messageInfo': 'Обратите внимание!'
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
          'time-caption': 'Дата + Время',
          'enumeration-caption': 'Перечисление',
          'file-caption': 'Файл',
          'master-caption': 'Мастер',
          'master-dropdown-caption': 'Мастер в режиме dropdown-а'
        },
        'validation': {
          'caption': 'Примеры интеграции. Валидация',
          'summary-caption': 'Ошибки валидации:',
          'flag-caption': 'Флаг',
          'number-caption': 'Число',
          'text-caption': 'Текст',
          'long-text-caption': 'Длинный текст',
          'date-caption': 'Дата',
          'enumeration-caption': 'Перечисление',
          'file-caption': 'Файл',
          'master-caption': 'Мастер',
          'details-caption': 'Детейлы'
        }
      }
    },
    'user-setting-forms': {
      'user-setting-delete': {
        'caption': 'Пользовательские настройки',
        'all-del-button-name': 'Удалить все!',
        'message': 'Настройки удалены'
      }
    },
  },
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
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
