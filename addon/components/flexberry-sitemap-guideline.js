/**
  @module ember-flexberry
*/

import $ from 'jquery';
import Component from '@ember/component';
import { next } from '@ember/runloop';

/**
  Component for sitemap render from the object with links.

  @example
    templates/my-form.hbs
    ```handlebars
    {{flexberry-sitemap-guideline sitemap=sitemap}}
    ```

  @class FlexberrySitemapGuidelineComponent
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
    Components class names bindings.

    @property classNameBindings
    @type String[]
    @default ['isDropDown:item', 'isDropDown:ui', 'isDropDown:dropdown', 'isDropDown:link']
  */
  classNameBindings: ['isDropDown:item', 'isDropDown:ui', 'isDropDown:dropdown', 'isDropDown:link'],

  /**
    Stores node state.

    @property nodeIsOpen
    @type Boolean
    @default false
  */
  nodeIsOpen: false,

  /**
    Flag: indicates whether item is dropdown.

    @property isDropDown
    @type Boolean
    @default false
  */
  isDropDown: false,

  /**
    Called when the element of the view has been inserted into the DOM or after the view was re-rendered.
    [More info](https://emberjs.com/api/ember/release/classes/Component#event_didInsertElement).

    @method didInsertElement
  */
  didInsertElement() {
    this._super(...arguments);
    if (this.isDropDown) {
      $(this.element).dropdown({
        on: 'hover',
        transition: 'slide right',
        maxSelections: 1,
        onChange: () => {
          let selectedItem = $(this.element).closest('.main.menu').find('.active.selected');
          if (selectedItem.length > 0) {
            selectedItem.removeClass('active selected');
          }
          $(this.element).dropdown('hide');
        }
      });
    }
  },

  /**
    Component mouseEnter handler.

    @method mouseEnter
    @private
  */
  mouseEnter() {
    next(()=> {
      const menuElement = $(this.element).closest('.menu');
      const { left, width } = menuElement[0].getBoundingClientRect();
      const subMeluLeft = left + width - 5;
      $(this.element).children('.menu').attr('style', `left: ${subMeluLeft}px !important;`);
    });
  }
});
