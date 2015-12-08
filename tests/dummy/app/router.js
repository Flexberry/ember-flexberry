import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  // /login
  this.route('login');

  // /employees
  this.route('employees', function() {
    //// /employees/2 - render into outlet in employees template
    //this.resource('employee', {path: ':id'});

    //// /employees/new
    //this.route('new');

    this.route('page', { path: 'page/:page' });
  });

  // /employees/2 - render into outlet in application template
  this.route('employee', {path: 'employees/:id'});

  // /employees/new
  this.route('employee.new', { path: 'employees/new' });

  // /orders
  this.route('orders', function() {
    this.route('page', { path: 'page/:page' });
  });

  // /orders/2 - render into outlet in application template
  this.route('order', {path: 'orders/:id'});

  // /employees/new
  this.route('order.new', { path: 'orders/new' });
});

export default Router;
