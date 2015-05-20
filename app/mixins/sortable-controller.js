import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['sort'],

  getNextSortDirection: function(currentDirection) {
    return currentDirection === 'asc' ? 'desc' : 'none';
  },

  computedSorting: Ember.computed('model.sorting', function() {
    var sorting = this.get('model.sorting'),
        result = {};

    if (sorting) {
      for (var i = 0; i < sorting.length; i++) {
        var propName = sorting[i].propName,
            sortDef = {
              sortAscending: sorting[i].direction === 'asc' ? true : false,
              sortNumber: i + 1
            };
        result[propName] = sortDef;
      }
    }

    return result;
  }),

  columnIsSorted: function(propName) {

  },

  actions: {
    /**
     * Использовать заданную колонку для сортировки. Сортировка по другим колонкам при этом отключается.
     *
     * @param {String} propName Имя свойства, которое нужно использовать для сортировки.
     */
    sortByColumn: function(propName) {
      var oldSorting = this.get('model.sorting'),
          newSorting = [],
          sortDirection;
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

      this.send('applySorting', newSorting);
    },

    /**
     * Изменить сортировку по заданной колонке, не трогая остальные. Вызывается при клике по ячейке с нажатой
     * клавишей ctrl.
     *
     * @param {String} propName Имя свойства, по которому нужно изменить параметры сортировки.
     */
    addColumnToSorting: function(propName) {
      var oldSorting = this.get('model.sorting'),
          newSorting = [],
          changed = false;

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

      this.send('applySorting', newSorting);
    }
  }
});
