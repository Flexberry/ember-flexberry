/* eslint-disable ember/use-ember-get-and-set */
/**
  @module ember-flexberry
 */

import $ from 'jquery';
import Ember from 'ember';
import FlexberryBaseComponent from 'ember-flexberry/components/flexberry-base-component';

export default FlexberryBaseComponent.extend({

  classNames: ['flexberry-edit-panel'],

  /**
   * @property {number} _editPanelWidth Current edit panel width.
   * @private
   */
  _editPanelWidth: undefined,

  /**
    @property {number} _buttonsWidth Buttons width.
    @private
   */
  _buttonsWidth: Ember.computed('buttons.@each.width', function() {
    return this.get('buttons')
    .map(btn => btn.width)
    .reduce((prev, curr) => prev + curr);
  }),

  /**
    @property {number} _closeButtonWidth Close button width.
    @private
   */
  _closeButtonWidth: undefined,

  /**
    @property {number} _marginWidth Margin button width.
    @private
   */
  _marginWidth: 20,

  /**
    @property {number} _buttonDropdownWidth Menu dropdown width.
    @private
   */
  _buttonDropdownWidth: Ember.computed('_menuButtons.length', 'element', function() {
    return (this.get('_menuButtons.length') > 0 &&
      $(this.element).find('.button-dropdown.menu-buttons').length > 0) ?
      $(this.element).find('.button-dropdown.menu-buttons').outerWidth(true)
      : 225;
  }),

  /**
    @property {Array} _menuButtons Menu buttons.
    @private
   */
  _menuButtons: undefined,

  /**
    @property {Array} _panelButtons Panel buttons.
    @private
   */
  _panelButtons: undefined,

  /**
    @property {Array} _panelButtons Edit panel buttons.
   */
  buttons: undefined,

  /**
    @property {object} _buttonsSorting Sorting buttons type.
    @private
   */
  _buttonsSorting: undefined,

  /**
    @property {object} panelButtonsSorted Sorting panel buttons type.
   */
  panelButtonsSorted: Ember.computed.sort('_panelButtons', '_buttonsSorting'),

  /**
    @property {object} menuButtonsSorted Sorting menu buttons type.
   */
  menuButtonsSorted: Ember.computed.sort('_menuButtons', '_buttonsSorting'),

  /**
    @property {boolean} showCloseButton Show close button in panel.
   */
  showCloseButton: false,

  /**
    Flag, the component is embedded in another component, for example, in the flexberry-olv toolbar.
    Set to send action in the controller.

    @type {boolean}
   */
  deepMount: false,

  /**
    Update display buttons.

    @function _updateDisplayButtons
    @private
   */
  _updateDisplayButtons() {
    let btnInPanel = Ember.A();
    let btnInMenu = Ember.A();

    if (this.get('_buttonsWidth') + this.get('_closeButtonWidth') + this.get('_marginWidth') <= this.get('_editPanelWidth')) {
      btnInPanel = this.get('buttons');
    } else {
      let maxWidthForButtonsPanel = this.get('_editPanelWidth') -
        (this.get('_buttonDropdownWidth') +
        this.get('_closeButtonWidth') +
        this.get('_marginWidth'));
      let currentButtonsWidth = 0;
      let isButtonsPanelFull = false;

      this.get('buttons').forEach(btn => {
        if (currentButtonsWidth + btn.width <= maxWidthForButtonsPanel && !isButtonsPanelFull) {
          btnInPanel.pushObject(btn);
          currentButtonsWidth += btn.width;
        } else {
          isButtonsPanelFull = true;
          btnInMenu.pushObject(btn);
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
    this.get('buttons').forEach((btn, i) => btn.id = `edit_btn${i}`);
    this.set('_panelButtons', this.get('buttons'));
    this.set('_menuButtons', Ember.A());

  },

  /**
    Initializes DOM-related component's logic.
   */
  didInsertElement() {
    this._super(...arguments);

    const $editPanel = $(this.element);
    this.set('_editPanelWidth', $editPanel.outerWidth());

    let closeButtonWidth = this.get('showCloseButton') ?
    $editPanel.find('.ui.button.close-button').outerWidth(true)
      : 0;
    this.set('_closeButtonWidth', closeButtonWidth);

    // this.get and save button width
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
    this.$('.ui.dropdown.selection.group-toolbar').dropdown();
  },

  /**
    Cleans up DOM-related component's logic.
   */
  willDestroyElement() {
    this._super(...arguments);

    $(window).unbind('resize');
  },

  buttonsObserver: Ember.observer('buttons', function() {
    const buttons = this.get('buttons');
    if (this.get('_panelButtons').length > 0) {
      this.set('_panelButtons', buttons);
    }

    if (this.get('_menuButtons').length > 0) {
      this.set('_menuButtons', buttons);
    }
  }),

  actions: {
    /**
     * Call action of a clicked button.
     *
     * @function actions.sendButtonAction
     * @public
     * @param {string | object} action action.
     */
    sendButtonAction(action) {
      Ember.assert('{{edit-panel}}: button.action parameter missing', !Ember.isNone(action));

      let actionName = '';
      let actionParams = [];

      if (typeof action === 'string') {
        actionName = action;
      } else if (!Ember.isNone(action.params)) {
        actionName = action.name;
        actionParams = action.params;
      }

      if (this.get('deepMount')) {
        this.currentController.send(actionName, ...actionParams);
      } else {
        /* eslint-disable ember/closure-actions */
        this.sendAction(actionName, ...actionParams);
        /* eslint-enable ember/closure-actions */
      }
    }
  }
});
