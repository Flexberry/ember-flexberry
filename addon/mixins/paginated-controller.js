import Ember from 'ember';
import Settings from '../models/settings';

export default Ember.Mixin.create({
  perPageValues: [2, 3, 4, 5, 10, 20, 50],

  per_page: Ember.computed('content.pagination.per_page', {
    get(key) {
      var val = this.get('content.pagination.per_page');
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

      // Reload current route.
      this.target.router.refresh();
    }
  }),

  hasPreviousPage: Ember.computed('content.pagination', function() {
    var pagination = this.get('content.pagination');
    return pagination.page > 1;
  }),

  hasNextPage: Ember.computed('content.pagination', function() {
    var pagination = this.get('content.pagination');
    var last = Math.ceil(pagination.count / pagination.per_page);
    return pagination.page < last;
  }),

  pages: Ember.computed('content.pagination', function() {
    var pagination = this.get('content.pagination');
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
    var pagination = this.get('content.pagination');
    arr.push({
      number: pageNumber,
      isCurrent: (pageNumber === pagination.page),
      isEllipsis: isEllipsis
    });
  }
});
