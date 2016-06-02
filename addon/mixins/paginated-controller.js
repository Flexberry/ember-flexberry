import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['page', 'perPage'],
  page: 1,
  perPage: 5,

  actions: {
    gotoPage: function(pageNum) {
      let num = this._checkPageNumber(pageNum);
      this.set('page', num);
    },
    nextPage: function() {
      let page = this.get('page');
      let nextPage = this._checkPageNumber(page + 1);
      this.set('page', nextPage);
    },
    previousPage: function() {
      let page = this.get('page');
      let prevPage = this._checkPageNumber(page - 1);
      this.set('page', prevPage);
    },
    lastPage: function() {
      let lastPage = this._getLastPage();
      this.set('page', lastPage);
    },
    firstPage: function() {
      this.set('page', 1);
    }
  },

  perPageValues: [5, 10, 20, 50],

  perPageValue: Ember.computed('perPage', {
    get(key) {
      let perPage = this.get('perPage');
      let perPageValues = this.get('perPageValues');
      if (perPageValues.indexOf(perPage) === -1) {
        // Если perPage не будет в perPageValues,
        // то в select-е будет выбрано undefined,
        // => perPage изменится undefined, т.к. на нем биндинг.
        perPageValues.push(perPage);
        perPageValues.sort((a, b) => a - b);
      }

      return perPage;
    },

    set(key, value) {
      let perPage = parseInt(value, 10);

      // Changing perPage value reloads route automatically.
      this.set('perPage', perPage);

      // Check that the current page number does not exceed the last page number.
      let currentPage = this.get('page');
      let newLastPage = this._getLastPage(perPage);
      if (currentPage > newLastPage) {
        // Changing page value reloads route automatically.
        this.set('page', newLastPage);
      }

      return perPage;
    }
  }),

  recordsTotalCount: Ember.computed('model', function() {
    return this.get('model.meta.count');
  }),

  hasPreviousPage: Ember.computed('page', function() {
    return this.get('page') > 1;
  }),

  hasNextPage: Ember.computed('page', 'perPage', 'recordsTotalCount', function() {
    let page = this.get('page');
    let lastPage = this._getLastPage();
    return page < lastPage;
  }),

  pages: Ember.computed('page', 'perPage', 'recordsTotalCount', function() {
    let page = this.get('page');
    let lastPage = this._getLastPage();

    // Pages are shown via list like [1] [2] … [10] {11} [12] … [18] [19], initial and final pages are shown always,
    // and nearest neighbors are and displayed for the current page. In case, when the current page is located in close to the beginning or end
    // list of page is shown accordingly [1] [2] [3] {4} [5] … [18] [19] or [1] [2] … [15] {16} [17] [18] [19].
    const visiblePageCount = 5;
    const visibleEndPageCount = 2;
    let arr = [];

    if (visiblePageCount >= lastPage) {
      // If the total page number do not exceed the number of visible pages.
      for (let i = 1; i <= lastPage; i++) {
        this._addPageNumberIntoArray(arr, i, false);
      }
    } else {
      // Number of visible pages near current page.
      let visibleMidlePageHalfCount =  Math.floor((visiblePageCount - visibleEndPageCount * 2) / 2);

      // Number of visible pages to the left end.
      let leftEndPageCount = page < visibleEndPageCount + visibleMidlePageHalfCount + 1 ?
            visiblePageCount - visibleEndPageCount
            : visibleEndPageCount;

      // Number of visible pages to the right end.
      let rightEndPageCount = page > lastPage - (visibleEndPageCount + visibleMidlePageHalfCount) ?
            visiblePageCount - visibleEndPageCount
            : visibleEndPageCount;

      // Add pages to the left edge.
      for (let i = 1; i <= Math.min(leftEndPageCount, lastPage); i++) {
        this._addPageNumberIntoArray(arr, i, false);
      }

      // Add left ellipsis if needed.
      if (page > visibleEndPageCount + visibleMidlePageHalfCount + 1) {
        this._addPageNumberIntoArray(arr, 0, true);
      }

      // Add middle pades including current page.
      let middleBlockStartPage = Math.max(leftEndPageCount + 1, page - visibleMidlePageHalfCount);
      let middleBlockEndPage = Math.min(page + visibleMidlePageHalfCount, lastPage - rightEndPageCount);
      for (let i = middleBlockStartPage; i <= middleBlockEndPage; i++) {
        this._addPageNumberIntoArray(arr, i, false);
      }

      // Add right ellipsis if needed.
      if (page < lastPage - (visibleEndPageCount + visibleMidlePageHalfCount)) {
        this._addPageNumberIntoArray(arr, 0, true);
      }

      // Add pages to the right edge.
      for (let i = lastPage - rightEndPageCount + 1; i <= lastPage; i++) {
        this._addPageNumberIntoArray(arr, i, false);
      }
    }

    return arr;
  }),

  _addPageNumberIntoArray: function(arr, pageNumber, isEllipsis) {
    let page = this.get('page');
    arr.push({
      number: pageNumber,
      isCurrent: (pageNumber === page),
      isEllipsis: isEllipsis
    });
  },

  _getLastPage: function(perPage = this.get('perPage'), count = this.get('recordsTotalCount')) {
    return Math.ceil(count / perPage);
  },

  _checkPageNumber: function(pageNum) {
    const firstPage = 1;
    let lastPage = this._getLastPage();
    return Math.max(firstPage, Math.min(pageNum, lastPage));
  }
});
