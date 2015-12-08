import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['sort'],

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

      this.send('applySorting', newSorting);
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

      this.send('applySorting', newSorting);
    }
  }
});
