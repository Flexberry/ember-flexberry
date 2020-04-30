/**
  @module ember-flexberry
 */

import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

/**
  Mixin for controller, that pagination support.

  @example
    ```javascript
    // app/controllers/employees.js
    import Controller from '@ember/controller';
    import PaginatedController from 'ember-flexberry/mixins/paginated-controller'
    export default Controller.extend(PaginatedController, {
    });
    ```

    ```javascript
    // app/routes/employees.js
    import Route from '@ember/routing/route';
    import PaginatedRoute from 'ember-flexberry/mixins/paginated-route'
    export default Route.extend(PaginatedRoute, {
    });
    ```

    ```handlebars
    <!-- app/templates/employees.hbs -->
    ...
    {{flexberry-objectlistview
      ...
      pages=pages
      recordsTotalCount=recordsTotalCount
      perPageValue=perPageValue
      perPageValues=perPageValues
      hasPreviousPage=hasPreviousPage
      hasNextPage=hasNextPage
      previousPage=(action 'previousPage')
      gotoPage=(action 'gotoPage')
      nextPage=(action 'nextPage')
      ...
    }}
    ...
    ```

  @class PaginatedController
  @uses <a href="https://www.emberjs.com/api/ember/release/classes/Mixin">Mixin</a>
 */
export default Mixin.create({
  /**
    Start page.

    @property page
    @type Number
    @default 1
  */
  page: 1,

  /**
    Count records on page.

    @property perPage
    @type Number
    @default 5
  */
  perPage: 5,

  /**
    User selectable options values for `perPage`.

    @property perPageValues
    @type Array
    @default [5, 10, 20, 50]
  */
  perPageValues: [5, 10, 20, 50],

  /**
    Get or set `perPage` value.

    @property perPageValue
    @type Number
  */
  perPageValue: computed('perPage', {
    /* eslint-disable no-unused-vars */
    get(key) {
      let perPage = this.get('perPage');
      /*let perPageValues = this.get('perPageValues');
      if (perPageValues.indexOf(perPage) === -1) {
        // Если perPage не будет в perPageValues,
        // то в select-е будет выбрано undefined,
        // => perPage изменится undefined, т.к. на нем биндинг.
        perPageValues.push(perPage);
        perPageValues.sort((a, b) => a - b);
      }*/

      return perPage;
    },

    set(key, value) {
      let perPage = parseInt(value, 10);

      // Check that the current page number does not exceed the last page number.
      let currentPage = this.get('page');
      let newLastPage = this._getLastPage(perPage);
      if (currentPage > newLastPage) {
        // Changing page or perPage value reloads route automatically.
        this.setProperties({
          page: newLastPage,
          perPage: perPage
        });
      } else {
        // Changing perPage value reloads route automatically.
        this.set('perPage', perPage);
      }

      return perPage;
    }
    /* eslint-enable no-unused-vars */
  }),

  /**
    Total count records.

    @property recordsTotalCount
    @type Number
    @readOnly
  */
  recordsTotalCount: computed('model', function() {
    return this.get('model.meta.count');
  }),

  /**
    If `true` next page exists.

    @property hasNextPage
    @type Boolean
    @readOnly
  */
  hasNextPage: computed('page', 'perPage', 'recordsTotalCount', function() {
    let page = this.get('page');
    let lastPage = this._getLastPage();
    return page < lastPage;
  }),

  /**
    If `true` previous page exists.

    @property hasPreviousPage
    @type Boolean
    @readOnly
  */
  hasPreviousPage: computed('page', function() {
    return this.get('page') > 1;
  }),

  /**
    Array of objects corresponding to list of pages.

    Each page is presented as object with following properties:
    - **number** - Number of page.
    - **isCurrent** - Page is current.
    - **isEllipsis** - If `true` this page not showing in list.

    @property pages
    @type Array
    @readOnly
  */
  pages: computed('page', 'perPage', 'recordsTotalCount', function() {
    let page = this.get('page');
    let lastPage = this._getLastPage();

    // Pages are shown via list like [1] … [10] {11} [12] … [19], initial and final pages are shown always,
    // and nearest neighbors are and displayed for the current page. In case, when the current page is located in close to the beginning or end
    // list of page is shown accordingly [1] [2] {3} [4] … [19] or [1] … [16] {17} [18] [19].
    const visiblePageCount = 5;
    const visibleEndPageCount = 1;
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

  /**
    Defines which query parameters the controller accepts. [More info.](https://emberjs.com/api/ember/release/classes/Controller#property_queryParams).

    @property queryParams
    @type Array
    @default ['page', 'perPage']
  */
  queryParams: ['page', 'perPage'],

  pagesTotalCount: computed('perPage', 'recordsTotalCount', function() {
    return this._getLastPage();
  }),

  actions: {
    /**
      Transition to page with number.

      @method actions.gotoPage
      @param {Number} pageNum Number of page.
    */
    gotoPage(pageNum) {
      let num = this._checkPageNumber(pageNum);
      this.set('page', num);
    },

    /**
      Transition to next page.

      @method actions.nextPage
    */
    nextPage() {
      let page = this.get('page');
      let nextPage = this._checkPageNumber(page + 1);
      this.set('page', nextPage);
    },

    /**
      Transition to previous page.

      @method actions.previousPage
    */
    previousPage() {
      let page = this.get('page');
      let prevPage = this._checkPageNumber(page - 1);
      this.set('page', prevPage);
    },

    /**
      Transition to last page.

      @method actions.lastPage
    */
    lastPage() {
      let lastPage = this._getLastPage();
      this.set('page', lastPage);
    },

    /**
      Transition to first page.

      @method actions.firstPage
    */
    firstPage() {
      this.set('page', 1);
    },
  },

  /**
    Add page number into array.

    @method _addPageNumberIntoArray
    @param {Array} arr Array pages.
    @param {Number} pageNumber Number of page.
    @param {Boolean} isEllipsis If `true` this page not showing in list.
    @private
  */
  _addPageNumberIntoArray(arr, pageNumber, isEllipsis) {
    let page = this.get('page');
    arr.push({
      number: pageNumber,
      isCurrent: (pageNumber === page),
      isEllipsis: isEllipsis
    });
  },

  /**
    Get number last page.

    @method _getLastPage
    @param {Number} perPage Count records on page.
    @param {Number} count Total count records.
    @return {Number} Number last page.
    @private
  */
  _getLastPage(perPage = this.get('perPage'), count = this.get('recordsTotalCount')) {
    let lastPage = Math.ceil(count / perPage);
    return lastPage > 0 ? lastPage : 1;
  },

  /**
    Check there is a page with this number.

    @method _checkPageNumber
    @param {Number} pageNum Number of page.
    @return {Boolean} If page exists, return `pageNum`, else, return `lastPage`.
    @private
  */
  _checkPageNumber(pageNum) {
    const firstPage = 1;
    let lastPage = this._getLastPage();
    return Math.max(firstPage, Math.min(pageNum, lastPage));
  }
});
