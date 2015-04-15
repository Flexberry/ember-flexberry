import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
    // /login
    this.route('login');

    // /employees
    this.resource('employees', function() {
        //// /employees/2 - render into outlet in employees template
        //this.resource('employee', {path: ':id'});

        //// /employees/new
        //this.route('new');

        this.route('page', { path: 'page/:page' });
    });

    // /employees/2 - render into outlet in application template
    this.resource('employee', {path: 'employees/:id'});

    // /employees/new
    this.resource('employee.new', { path: 'employees/new' });
});
