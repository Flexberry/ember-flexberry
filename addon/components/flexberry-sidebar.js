/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import $ from 'jquery';

/**
  Sidebar component based on Semantic UI Sidebar module.
  See [Semantic UI API](https://semantic-ui.com/modules/sidebar.html) and [EmberJS API](https://emberjs.com/api/).

  @class FlexberrySidebarComponent
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
*/
export default Component.extend({
  /**
    See [EmberJS API](https://emberjs.com/api/).

    @property classNames
  */
  classNames: ['ui', 'sidebar'],

  /**
    See [Semantic UI API](https://semantic-ui.com/modules/sidebar.html).

    @property settings
    @type Object
  */
  settings: undefined,

  /**
    See [EmberJS API](https://emberjs.com/api/).

    @method didInsertElement
  */
  didInsertElement() {
    this._super(...arguments);

    let settings = $.extend({
      context: '.ember-application > .ember-view',
    }, this.get('settings'));

    this.$().sidebar(settings);
  },

  /**
    See [EmberJS API](https://emberjs.com/api/).

    @method willDestroyElement
  */
  willDestroyElement() {
    this._super(...arguments);

    this.$().sidebar('destroy');
  },
});
