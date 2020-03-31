/**
  @module ember-flexberry
*/

import FlexberrySitemapGuidelineComponent from '../flexberry-sitemap-guideline';
import $ from 'jquery';
import { translationMacro as t } from 'ember-i18n';

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
export default FlexberrySitemapGuidelineComponent.extend({

  /**
    Component's parent menu caption.

    @property parent
    @type String
    @default t('components.flexberry-sitemap-guideline.main-menu-caption')
  */
  parent: t('components.flexberry-sitemap-guideline.main-menu-caption'),

  /**
    Called when the element of the view has been inserted into the DOM or after the view was re-rendered.
    [More info](https://emberjs.com/api/ember/release/classes/Component#event_didInsertElement).

    @method didInsertElement
  */
  didInsertElement() {
    this._super(...arguments);
    if (this.isDropDown) {
      $(this.element).dropdown({
        maxSelections: 1,
        transition: 'slide left',
        onChange: () => {
          let selectedItem = $(this.element).closest('.main.menu').find('.active.selected');
          if (selectedItem.length > 0) {
            selectedItem.removeClass('active selected');
          }
        }
      });
    }
  },

  actions: {
    /**
      Back in menu.

      @method actions.menuBack
    */
    menuBack() {
      if (this.get('isDropDown')) {
        $(this.element).dropdown('hide');
      } else {
        this.$('> .menu.visible', this.element).transition('slide left');
      }
    }
  },
});
