/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import $ from 'jquery';
import { translationMacro as t } from 'ember-i18n';
import { inject as service } from '@ember/service';

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
    Component's parent menu caption.

    @property parent
    @type String
    @default t('components.flexberry-sitemap-guideline.main-menu-caption')
  */
  parent: t('components.flexberry-sitemap-guideline.main-menu-caption'),

  sidebarFull: undefined,

  /**
    Service for listening to media query matches.

    @property media
    @type MediaService
  */
  media: service(),

  /**
    Called when the element of the view has been inserted into the DOM or after the view was re-rendered.
    [More info](https://emberjs.com/api/ember/release/classes/Component#event_didInsertElement).

    @method didInsertElement
  */
  didInsertElement() {
    this._super(...arguments);

    this.reInitComponent();
  },

  didUpdateAttrs() {
    this.reInitComponent();
  },

  reInitComponent() {
    if (this.get('isDropDown')) {
      let sidebarFull = this.get('sidebarFull');
      let transition = sidebarFull ? 'fade left' : 'slide right';
      let onEvent = sidebarFull ? 'click' : 'hover';

      $(this.element).dropdown({
        on: onEvent,
        transition: transition,
        maxSelections: 1,
        direction: 'rightward',
        // toggleSubMenusOn: 'click',
        onChange: (value, text, choice) => {
          let selectedItem = $(this.element).closest('.main.menu').find('.active.selected');
          if (selectedItem.length > 0) {
            selectedItem.removeClass('active selected');
          }

          const media = this.get('media');
          const isTablet = media.get('isTablet');

          if (!$(choice.get(0)).hasClass('menu-back')) {
            Ember.run.later(this, function() {
              $(this.element).dropdown('hide');
              if (sidebarFull) {
                $('.ui.sidebar.main.menu').sidebar('hide');
                let sidebar = $('.ui.sidebar.main.menu');
                if (isTablet && sidebar.hasClass('mobile')) {
                  let pusher = $('.ui.sidebar.main.menu ~ .pusher');

                  sidebar.toggleClass('mobile');
                  sidebar.toggleClass('sidebar-mini');
                  pusher.toggleClass('mobile');
                }
              }
            }, 500);
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
    },

    /**
      Back in menu.

      @method actions.menuBack
    */
    menuBack() {
      if (this.get('isDropDown')) {
        $(this.element).dropdown('hide');
      } else {
        // this.$('> .menu.visible', this.element).transition();
        this.$('> .menu.visible', this.element).transition('fade left');
      }
    }
  },
});
