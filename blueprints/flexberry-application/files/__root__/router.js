import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function () {
  // /login
  this.route('login');

<%=routes%>

});

export default Router;
