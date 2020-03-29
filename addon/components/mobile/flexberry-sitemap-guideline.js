/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import $ from 'jquery';
import { run } from '@ember/runloop';
import { computed  } from '@ember/object';
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

  parent: computed('i18n.locale', function() {
    let i18n = this.get('i18n');
    return i18n.t('components.flexberry-sitemap-guideline.main-menu-caption');
  }),

  /**
    Stores node state.

    @property nodeIsOpen
    @type Boolean
    @default false
  */
  nodeIsOpen: false,

  isDropDown: false,

  didInsertElement() {
    this._super(...arguments);
    if (this.isDropDown) {
      this.element.classList.add('item', 'ui', 'dropdown', 'link');

      $(this.element).dropdown({
        maxSelections: 1,
        transition: 'slide left',
        onChange: () => {
          run.next(() => {
            let selectedItem = this.targetObject.$('.active.selected');
            if (selectedItem.length > 0) {
              selectedItem.removeClass('active selected');
            }

            this.send('menuToggle');
          })
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
    },

    menuBack() {
      if (this.get('isDropDown')) {
        $(this.element).dropdown('hide');
      } else {
        $('> .menu.visible', this.element).transition('slide left');
      }
    }
  },
});
