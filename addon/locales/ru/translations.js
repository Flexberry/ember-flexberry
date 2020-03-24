export default {
  'forms': {
    'edit-form': {
      'saved-message': 'Форма сохранена.',
      'save-failed-message': 'Ошибка сохранения.',
      'delete-failed-message': 'Ошибка удаления.',

      'save-button-text': 'Сохранить',
      'saveAndClose-button-text': 'Сохранить и закрыть',
      'delete-button-text': 'Удалить',
      'close-button-text': 'Закрыть'
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
      placeholder: '(нет значения)'
    },

    'flexberry-textarea': {
      placeholder: '(нет значения)'
    },

    'flexberry-dropdown': {
      'placeholder': '(нет значения)'
    },

    'flexberry-datepicker': {
      placeholder: '(нет значения)',

      // Months and days of week names are taken from moment.js.
      'apply-button-text': 'Выбрать',
      'cancel-button-text': 'Отмена'
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

      'add-file-error-caption': 'Ошибка добавления файла',
      'file-too-big-error-message': 'Размер файла должен быть не больше {{maxFileSize}} байт. ' +
        'Выбранный файл \'{{fileName}}\' имеет размер {{actualFileSize}} байт.',

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

    'flexberry-objectlistview': {
      'placeholder': 'Нет данных',
      'showing-entries': {
        'showing': 'Показано ',
        'of': ' из ',
        'entries': ' записей'
      }
    },

    'flexberry-groupedit': {
      'placeholder': 'Нет данных'
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
      'clear-select-button-text': 'Отмена выделения'
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
      'enter-setting-name': 'Введите название настройки',
      'use': 'Применить',
      'export': 'Выгрузить',
      'use-without-save': 'Применить данные установки без сохранения в настройке ',
      'save': 'Сохранить',
      'have-errors': 'При сохранении настройки возникли ошибки: ',
      'setting': 'Настройка ',
      'is-saved': ' сохранена',
      'col-width-on': 'Включить настройку ширины столбцов',
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

  errors: {
    description: 'Это поле',
    accepted: '{{description}} должно быть принято',
    after: '{{description}} должно быть после {{after}}',
    before: '{{description}} должно быть до {{before}}',
    blank: '{{description}} не может быть пустым',
    collection: '{{description}} должно быть коллекцией',
    confirmation: '{{description}} не соответствует {{on}}',
    date: '{{description}} должно быть действительной датой',
    email: '{{description}} должно быть действительным адресом электронной почты',
    empty: '{{description}} не может быть пустым',
    equalTo: '{{description}} должно быть равно {{is}}',
    even: '{{description}} должно быть четным',
    exclusion: '{{description}} зарезервировано',
    greaterThan: '{{description}} должно быть больше {{gt}}',
    greaterThanOrEqualTo: '{{description}} должно быть больше или равно {{gte}}',
    inclusion: '{{description}} не входит в список',
    invalid: '{{description}} недействительно',
    lessThan: '{{description}} должно быть меньше {{lt}}',
    lessThanOrEqualTo: '{{description}} должно быть меньше или равно {{lte}}',
    notAnInteger: '{{description}} должно быть целым числом',
    notANumber: '{{description}} должно быть числом',
    odd: '{{description}} должно быть не четным',
    onOrAfter: '{{description}} должно быть равно или после {{onOrAfter}}',
    onOrBefore: '{{description}} должно быть равно или до {{onOrBefore}}',
    otherThan: '{{description}} должно отличаться от {{value}}',
    phone: '{{description}} должно быть действительным номером телефона',
    positive: '{{description}} должно быть положительным',
    multipleOf: '{{description}} должно быть кратным {{multipleOf}}',
    present: '{{description}} должно быть пустым',
    singular: '{{description}} не может быть коллекцией',
    tooLong: '{{description}} слишком длинное (максимум {{max}} символов)',
    tooShort: '{{description}} слишком короткое (минимум {{min}} символов)',
    between: '{{description}} должно быть от {{min}} до {{max}} символов',
    url: '{{description}} должно быть действительным URL адресом',
    wrongDateFormat: '{{description}} должно быть в формате {{format}}',
    wrongLength: '{{description}} неправильной длины (должно быть {{is}} сомвол(ов))'
  },
};
