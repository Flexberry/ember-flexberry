import Ember from 'ember';

export default Ember.Controller.extend({
  title: 'Test flexberry-contextmenu',

  items: [{
  	icon: 'search icon',
  	title: 'Search (after icon)',
  	titleIsBeforeIcon: false,
  	items: null
  }, {
  	icon: 'setting icon',
  	title: 'Setting (before icon)',
  	titleIsBeforeIcon: true,
  	items: null
  }, {
  	icon: 'list layout icon',
  	title: 'Submenu',
  	items: [{
	  icon: 'search icon',
	  title: 'Search (after icon)',
	  titleIsBeforeIcon: false,
	  items: null
	}, {
	  icon: 'setting icon',
	  title: 'Setting (before icon)',
	  titleIsBeforeIcon: true,
	  items: null
	}, {
	  icon: 'list layout icon',
	  title: 'Submenu',
	  items: [{
		  icon: 'search icon',
		  title: 'Search (after icon)',
		  titleIsBeforeIcon: false,
		  items: null
		}, {
		  icon: 'setting icon',
		  title: 'Setting (before icon)',
		  titleIsBeforeIcon: true,
		  items: null
		}, {
		  icon: 'list layout icon',
		  title: 'Submenu',
		  items: null
		}]
	}]
  }]
});
