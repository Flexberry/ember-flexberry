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

    'i-i-s-caseberry-logging-objects-application-log-l': {
      caption: 'Лог приложения'
    }
  },

  'components': {
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

      'preview-image-alternative-text': 'Загруженное изображение',

      'error-dialog-caption': 'Ошибка компонента выбора файла',
      'error-dialog-content': 'Произошла ошибка в компоненте выбора файла',
      'error-dialog-ok-button-caption': 'OK',

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
      'dropdown': {
        'messages': {
          'noResults': 'Значения не найдены.'
        }
      }
    },

    'flexberry-objectlistview': {
      'placeholder': 'Нет данных'
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
      'single-column-header-title': 'Свойства модели',
      'menu-in-row': {
        'edit-menu-item-title': 'Редактировать запись',
        'delete-menu-item-title': 'Удалить запись'
      }
    },

    'object-list-view-cell': {
      'boolean-false-caption': 'Ложь',
      'boolean-true-caption': 'Истина'
    },

    'olv-toolbar': {
      'add-button-text': 'Добавить',
      'refresh-button-text': 'Обновить',
      'delete-button-text': 'Удалить',
      'custom-button-text': 'Пользовательская кнопка',
      'filter-by-any-match-placeholder': 'Поиск...',
      'create-setting-title': 'Новая настройка',
      'use-setting-title': 'Применить',
      'edit-setting-title': 'Редактировать',
      'remove-setting-title': 'Удалить',
      'set-default-setting-title': 'Установка по умолчанию',
      'show-default-setting-title': 'Показать установки',
      'show-setting-caption':
        'Для установки данных настроек по умолчнанию Вы можете их скопировать и инициализировать переменную developerUserSettings в /app/routes/',
      'close': 'Закрыть',
      'copy': 'Копировать',
      'copied': 'Скопировано',
      'ctrlc': 'Нажмите Ctrl/C для копирования'
    },

    'colsconfig-dialog-content': {
      'title': 'Настроить отображение столбцов',
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
      'use-without-save': 'Применить данные установки без сохранения в настройке ',
      'save': 'Сохранить'
    }

  },

  'models': {
    'i-i-s-caseberry-logging-objects-application-log': {
      'projections': {
        'ApplicationLogL': {
          'processId': {
            'caption': 'URL'
          },
          'timestamp':{
            'caption': 'Время'
          },
          'category':{
            'caption': 'Категория'
          },
          'eventId':{
            'caption': 'Идентификтатор события'
          },
          'priority':{
            'caption': 'Приоритет'
          },
          'severity':{
            'caption': 'Значимость'
          },
          'title':{
            'caption': 'Заголовок'
          },
          'machineName':{
            'caption': 'Сервер'
          },
          'appDomainName':{
            'caption': 'Браузер'
          },
          'processName':{
            'caption': 'Имя процесса'
          },
          'threadName':{
            'caption': 'Имя потока'
          },
          'win32ThreadId':{
            'caption': 'Идентификатор потока',
          },
          'message':{
            'caption': 'Сообщение'
          },
          'formattedMessage':{
            'caption': 'Форматированное сообщение'
          }
        }
      }
    }
  }
};
