import Ember from 'ember';

export default Ember.Mixin.create({
  per_page: function() {
    var val = this.get('content.pagination.per_page');
    if (!this.perPageValues.contains(val)) {
      // Если per_page не будет в perPageValues,
      // то в select-е будет выбрано undefined,
      // => per_page изменится undefined, т.к. на нем биндинг.
      this.perPageValues.push(val);
      this.perPageValues.sort();
    }

    return val;
  }.property('content.pagination.per_page'),

  savePerPage: function() {
    // Save setting.
    var model = this.controllerFor('application').get('model');
    model.set('perPage', this.get('per_page'));
    model.save();

    // Reload current route.
    this.target.router.refresh();
  }.observes('per_page'),

  perPageValues: [2, 3, 4, 5, 10, 20, 50],
  

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

	// Страницы отображаются списком вида [1] [2] … [10] {11} [12] … [18] [19], т.е. начальные и конечные страницы отображаются всегда,
	// а для текущей отображаются ее ближающие соседи.  В случае, если текущая страница находится в непосредственной близости от начала или конца, // список соответственно отображается [1] [2] [3] {4} [5] … [18] [19] или [1] [2] … [15] {16} [17] [18] [19]	
	var VISIBLE_PAGE_COUNT = 7;
	var VISIBLE_END_PAGE_COUNT = 2;
	var i =0;
    var arr = [];
	
	if (VISIBLE_PAGE_COUNT >= last) // Отдельно обработаем случай, при котором число доступных страниц меньше максимально видимого, т.к. в //противном случае вычисления становятся слишком сложными.
	{
		for (i = 1; i <= last; i++)
		{
			this.addPageNumberIntoArray(arr, i, false);
		}
	}
	else
	{
		// Число видимых страниц слева и справой от текущей, если слева и справа от текущей страницы многоточия.
		var visibleMidlePageHalfCount =  Math.floor((VISIBLE_PAGE_COUNT - VISIBLE_END_PAGE_COUNT * 2) / 2);
		
		// Число видимых страниц с левого края.
		var leftEndPageCount = pagination.page < VISIBLE_END_PAGE_COUNT + visibleMidlePageHalfCount + 1 ?
			VISIBLE_PAGE_COUNT - VISIBLE_END_PAGE_COUNT : VISIBLE_END_PAGE_COUNT;
		
		// Число видимых конечных с правого края.
		var rightEndPageCount = pagination.page > last - (VISIBLE_END_PAGE_COUNT + visibleMidlePageHalfCount) ?
			VISIBLE_PAGE_COUNT - VISIBLE_END_PAGE_COUNT: VISIBLE_END_PAGE_COUNT;
		
		// Добавляем страницы с левого края.
		for (i = 1; i <= Math.min(leftEndPageCount, last); i++)
		{
			this.addPageNumberIntoArray(arr, i, false);
		}
		
		// При необходимости отобразим левое относительно текущей страницы многоточие.	
		if (pagination.page > VISIBLE_END_PAGE_COUNT + visibleMidlePageHalfCount + 1)
		{
			this.addPageNumberIntoArray(arr, 0, true);
		}
		
		// Добавляем страницы среднего блока, включающего текущую страницу.
		var middleBlockStartPage = Math.max(leftEndPageCount + 1, pagination.page-visibleMidlePageHalfCount);
		var middleBlockEndPage = Math.min(pagination.page + visibleMidlePageHalfCount, last - rightEndPageCount);
		for (i = middleBlockStartPage; i <= middleBlockEndPage; i++)
		{
			this.addPageNumberIntoArray(arr, i, false);
		}
		
		// При необходимости отобразим правое относительно текущей страницы многоточие.
		if (pagination.page < last - (VISIBLE_END_PAGE_COUNT+visibleMidlePageHalfCount))
		{
			this.addPageNumberIntoArray(arr, 0, true);
		}
		
		// Добавляем страницы с правого края.	

		for (i = last - rightEndPageCount+1; i <= last; i++)
		{
			this.addPageNumberIntoArray(arr, i, false);
		}
	}
	return arr;
  }),
  
  addPageNumberIntoArray: function(arr, pageNumber, isEllipsis) {
	var pagination = this.get('content.pagination');
	
	arr.push({
        number: pageNumber,
        isCurrent: (pageNumber === pagination.page),
		isEllipsis:isEllipsis
      });
  }
  
});
