/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Component for sitemap render from the object with links.

  @example
    templates/my-form.hbs
    ```handlebars
    {{flexberry-sitemap sitemap=sitemap}}
    ```

  @class FlexberrySitemapComponent
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
*/
export default Ember.Component.extend({
  /**
    Object with links description.

    @example
      ```javascript
      {
        nodes: [
          {
            link: 'index',
            caption: 'Home',
            title: 'Go to homepage!',
          },
          {
            caption: 'Superheroes',
            children: [
              {
                link: 'superman',
                caption: 'Superman',
              },
              {
                link: 'ironman',
                caption: 'Ironman',
              },
            ],
          },
        ],
      }
      ```

    @property sitemap
    @type Object
  */
  sitemap: undefined,

  /**
    Stores node state.

    @property nodeIsOpen
    @type Boolean
    @default 'false'
  */
  nodeIsOpen: false,

  actions: {
    /**
      Show or hide menu.

      @method actions.menuToggle
    */
    menuToggle() {
      this.$('.subMenu:first').toggleClass('hidden');
      this.set('nodeIsOpen', !this.get('nodeIsOpen'));
    }
  },
});
