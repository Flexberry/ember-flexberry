import Ember from 'ember';
import Settings from '../models/settings';

export default Ember.Mixin.create({
  queryParams: ['page'],
  page: 1,

  perPageValues: [2, 3, 4, 5, 10, 20, 50],

  actions: {
    gotoPage: function(pageNum) {
      var num = this._getNum(pageNum);
      this.transitionToPageRoute(num);
    },
    nextPage: function() {
      var pagination = this.get('model.pagination');
      var num = this._getNum(pagination.page + 1, pagination);
      this.transitionToPageRoute(num);
    },
    previousPage: function() {
      var pagination = this.get('model.pagination');
      var num = this._getNum(pagination.page - 1, pagination);
      this.transitionToPageRoute(num);
    },
    lastPage: function() {
      var last = this._getLast();
      this.transitionToPageRoute(last);
    },
    firstPage: function() {
      this.transitionToPageRoute(1);
    }
  },

  per_page: Ember.computed('model.pagination.per_page', {
    get(key) {
      var val = this.get('model.pagination.per_page');
      if (this.perPageValues.indexOf(val) === -1) {
        // Если per_page не будет в perPageValues,
        // то в select-е будет выбрано undefined,
        // => per_page изменится undefined, т.к. на нем биндинг.
        this.perPageValues.push(val);
        this.perPageValues.sort((a, b) => a - b);
      }

      return val;
    },
    set(key, value) {
      // Save setting.
      let settings = Settings.create();
      value = parseInt(value, 10);
      settings.set('perPage', value);

      // Check that the current page number does not exceed the last page number.
      var currentPage = this._getCurrent();
      var newLastPage = this._getLast({
        count: this.get('model.pagination.count'),
        per_page: value
      });

      if (currentPage > newLastPage) {
        // Changing page value reloads route automatically.
        this.set('page', newLastPage);
      } else {
        // Reload current route.
        this.target.router.refresh();
      }
    }
  }),

  hasPreviousPage: Ember.computed('model.pagination', function() {
    var pagination = this.get('model.pagination');
    return pagination.page > 1;
  }),

  hasNextPage: Ember.computed('model.pagination', function() {
    var pagination = this.get('model.pagination');
    var last = Math.ceil(pagination.count / pagination.per_page);
    return pagination.page < last;
  }),

  pages: Ember.computed('model.pagination', function() {
    var pagination = this.get('model.pagination');
    var last = Math.ceil(pagination.count / pagination.per_page);

    // Pages are shown via list like [1] [2] … [10] {11} [12] … [18] [19], initial and final pages are shown always,
    // and nearest neighbors are and displayed for the current page. In case, when the current page is located in close to the beginning or end
    // list of page is shown accordingly [1] [2] [3] {4} [5] … [18] [19] or [1] [2] … [15] {16} [17] [18] [19].
    var visiblePageCount = 7;
    var visibleEndPageCount = 2;
    var i = 0;
    var arr = [];

    if (visiblePageCount >= last) {
      // If the total page number do not exceed the number of visible pages.
      for (i = 1; i <= last; i++) {
        this._addPageNumberIntoArray(arr, i, false);
      }
    } else {
      // Number of visible pages near current page.
      var visibleMidlePageHalfCount =  Math.floor((visiblePageCount - visibleEndPageCount * 2) / 2);

      // Number of visible pages to the left end.
      var leftEndPageCount =
          pagination.page < visibleEndPageCount + visibleMidlePageHalfCount + 1 ?
            visiblePageCount - visibleEndPageCount : visibleEndPageCount;

      // Number of visible pages to the right end.
      var rightEndPageCount =
          pagination.page > last - (visibleEndPageCount + visibleMidlePageHalfCount) ?
            visiblePageCount - visibleEndPageCount : visibleEndPageCount;

      // Add pages to the left edge.
      for (i = 1; i <= Math.min(leftEndPageCount, last); i++) {
        this._addPageNumberIntoArray(arr, i, false);
      }

      // Add left ellipsis if needed
      if (pagination.page > visibleEndPageCount + visibleMidlePageHalfCount + 1) {
        this._addPageNumberIntoArray(arr, 0, true);
      }

      // Add middle pades including current page.
      var middleBlockStartPage = Math.max(leftEndPageCount + 1, pagination.page - visibleMidlePageHalfCount);
      var middleBlockEndPage = Math.min(pagination.page + visibleMidlePageHalfCount, last - rightEndPageCount);
      for (i = middleBlockStartPage; i <= middleBlockEndPage; i++) {
        this._addPageNumberIntoArray(arr, i, false);
      }

      // Add right ellipsis if needed.
      if (pagination.page < last - (visibleEndPageCount + visibleMidlePageHalfCount)) {
        this._addPageNumberIntoArray(arr, 0, true);
      }

      // Add pages to the right edge.
      for (i = last - rightEndPageCount + 1; i <= last; i++) {
        this._addPageNumberIntoArray(arr, i, false);
      }
    }

    return arr;
  }),

  _addPageNumberIntoArray: function(arr, pageNumber, isEllipsis) {
    var pagination = this.get('model.pagination');
    arr.push({
      number: pageNumber,
      isCurrent: (pageNumber === pagination.page),
      isEllipsis: isEllipsis
    });
  },

  _getCurrent: function(pagination = this.get('model.pagination')) {
    return pagination.page;
  },

  _getLast: function(pagination = this.get('model.pagination')) {
    return Math.ceil(pagination.count / pagination.per_page);
  },

  _getNum: function(pageNum, pagination = this.get('model.pagination')) {
    var last = this._getLast(pagination);
    return Math.max(1, Math.min(pageNum, last));
  },

  transitionToPageRoute: function(pageNum) {
    this.set('page', pageNum);
  }
});
