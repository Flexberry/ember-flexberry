import Ember from 'ember';
import emberFlexberryTranslations from 'ember-flexberry/locales/ru/translations';

const translations = {};
Ember.$.extend(true, translations, emberFlexberryTranslations);

Ember.$.extend(true, translations, {
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
          'language-dropdown': {
            'placeholder': 'Выберете язык'
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
          'flexberry-groupedit': {
            'caption': 'flexberry-groupedit',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
              'title': ''
            }
          },
          'flexberry-lookup': {
            'caption': 'flexberry-lookup',
            'title': '',
            'settings-example': {
              'caption': 'Пример работы с настройками',
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
        }
      }
    },

    'ember-flexberry-dummy-application-user-edit': {
      'caption':'Пользователь приложения',
      'name-caption':'Имя',
      'eMail-caption':'E-mail',
      'phone1-caption':'Номер телефона 1',
      'phone2-caption':'Номер телефона 2',
      'phone3-caption':'Номер телефона 3',
      'activated-caption':'Учетная запись активирована',
      'vK-caption':'VK',
      'facebook-caption':'Facebook',
      'twitter-caption':'Twitter',
      'birthday-caption':'Дата рождения',
      'gender-caption':'Пол',
      'vip-caption':'VIP',
      'karma-caption':'Карма'
    },

    'ember-flexberry-dummy-comment-edit':{
      'caption':'Комментарий',
      'text-caption':'Текст комментария',
      'votes-caption':'Количество голосов',
      'moderated-caption':'Одобрено',
      'author-caption': 'Автор',
      'userVotes-caption':'Голоса пользователей'
    },

    'ember-flexberry-dummy-localization-edit':{
      'caption':'Локализация',
      'name-caption':'Наименование'
    },

    'ember-flexberry-dummy-suggestion-edit':{
      'caption':'Предложение',
      'address-caption':'Адрес',
      'text-caption':'Описание',
      'date-caption':'Дата',
      'votes-caption':'Количество голосов',
      'moderated-caption':'Одобрено',
      'type-caption':'Тип предложения',
      'author-caption':'Автор предложения',
      'editor-caption':'Редактор предложения',
      'files-caption':'Прикрепленные файлы',
      'userVotes-caption':'Голоса пользователей',
      'comments-caption':'Комментарии'
    },

    'ember-flexberry-dummy-suggestion-type-edit':{
      'caption':'Тип предложения',
      'name-caption':'Наименование',
      'moderated-caption':'Одобрено',
      'parent-caption':'Иерархия',
      'localizedTypes-caption':'Локализация типа'
    },

    'ember-flexberry-dummy-application-user-list':{
      'caption':'Пользователи приложения'
    },

    'ember-flexberry-dummy-localization-list':{
      'caption':'Локализация'
    },

    'ember-flexberry-dummy-suggestion-list':{
      'caption':'Предложения'
    },

    'ember-flexberry-dummy-suggestion-type-list':{
      'caption':'Типы предложений'
    },

    'components-examples': {
      'flexberry-checkbox': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-checkbox/settings-example'
        }
      },
      'flexberry-dropdown': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-dropdown/settings-example'
        },
        'conditional-render-example': {
          'caption': 'Components-examples/flexberry-dropdown/conditional-render-example',
          'info-caption': 'Описание варианта использования',
          'info-message': 'Шаблон страницы выглядит следующим образом:<br>' +
            '{{pageTemplate}}' +
            '<br>' +
            'После того как какое-либо значение будет выбрано, компонент будет заменен на ' +
            '&lt;span&gt;selected value&lt;/span&gt;,<br>' +
            'после этого следует проверить консоль браузера, она должна быть чиста от ошибок \"Semantic-UI\" и прочих ошибок.'
        }
      },
      'flexberry-field': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-field/settings-example'
        }
      },
      'flexberry-groupedit': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-groupedit/settings-example'
        }
      },
      'flexberry-lookup': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-lookup/settings-example'
        }
      },
      'flexberry-menu': {
        'settings-example': {
          'caption': 'Components-examples/flexberry-menu/settings-example'
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
    }
  },

  components: {
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
