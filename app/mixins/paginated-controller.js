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

  perPageValues: [2, 3, 4, 5],

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

    var arr = [];
    for (var i = 1; i <= last; i++)
    {
      arr.push({
        number: i,
        isCurrent: (i === pagination.page)
      });
    }

    return arr;
  })
});
