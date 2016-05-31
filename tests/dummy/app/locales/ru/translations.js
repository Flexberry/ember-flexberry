import Ember from 'ember';
import emberFlexberryTranslations from 'ember-flexberry/locales/ru/translations';

const translations = {};
Ember.merge(translations, emberFlexberryTranslations);

Ember.merge(translations, {
  'home': {
    'greeting': 'Добро пожаловать на тестовый стенд ember-flexberry!'
  },

  'header': {
    'toolbar': {
      'menu': {
        'title': 'Меню'
      }
    }
  },

  'site-map': {
    'brand': {
      title: 'Тестовый стенд ember-flexberry'
    },
    'addon-version': {
      title: 'Версия аддона {{version}}',
      'link': {
        'title': 'Это версия аддона ember-flexberry, которая сейчас используется в этом тестовом приложении ' +
        '(версия npm-пакета + хэш коммита). ' +
        'Кликните, чтобы перейти на GitHub.'
      }
    },
    'home': {
      'title': 'Главная'
    },
    'application': {
      'title': 'Приложение'
    },
    'application-users': {
      'title': 'Пользователи приложения'
    },
    'localizations': {
      'title': 'Локализации'
    },
    'suggestion-types': {
      'title': 'Типы предложений'
    },
    'suggestions': {
      'title': 'Предложения'
    },
    'components-examples': {
      'title': 'Примеры компонентов',
      'flexberry-checkbox': {
        'settings-example': {
          title: 'Пример работы с настройками'
        }
      },
      'flexberry-dropdown': {
        'settings-example': {
          title: 'Пример работы с настройками'
        },
        'conditional-render-example': {
          'title': 'Пример условного рендеринга'
        }
      },
      'flexberry-menu': {
        'settings-example': {
          title: 'Пример работы с настройками'
        }
      },
      'flexberry-lookup': {
        'settings-example': {
          title: 'Пример работы с настройками'
        }
      },
      'flexberry-groupedit': {
        'settings-example': {
          title: 'Пример работы с настройками'
        }
      }
    }
  },

  'footer': {
    'brand': {
      title: 'Тестовый стенд ember-flexberry'
    },
    'addon-version': {
      title: 'Версия аддона {{version}}',
      'link': {
        'title': 'Это версия аддона ember-flexberry, которая сейчас используется в этом тестовом приложении ' +
        '(версия npm-пакета + хэш коммита). ' +
        'Кликните, чтобы перейти на GitHub.'
      }
    }
  },

  components: {
    'settings-example': {
      'component-template-header': 'Шаблон компонента',
      'controller-properties-header': 'Свойства контроллера',
      'component-current-settings-header': 'Текущие настройки компонента',
      'component-default-settings-header': 'Настройки компонента по умолчанию',
      'component-header': 'Компонент с примененными текущими настройками'
    }
  }
});

export default translations;
