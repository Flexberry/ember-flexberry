import Ember from 'ember';
import PaginatedControllerMixin from '../mixins/paginated-controller';
import SortableControllerMixin from '../mixins/sortable-controller';

// TODO: refactor beetween controller and route.
export default Ember.Controller.extend(PaginatedControllerMixin, SortableControllerMixin, {
});
