/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import $ from 'jquery';

/**
  Component for sitemap render from the object with links.

  @example
    templates/my-form.hbs
    ```handlebars
    {{flexberry-sitemap-guideline sitemap=sitemap}}
    ```

  @class FlexberrySitemapComponent
  @extends <a href="https://emberjs.com/api/ember/release/classes/Component">Component</a>
*/
export default Component.extend({
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
    @default false
  */
  nodeIsOpen: false,

  isDropDown: false,

  didInsertElement(){
    this._super(...arguments);
    if (this.isDropDown) {
      this.element.classList.add('item', 'ui', 'dropdown', 'link');

      $(this.element).dropdown({
        on: 'hover',
        transition: 'slide right',
        maxSelections: 1,
        onChange: () => {
          let selectedItem = this.targetObject.$('.active.selected');
          if (selectedItem.length > 0) {
            selectedItem.removeClass('active selected');
          }
        }
      });
    }
  },

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
