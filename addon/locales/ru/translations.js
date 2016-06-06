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
      'default-text': '(нет значения)'
    },

    'flexberry-datepicker': {
      placeholder: '(нет значения)',

      // Months and days of week names are taken from moment.js.
      'apply-button-text': 'Выбрать',
      'cancel-button-text': 'Отмена'
    },

    'flexberry-file': {
      placeholder: '(нет файла)',

      'add-btn-text': 'Добавить файл',
      'remove-btn-text': 'Удалить файл',
      'upload-btn-text': 'Отправить файл',
      'download-btn-text': 'Загрузить файл',

      'error-dialog-title': 'Ошибка компонента выбора файла',
      'error-dialog-content': 'Произошла ошибка в компоненте выбора файла',
      'error-dialog-ok-btn-text': 'OK',

      'add-file-error-title': 'Ошибка добавления файла',
      'file-too-big-message': 'Размер файла должен быть не больше {{maxSize}} байт. Выбранный файл {{fileName}} имеет размер {{actualSize}} байт.',

      'upload-file-error-title': 'Ошибка отправки файла',
      'upload-file-error-message': 'Отправка файла {{fileName}} не удалась. {{errorText}}',

      'download-file-error-title': 'Ошибка загрузки файла',
      'download-file-error-message': 'Загрузка файла {{fileName}} не удалась. {{errorText}}',
      'menu-for-file': {
        'zoom-image-item-title': 'Увеличить',
        'replace-file-item-title': 'Заменить',
        'delete-file-item-title': 'Удалить'
      }
    },

    'flexberry-lookup': {
      placeholder: '(нет значения)',
      'choose-button-text': 'Выбрать',
      'remove-button-text': 'Очистить'
    },

    'modal-dialog': {
      'ok-button-text': 'OK',
      'close-button-text': 'Закрыть'
    },

    'object-list-view': {
      'no-data-text': 'Нет данных',
      'single-column-header-title': 'Свойства модели',
      'menu-in-row': {
        'edit-menu-item-title': 'Редактировать запись',
        'delete-menu-item-title': 'Удалить запись'
      }
    },

    'olv-toolbar': {
      'add-button-text': 'Добавить',
      'refresh-button-text': 'Обновить',
      'delete-button-text': 'Удалить',
      'custom-button-text': 'Пользовательская кнопка',
      'filter-by-any-match-placeholder': 'Поиск...'
    }
  }
};
