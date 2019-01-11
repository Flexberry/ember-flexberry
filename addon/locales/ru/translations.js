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
        'edit-menu-item-title': 'Редактировать запись',
        'add-menu-item-title': 'Добавить запись',
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
      'coll-expand-button-text':'Свернуть/развернуть все иерархии',
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
      'close': 'Закрыть',
      'copy': 'Копировать',
      'copied': 'Скопировано',
      'ctrlc': 'Нажмите Ctrl/C для копирования',
      'check-all-at-page-button-text': 'Отметить все записи на текущей странице',
      'check-all-button-text': 'Отметить все на всех страницах',
      'clear-sorting-button-text': 'Установить сортировку по умолчанию'
    },

    'groupedit-toolbar': {
      'add-button-text': 'Добавить',
      'delete-button-text': 'Удалить',
      'clear-settings-button-text': 'Восстановить настройки по умолчанию'
    },

    'colsconfig-dialog-content': {
      'title': 'Настроить отображение столбцов',
      'export-modal-dialog-title': 'Настроить экспорт в Excel',
      'export-title': 'Экспорт в Excel',
      'dont-show-columns': 'Не отображать столбцы',
      'columns-order': 'Определить порядок столбцов',
      'column-name': 'Название столбца',
      'sort-direction': 'Направление сортировки',
      'sort-priority': 'Приоритет столбца при сортировке',
      'column-width': 'Ширина столбца',
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
      'unresizable': 'Фиксированная ширина'
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
  }
};
