import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  sitemap: {
    nodes: [{
      link: 'index',
      title: 'Home',
      children: null
    }, {
      link: null,
      title: 'Objects',
      children: [{
        link: 'employees',
        title: 'Employees',
        children: null
      }, {
        link: 'orders',
        title: 'Orders',
        children: null
      }]
    }, {
      link: null,
      title: 'Components',
      children: [{
        link: null,
        title: 'flexberry-dropdown',
        children: [{
          link: 'test-flexberry-dropdown',
          title: 'Simple',
          children: null
        }]
      }, {
        link: null,
        title: 'flexberry-groupedit',
        children: [{
          link: 'test-flexberry-groupedit',
          title: 'Simple',
          children: null
        }]
      }]
    }]
  }
});
