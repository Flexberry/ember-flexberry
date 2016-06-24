import Ember from 'ember';
const { getOwner } = Ember;

export default Ember.Mixin.create({
  queryParams: ['sort'],
  sortDefaultValue: null,
  sort: Ember.computed.oneWay('sortDefaultValue'),
  _userSettingsService: Ember.inject.service('user-settings-service'),
  _router: undefined,

  getNextSortDirection: function(currentDirection) {
    return currentDirection === 'asc' ? 'desc' : 'none';
  },

  computedSorting: Ember.computed('model.sorting', function() {
    var sorting = this.get('model.sorting');
    var result = {};

    if (sorting) {
      for (var i = 0; i < sorting.length; i++) {
        var propName = sorting[i].propName;
        var sortDef = {
          sortAscending: sorting[i].direction === 'asc' ? true : false,
          sortNumber: i + 1
        };
        result[propName] = sortDef;
      }
    }

    return result;
  }),

  /**
   * Производит операцию, обратную методу deserializeSortingParam.
   *
   * @param {Object} sorting Объект с параметрами сортировки, который нужно преобразовать в строку.
   * @returns {String} Результирующая строка.
   */
  serializeSortingParam: function(sorting) {
    return sorting.map(function(element) {
      return (element.direction === 'asc' ? '+' : '-') + element.propName;
    }).join('') || this.get('sortDefaultValue');
  },

  actions: {

    sortByColumn: function(column) {
      var propName = column.propName;
      var oldSorting = this.get('model.sorting');
      var newSorting = [];
      var sortDirection;
      if (oldSorting) {
        sortDirection = 'asc';
        for (var i = 0; i < oldSorting.length; i++) {
          if (oldSorting[i].propName === propName) {
            sortDirection = this.getNextSortDirection(oldSorting[i].direction);
            break;
          }
        }
      } else {
        sortDirection = 'asc';
      }

      if (sortDirection !== 'none') {
        newSorting.push({ propName: propName, direction: sortDirection });
      }

      let sortQueryParam = this.serializeSortingParam(newSorting);
      if ('userSettings' in this) { // NON modal window
        this.userSettings.sorting = newSorting;
        let router = getOwner(this).lookup('router:main');
        let moduleName =  router.currentRouteName;
        let savePromise = this.get('_userSettingsService').
          saveUserSetting({
            moduleName: moduleName,
            settingName: 'DEFAULT',
            userSetting: { sorting: newSorting }
          }
        );
        savePromise.then(
          record => {
            this.set('sort', sortQueryParam);
          }
        );
      } else {
        this.set('sort', sortQueryParam);
      }
    },

    addColumnToSorting: function(column) {
      var propName = column.propName;
      var oldSorting = this.get('model.sorting');
      var newSorting = [];
      var changed = false;

      for (var i = 0; i < oldSorting.length; i++) {
        if (oldSorting[i].propName === propName) {
          var newDirection = this.getNextSortDirection(oldSorting[i].direction);
          if (newDirection !== 'none') {
            newSorting.push({ propName: propName, direction: newDirection });
          }

          changed = true;
        } else {
          newSorting.push(oldSorting[i]);
        }
      }

      if (!changed) {
        newSorting.push({ propName: propName, direction: 'asc' });
      }

      let sortQueryParam = this.serializeSortingParam(newSorting);
      if ('userSettings' in this) { // NON model window
        this.userSettings.sorting = newSorting;
        let router = getOwner(this).lookup('router:main');
        let moduleName =  router.currentRouteName;
        let savePromise = this.get('_userSettingsService').
          saveUserSetting({
            moduleName: moduleName,
            settingName: 'DEFAULT',
            userSetting: { sorting: newSorting }
          }
        );
        savePromise.then(
          record => {
            this.set('sort', sortQueryParam);
          }
        );
      } else {
        this.set('sort', sortQueryParam);
      }
    }
  }
});
