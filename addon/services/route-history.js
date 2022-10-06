import Ember from 'ember';
import { get } from '@ember/object';

const {
  isEmpty,
  Service,
  computed,
  isBlank
} = Ember;

/**
 * Сервис для хранения и получения истории посещений роутов в приложении.
 */
export default Service.extend({
  /**
   * Внутреннее хранилище истории роутов (в прямом хронологическом порядке).
   *
   * @type {Array<Object>}
   */
  _routeHistory: null,

  /**
   * Последний роут с которого перешли, не удаляется по кнопкам "Закрыть", "Назад"
   *
   * @type {Array<string>}
   */
  _lastRoute: null,

  /**
   * Максимальное число хранящихся в истории роутов.
   *
   * @type {number}
   */
  maxEntries: 10,

  init() {
    this._super(...arguments);

    this._routeHistory = this._routeHistory || [];
    this._lastRoute = this._lastRoute || [];
  },

  /**
   * Возвращает последний сохраненный в истории роутов (т.е. текущий).
   *
   * @type {Object}
   */
  currentRoute: computed('_routeHistory', '_routeHistory.[]', function () {
    let length = get(this, '_routeHistory').length;
    if (length > 0) {
      return get(this, '_routeHistory').objectAt(length - 1);
    }

    return null;
  }),

  /**
   * Возвращает предыдущий сохраненный роут.
   *
   * @type {Object}
   */
  previousRoute: computed('_routeHistory', '_routeHistory.[]', function () {
    let length = get(this, '_routeHistory.length');
    if (length > 1) {
      return this._routeHistory.objectAt(length - 2);
    }

    return null;
  }),

  /**
   * Возвращает всю сохраненную историю роутов (в прямом хронологическом порядке).
   *
   * @type {Array<Object>}
   */
  wholeHistory: computed('_routeHistory', '_routeHistory.[]', function () {
    return this._routeHistory.toArray();
  }),

  /**
   * Добавить информацию о роуте в историю. Если имя последнего роута в истории совпадает с добавляемым,
   * то добавляемый роут заменяет имеющийся.
   *
   * @param {string} routeName Имя роута, который нужно добавить в историю.
   * @param {Array<string>} contexts Массив значений, которые вставляются динамические сегменты, имеющиеся в пути.
   * @param {Object} queryParams Ассоциативный массив параметров запроса и их значений.
   */
  pushRoute: function (routeName, contexts, queryParams) {
    routeName = routeName || '';

    let isEditForm = routeName.indexOf('-e', routeName.length - 2) > -1;
    let isListForm = routeName.indexOf('-l', routeName.length - 2) > -1;

    // Когда на какой то форме обновляешь страницу роут для Е формы приходит с id
    // обработатка того что обновились на Е форме
    if (routeName.includes('/') && !isEditForm && !isListForm) {
      let url = routeName;
      url = url.indexOf('/') === 0 ? url.substring(1) : url;
      let ids = url;
      let id = Array.isArray(ids) ? ids[0] : false;
      if (id) {
        isEditForm = true;
        routeName = routeName.substring(0, routeName.indexOf('-e/') + 2);
        routeName = routeName.indexOf('/') === 0 ? routeName.substring(1) : routeName;
        contexts = !isEmpty(contexts) ? contexts : [id];
      }
    }

    let currentRoute = get(this, 'currentRoute');
    if (currentRoute && currentRoute.routeName === routeName) {
      // Если имя добавляемого роута совпадает с текущим, удаляем текущий, чтобы заменить новым.
      this._routeHistory.pop();
    }

    let routeObject = {
      routeName: routeName,
      contexts: contexts,
      queryParams: queryParams,
      isEditForm: isEditForm,
      isListForm: isListForm
    };

    this._routeHistory.push(routeObject);
    this._lastRoute.push(routeObject);

    if (this._routeHistory.length > get(this, 'maxEntries')) {
      // Если длина истории после добавления превышает допустимую, удаляем элемент из начала массива (самую старую запись).
      this._routeHistory.shift();
    }

    if (this._lastRoute.length > 3) {
      // Если длина истории после добавления превышает допустимую, удаляем элемент из начала массива (самую старую запись).
      this._lastRoute.shift();
    }
  },

  /**
   * Возвращает предыдущий роут
   */
  lastRoute: computed('_lastRoute', '_lastRoute.[]', function () {
    return this._lastRoute[1];
  }),

  /**
   * Удаляет указанное количество роутов из истории.
   *
   * @param {number} routesCount Количество роутов, которые надо удалить из истории. Если больше количества элементов в истории,
   *                             оставит только один.
   */
  popRoutes: function(routesCount) {
    let historyLength = get(this, '_routeHistory.length');
    if (historyLength < 2) {
      return;
    }

    // Если шагов больше, чем пунктов в истории, ограничиваем количество шагов.
    if (routesCount > historyLength - 1) {
      routesCount = historyLength - 1;
    }

    // Удаляем из истории информацию о последних роутах в соответствии с количеством шагов.
    for (let i = 0; i < routesCount; i++) {
      this._routeHistory.popObject();
    }
  },

  /**
   * Получить роут, бывший ранее на заданное количество шагов. Роуты, следующие за ним, из истории удаляются.
   *
   * @param {number} stepsCount Количество шагов, на которое надо перейти назад. Если больше количества элементов в истории,
   *                            происходит переход на первый роут из истории.
   */
  routeBackAt: function (stepsCount) {
    let historyLength = get(this, '_routeHistory.length');
    if (historyLength < 2) {
      return;
    }

    // Если шагов больше, чем пунктов в истории, ограничиваем количество шагов.
    if (stepsCount > historyLength - 1) {
      stepsCount = historyLength - 1;
    }

    // Сохраняем роут, который нужно будет вернуть, перед чисткой истории.
    let result = this._routeHistory[this._routeHistory.length - stepsCount - 1];

    // Удаляем из истории информацию о последних роутах в соответствии с количеством шагов.
    for (let i = 0; i < stepsCount; i++) {
      this._routeHistory.popObject();
    }

    return result;
  },

  /**
   * Сохраняет информацию о последнем роуте в хранилище сессии.
   * @param {Array<string>} exceptions Адреса роутов, которые не нужно сохранять.
   */
  saveCurrentRouteToSessionStorage(exceptions) {
    const storageKey = 'customRedirectInfo';

    let lastRoute = get(this, 'currentRoute');
    let saveFlag = !isBlank(lastRoute && lastRoute.routeName) &&
      !exceptions.some(route => route === lastRoute.routeName.split('?')[0]);

    if (saveFlag) {
      sessionStorage.setItem(storageKey, JSON.stringify(lastRoute || ''));
    }
  },

  /**
   * Удаляет из истории роуты форм редактирования по имени и иду объекта.
   * Для корректной работы навигации также удалятся некоторые предшествующие роуты
   * @param {string} delRouteName Название роута формы редактирования
   * @param {string} delId Ид объекта
   */
  removeRoutesForObject(delRouteName, delId) {
    let historyLength = get(this, '_routeHistory.length');
    if (historyLength < 2) {
      return;
    }

    for (let i = historyLength - 1; i >= 0; i--) {
      if (this._routeHistory[i].routeName === delRouteName) {
        let route = this._routeHistory[i];
        let del = false;

        if (!isBlank(route.contexts)) {
          del = route.contexts.some(function(context) {
            // context может быть строкой, а может быть объектом с атрибутом id
            if (typeof context === 'string') {
              return context.toLowerCase() === delId.toLowerCase();
            } else {
              if (context.id !== undefined) {
                return context.id.toLowerCase() === delId.toLowerCase();
              }
            }
          });
        }

        if (del) {
          // удалить найденный и предшествующий (если есть) роуты из истории
          if (i > 0) {
            if (i > 2 &&
              this._routeHistory[i - 1].routeName.endsWith('.new') &&
              this._routeHistory[i - 1].routeName.startsWith(delRouteName)) {
              // если создали объект и сразу его удаляют, надо исключить 3 роута:
              // текущая edit форма, new edit форма и list форма
              this._routeHistory.splice(i - 2, 3);

              i -= 2;
            } else {
              this._routeHistory.splice(i - 1, 2);
              i--;
            }
          } else {
            this._routeHistory.splice(i, 1);
          }
        }
      }
    }
  }
});
