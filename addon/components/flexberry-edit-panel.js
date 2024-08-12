/**
 @module ember-flexberry
 */
import $ from 'jquery';
import { isNone } from '@ember/utils';
import { A } from '@ember/array';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import FlexberryBaseComponent from 'ember-flexberry/components/flexberry-base-component';
import { set } from '@ember/object';

export default FlexberryBaseComponent.extend({

  classNames: ['flexberry-edit-panel'],

  /**
    Edit panel current width.

    @property _editPanelWidth
    @type Number
    @private
  */
  _editPanelWidth: undefined,

  /**
    Buttons width.

    @property _buttonsWidth
    @type Number
    @private
  */
  _buttonsWidth: computed('buttons.@each.width', function() {
    return this.get('buttons').map(btn => btn.width).reduce((prev, curr) => prev + curr);
  }),

  /**
    Close button width.

    @property _closeButtonWidth
    @type Number
    @private
  */
  _closeButtonWidth: undefined,

  /**
    Margin button width.

    @property _closeButtonWidth
    @type Number
    @private
  */
  _marginWidth: 20,

  /**
    Menu dropdown width.

    @property _buttonDropdownWidth
    @type Number
    @private
  */
  _buttonDropdownWidth: computed('_menuButtons.length', 'element', function() {
    const menuButtonsLength = this.get('_menuButtons.length');
    const menuButtonsElement = $(this.element).find('.menu-buttons.group-toolbar');

    return ( menuButtonsLength > 0 && menuButtonsElement.length > 0) ? menuButtonsElement.outerWidth(true) : 60;
  }),

  /**
    Menu buttons.

    @property _menuButtons
    @type Array
    @private
  */
  _menuButtons: undefined,

  /**
    Panel buttons.

    @property _panelButtons
    @type Array
    @private
  */
  _panelButtons: undefined,

  /**
    Buttons.

    @property _panelButtons
    @type Array
  */
  buttons: undefined,

  /**
    Sorting buttons type.

    @property _buttonsSorting
    @type Object
    @private
  */
  _buttonsSorting: undefined,

  /**
    Sorting panel buttons type.

    @property panelButtonsSorted
    @type Object
  */
  panelButtonsSorted: sort('_panelButtons', '_buttonsSorting'),

  /**
    Sorting menu buttons type.

    @property menuButtonsSorted
    @type Object
  */
  menuButtonsSorted: sort('_menuButtons', '_buttonsSorting'),

  /**
    Show close button in panel.

    @property showCloseButton
    @type boolean
  */
  showCloseButton: false,

  /**
    Close button action name.

    @property closeAction
    @type string
  */
  closeAction: 'close',

  /**
    Flag, the component is embedded in another component, for example, in the flexberry-olv toolbar.
    Set to send action in the controller.

    @type {Boolean}
  */
  deepMount: false,

  /**
    Update display buttons.

    @method _updateDisplayButtons
    @private
  */
  _updateDisplayButtons() {
    let btnInPanel = A();
    let btnInMenu = A();

    if (this.get('_buttonsWidth') + this.get('_closeButtonWidth') + this.get('_marginWidth') <= this.get('_editPanelWidth')) {
      btnInPanel = this.get('buttons');
    } else {
      let maxWidthForButtonsPanel = this.get('_editPanelWidth') - (this.get('_buttonDropdownWidth') + this.get('_closeButtonWidth') + this.get('_marginWidth'));
      let currentButtonsWidth = 0;
      let isButtonsPanelFull = false;

      this.get('buttons').forEach(btn => {
        if (!btn.disabled) {
          if (currentButtonsWidth + btn.width <= maxWidthForButtonsPanel && !isButtonsPanelFull) {
            btnInPanel.pushObject(btn);
            currentButtonsWidth += btn.width;
          } else {
            isButtonsPanelFull = true;
            btnInMenu.pushObject(btn);
          }
        }
      });
    }

    this.set('_panelButtons', btnInPanel);
    this.set('_menuButtons', btnInMenu);
  },

  /**
    Initializes component.
  */
  init() {
    this._super(...arguments);

    this.set('_buttonsSorting', ['id:asc']);
    this.get('buttons').forEach((btn, i) => set(btn, 'id', `edit_btn${i}`));
    this.set('_panelButtons', this.get('buttons'));
    this.set('_menuButtons', A());

  },

  /**
    Initializes DOM-related component's logic.
  */
  didInsertElement() {
    this._super(...arguments);

    const $editPanel = $(this.element);
    this.set('_editPanelWidth', $editPanel.outerWidth());

    let closeButtonWidth = this.get('showCloseButton') ? $editPanel.find('.ui.button.close-button').outerWidth() : 0;
    this.set('_closeButtonWidth', closeButtonWidth);

    // get and save button width
    this.get('_panelButtons').forEach(btn => {
      let button = $editPanel.find(`#${btn.id}`);
      btn.width = button.outerWidth(true);
    });

    this._updateDisplayButtons();

    $(window).bind('resize', $.proxy(function() {
      const elementWidth = $(this.element).outerWidth();
      if (this.get('_editPanelWidth') !== elementWidth) {
        this.set('_editPanelWidth', elementWidth);
        this._updateDisplayButtons();
      }
    }, this));
  },

  /**
    Handles DOM-related component's properties after each render.
  */
  didRender() {
    $('.ui.dropdown.group-toolbar', this.element).dropdown();
  },

  /**
    Cleans up DOM-related component's logic.
  */
  willDestroyElement() {
    this._super(...arguments);

    $(window).unbind('resize');
  },

  actions: {
    /**
     * Call action of a clicked button.
     *
     * @method actions.sendButtonAction
     * @public
     * @param {String|Object} action action.
     */
    sendButtonAction(action) {
      assert('{{edit-panel}}: button.action parameter missing', !isNone(action));

      let actionName = '';
      let actionParams = [];

      if (typeof action === 'string') {
        actionName = action;
      } else if (!isNone(action.params)) {
        actionName = action.name;
        actionParams = action.params;
      }

      if (this.get('deepMount')) {
        this.currentController.send(actionName, ...actionParams);
      } else {
        this.get(actionName)(...actionParams);
      }
    }
  }
});
