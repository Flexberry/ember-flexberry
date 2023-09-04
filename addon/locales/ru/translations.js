export default {
  errors: {
    description: 'Это поле',
    inclusion: '{{description}} не входит в список',
    exclusion: '{{description}} зарезервировано',
    invalid: '{{description}} недействительно',
    confirmation: '{{description}} не соответствует {{on}}',
    accepted: '{{description}} должно быть принято',
    empty: '{{description}} не может быть пустым',
    blank: '{{description}} не может быть пустым',
    present: '{{description}} должно быть пустым',
    collection: '{{description}} должно быть коллекцией',
    singular: '{{description}} не может быть коллекцией',
    tooLong: '{{description}} слишком длинное (максимум {{max}} символов)',
    tooShort: '{{description}} слишком короткое (минимум {{min}} символов)',
    before: '{{description}} должно быть до {{before}}',
    after: '{{description}} должно быть после {{after}}',
    wrongDateFormat: '{{description}} должно быть в формате {{format}}',
    wrongLength: '{{description}} неправильной длинны (должно быть {{is}} символов)',
    notANumber: '{{description}} должно быть числом',
    notAnInteger: '{{description}} должно быть целым числом',
    greaterThan: '{{description}} должно быть больше {{gt}}',
    greaterThanOrEqualTo: '{{description}} должно быть больше или равно {{gte}}',
    equalTo: '{{description}} должно быть равно {{is}}',
    lessThan: '{{description}} должно быть меньше {{lt}}',
    lessThanOrEqualTo: '{{description}} должно быть меньше или равно {{lte}}',
    otherThan: '{{description}} должно быть отличным от {{value}}',
    odd: '{{description}} должно быть нечётным числом',
    even: '{{description}} должно быть чётным числом',
    positive: '{{description}} должно быть положительным числом',
    date: '{{description}} должно быть действительной датой',
    onOrAfter: '{{description}} должно быть не позднее {{onOrAfter}}',
    onOrBefore: '{{description}} должно быть не раньше {{onOrBefore}}',
    email: '{{description}} должно быть действительным адресом электронной почты',
    phone: '{{description}} должно быть действительным номером телефона',
    url: '{{description}} должно быть действительным URL адресом',
    multipleOf: '{{description}} должно быть кратным {{multipleOf}}',
    between: '{{description}} должно быть от {{min}} до {{max}} символов',
  },

  'forms': {
    'edit-form': {
      'saved-message': 'Форма сохранена.',
      'save-failed-message': 'Ошибка сохранения.',
      'delete-failed-message': 'Ошибка удаления.',

      'save-button-text': 'Сохранить',
      'saveAndClose-button-text': 'Сохранить и закрыть',
      'delete-button-text': 'Удалить',
      'close-button-text': 'Закрыть',
      'more-button-text': 'Еще',
      'only-more-button-text': 'Действия',
      'readonly': 'только для чтения'
    },

    'error-form': {
      caption: 'Произошла ошибка',
      'show-more': 'Подробно',
      retry: 'Повторить попытку',
      error: 'Ошибка',
      'ember-data-request': 'Сервер недоступен, необходимо проверить соединение с сервером',
      'invalid-sorting-value': 'Указаны неправильные параметры сортировки',
    },

    'i-i-s-caseberry-logging-objects-application-log-l': {
      caption: 'Лог приложения'
    },

    'new-platform-flexberry-services-lock-list': {
      caption: 'Список блокировок',
    },

    'loading': {
      caption: 'Загрузка...',
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
              'caption': 'Пример лукапа c автокомплитом и dropdown с числовым displayAttributeName',
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
          },
          'odata-examples': {
            'caption': 'Работа с OData',
            'title': '',
            'get-masters': {
              'caption': 'Вычитка мастеров через OData-функцию',
              'title': '',
              'sotrudnik': {
                'caption': 'Сотрудник',
                'title': ''
              },
              'departament': {
                'caption': 'Департамент',
                'title': ''
              },
              'vid-departamenta': {
                'caption': 'Вид департамента',
                'title': ''
              }
            },
          },
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
    }
  },

  'components': {
    'flexberry-error': {
      caption: 'Произошла ошибка',
      'show-more': 'Подробнее',
      'unknown-error': 'Неизвестная ошибка',
    },

    'flexberry-field': {
      placeholder: '(нет значения)'
    },

    'flexberry-textbox': {
      placeholder: '(нет значения)'
    },

    'flexberry-simpledatetime': {
      placeholder: '(нет значения)',
      'scroll-caption-text': 'Используйте скролл для перемотки',
      'apply-button-text': 'Выбрать',
    },

    'flexberry-textarea': {
      placeholder: '(нет значения)'
    },

    'flexberry-dropdown': {
      'placeholder': '(нет значения)'
    },

    'flexberry-required-marker': {
      title: 'Поле, обязательное для заполнения'
    },

    'flexberry-file': {
      placeholder: '(нет файла)',

      'add-button-title': 'Добавить файл',
      'add-button-caption': 'Добавить файл',
      'remove-button-title': 'Удалить файл',
      'upload-button-title': 'Загрузить файл',
      'download-button-title': 'Скачать файл',

      'preview-image-alternative-text': 'Просмотр изображения не доступен',

      'error-dialog-caption': 'Ошибка компонента выбора файла',
      'error-dialog-content': 'Произошла ошибка в компоненте выбора файла',
      'error-dialog-ok-button-caption': 'OK',
      'error-preview-caption': 'Предпросмотр не может быть загружен',
      'error-dialog-size-unit-bt': 'Байт',
      'error-dialog-size-unit-kb': 'Килобайт',
      'error-dialog-size-unit-mb': 'Мегабайт',
      'error-dialog-size-unit-gb': 'Гигабайт',

      'add-file-error-caption': 'Ошибка добавления файла',
      'file-too-big-error-message': 'Размер файла должен быть не больше {{maxFileSize}} {{sizeUnit}}. ' +
        'Выбранный файл \'{{fileName}}\' имеет размер {{actualFileSize}} {{sizeUnit}}.',

      'file-extension-error-message': 'Выбранный файл \'{{fileName}}\' имеет недопустимое расширение.',

      'upload-file-error-caption': 'Ошибка отправки файла',
      'upload-file-error-message': 'Отправка файла \'{{fileName}}\' не удалась. {{errorMessage}}',

      'download-file-error-caption': 'Ошибка загрузки файла',
      'download-file-error-message': 'Загрузка файла \'{{fileName}}\' не удалась. {{errorMessage}}',
      'menu-for-file': {
        'zoom-image-item-caption': 'Увеличить',
        'replace-file-item-caption': 'Заменить',
        'delete-file-item-caption': 'Удалить'
      }
    },

    'flexberry-lookup': {
      'placeholder': '(нет значения)',
      'choose-button-text': 'Выбрать',
      'remove-button-text': 'Очистить',
      'preview-button-text': 'Просмотр',
      'dropdown': {
        'messages': {
          'noResultsHeader': 'Нет данных',
          'noResults': 'Значения не найдены'
        }
      }
    },

    'flexberry-multiple-lookup': {
      'no-data': 'Нет данных'
    },

    'flexberry-objectlistview': {
      'placeholder': 'Нет данных',
      'showing-entries': {
        'showing': 'Показано ',
        'of': ' из ',
        'entries': ' записей'
      },
      'without-sorting': 'Без сортировки',
      'search-page-placeholder': '№ страницы',
      'search-button-text': 'Переход на страницу'
    },

    'flexberry-groupedit': {
      'placeholder': 'Нет данных'
    },

    'highload-edit-form-menu': {
      'show-all-forms-button': 'Показать все поля формы',
      'next-button': 'Далее',
      'prev-button': 'Назад'
    },

    'modal-dialog': {
      'ok-button-text': 'OK',
      'close-button-text': 'Закрыть'
    },

    'object-list-view': {
      'placeholder': 'Нет данных',
      'loading-text': 'Данные загружаются...',
      'header-title-attr': 'Нажмите, чтобы изменить порядок, Ctrl+Click чтобы добавить упорядочение для этого столбца',
      'single-column-header-title': 'Свойства модели',
      'sort-ascending': 'По возрастанию',
      'sort-descending': 'По убыванию',
      'menu-in-row': {
        'add-menu-item-title': 'Добавить запись',
        'edit-menu-item-title': 'Редактировать запись',
        'prototype-menu-item-title': 'Создать запись на основе',
        'delete-menu-item-title': 'Удалить запись'
      },
      'hierarchy-buttons': {
        'plus-button-title': 'Раскрыть',
        'minus-button-title': 'Свернуть',
      },
      'filters': {
        'eq': 'Равно',
        'neq': 'Не равно',
        'le': 'Меньше',
        'ge': 'Больше',
        'like': 'Содержит',
        'nlike': 'Не содержит',
        'nempty': 'Заполнен',
        'empty': 'Не заполнен',
        'between': 'В интервале',
      },
      'filter-condition': 'Условие',
      'clear-filter-in-column': 'Сбросить фильтр в этой колонке',
    },

    'olv-filter-interval': {
      'from': '(от)',
      'to': '(до)'
    },

    'olv-toolbar': {
      'add-button-text': 'Добавить',
      'refresh-button-text': 'Обновить',
      'delete-button-text': 'Удалить',
      'custom-button-text': 'Пользовательская кнопка',
      'hierarchy-button-text': 'Вкл/выкл иерархии',
      'coll-expand-button-text':'Развернуть все иерархии',
      'coll-comspres-button-text':'Свернуть все иерархии',
      'filter-button-text': 'Добавить фильтр',
      'remove-filter-button-text': 'Сбросить фильтр',
      'search-button-text': 'Поиск',
      'clear-search-button-text': 'Очистить поиск',
      'export-excel-button-text': 'Экспорт в Excel',
      'filter-by-any-match-placeholder': 'Поиск...',
      'create-setting-title': 'Новая настройка',
      'use-setting-title': 'Применить',
      'export-title': 'Выгрузить',
      'edit-setting-title': 'Редактировать',
      'remove-setting-title': 'Удалить',
      'set-default-setting-title': 'Установка по умолчанию',
      'show-default-setting-title': 'Показать установки',
      'show-setting-caption':
        'Для установки данных настроек по умолчнанию Вы можете их скопировать и инициализировать переменную developerUserSettings в /app/routes/',
      'create-limit-title': 'Новое ограничение',
      'use-limit-title': 'Применить',
      'edit-limit-title': 'Редактировать',
      'remove-limit-title': 'Удалить',
      'set-default-limit-title': 'Сбросить ограничение',
      'close': 'Закрыть',
      'copy': 'Копировать',
      'copied': 'Скопировано',
      'ctrlc': 'Нажмите Ctrl/C для копирования',
      'check-all-at-page-button-text': 'Выбрать все на странице',
      'uncheck-all-at-page-button-text': 'Отменить выбор на странице',
      'check-all-button-text': 'Выбрать все на всех страницах',
      'uncheck-all-button-text': 'Отменить выбор на всех страницах',
      'clear-sorting-button-text': 'Установить сортировку по умолчанию',
      'clear-select-button-text': 'Отмена выделения',
      'pullUpLookupValues': 'Использовать все выбранные записи'
    },

    'groupedit-toolbar': {
      'add-button-text': 'Добавить',
      'delete-button-text': 'Удалить',
      'clear-settings-button-text': 'Восстановить настройки по умолчанию',
      'custom-button-text': 'Пользовательская кнопка',
      'move-up-button-text': 'Передвинуть вверх',
      'move-down-button-text': 'Передвинуть вниз',
    },

    'colsconfig-dialog-content': {
      'title': 'Настроить отображение столбцов',
      'export-modal-dialog-title': 'Настроить экспорт в Excel',
      'export-title': 'Экспорт в Excel',
      'dont-show-columns': 'Не отображать столбцы',
      'columns-order': 'Определить порядок столбцов',
      'column-name': 'Название столбца',
      'sort-direction': 'Направление сортировки',
      'sort-direction-caption': 'Сортировка',
      'sort-priority': 'Приоритет столбца при сортировке',
      'sort-priority-caption': 'Приоритет',
      'column-width': 'Ширина столбца',
      'column-width-caption': 'Ширина',
      'save-colwidths': 'Сохранить ширину столбцов',
      'setting-name': 'Название настройки',
      'enter-setting-name': 'Название настройки',
      'use': 'Применить',
      'export': 'Выгрузить',
      'use-without-save': 'Применить данные установки без сохранения в настройке ',
      'save': 'Сохранить настройку',
      'have-errors': 'При сохранении настройки возникли ошибки: ',
      'setting': 'Настройка ',
      'is-saved': ' сохранена',
      'col-width-on': 'Настройка ширины столбцов',
      'per-page': 'Записей на странице',
      'det-separate-rows': 'Поля списков в отдельные строки',
      'det-separate-cols': 'Поля списков в отдельные столбцы',
      'unresizable': 'Фиксированная ширина',
      'sort-direction-none': 'Нет',
      'sort-direction-asc': 'По возрастанию',
      'sort-direction-desc': 'По убыванию',
    },

    'advlimit-dialog-content': {
      'title': 'Настройка ограничений',
      'limit-name': 'Название ограничения',
      'enter-limit-name': 'Введите название ограничения',
      'use': 'Применить',
      'save': 'Сохранить',
      'have-errors': 'При сохранении ограничения возникли ошибки: ',
      'cant-parse': 'Текущая строка ограничения не является предикатом',
      'limit': 'Ограничение ',
      'is-saved': ' сохранено',
      'is-deleted': ' удалено',
      'is-correct': 'Текущая строка ограничения корректна',
      'check': 'Проверить'
    },

    'filters-dialog-content': {
      'clear-this-filter': 'Сбросить этот фильтр',
      'title': 'Настройка фильтрации записей',
      'clear': 'Сбросить фильтр',
      'apply': 'Применить'
    },

    'form-load-time-tracker': {
      'load-time': 'Время загрузки',
      'render-time': 'Время отрисовки',
    },

    'flexberry-dialog': {
      'approve-button': {
        'caption': 'Ок'
      },
      'deny-button': {
        'caption': 'Отмена'
      }
    },

    'flexberry-jsonarea': {
      'placeholder': '(Введите JSON-строку)',
      'parse-error': {
        'caption': 'Ошибка парсинга введенной JSON-строки'
      }
    },

    'flexberry-tree': {
      'placeholder': 'Вершины дерева не заданы'
    },

    'flexberry-sitemap-searchbar': {
      'placeholder': 'Найти раздел...',
      'notFoundMsg': 'Не найдено'
    },

    'flexberry-sitemap-guideline': {
      'main-menu-caption': 'Главное меню'
    }
  },

  'models': {
    'i-i-s-caseberry-logging-objects-application-log': {
      'projections': {
        'ApplicationLogL': {
          'processId': {
            __caption__: 'URL'
          },
          'timestamp':{
            __caption__: 'Время'
          },
          'category':{
            __caption__: 'Категория'
          },
          'eventId':{
            __caption__: 'Идентификтатор события'
          },
          'priority':{
            __caption__: 'Приоритет'
          },
          'severity':{
            __caption__: 'Значимость'
          },
          'title':{
            __caption__: 'Заголовок'
          },
          'machineName':{
            __caption__: 'Сервер'
          },
          'appDomainName':{
            __caption__: 'Браузер'
          },
          'processName':{
            __caption__: 'Имя процесса'
          },
          'threadName':{
            __caption__: 'Имя потока'
          },
          'win32ThreadId':{
            __caption__: 'Идентификатор потока',
          },
          'message':{
            __caption__: 'Сообщение'
          },
          'formattedMessage':{
            __caption__: 'Форматированное сообщение'
          }
        }
      }
    },
    'new-platform-flexberry-services-lock': {
      'projections': {
        'LockL': {
          'lockKey': { __caption__: 'Ключ заблокированного объекта' },
          'userName': { __caption__: 'Заблокировавший пользователь' },
          'lockDate': { __caption__: 'Дата блокировки' },
        },
      },
    },
  },

  'validations': {
    'server-side-validation-error': 'Ошибка при запросе валидации на стороне сервера'
  },
};
