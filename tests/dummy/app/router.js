import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  // /login
  this.route('login');

  // /employees
  this.route('employees');

  // /employee-edit - route for test custom edit form route in f-olv
  this.route('employee-edit', { path: 'employee-edit/:id' });
  this.route('employee-edit.new', { path: 'employee-edit/new' });

  // /employees/2 - render into outlet in application template
  this.route('employee', { path: 'employees/:id' });

  // /employees/new
  this.route('employee.new', { path: 'employees/new' });

  // /orders
  this.route('orders');

  // /orders/2 - render into outlet in application template
  this.route('order', { path: 'orders/:id' });

  // /employees/new
  this.route('order.new', { path: 'orders/new' });

  // /test-flexberry-dropdown
  this.route('test-flexberry-dropdown');

  // /test-flexberry-dropdown-conditional-render
  this.route('test-flexberry-dropdown-conditional-render');

  // /test-flexberry-groupedit-embedding-components
  this.route('test-flexberry-groupedit');

  // /test-flexberry-menu
  this.route('test-flexberry-menu');
});

export default Router;
