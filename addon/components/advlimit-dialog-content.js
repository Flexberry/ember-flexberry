import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

import { BasePredicate, stringToPredicate } from 'ember-flexberry-data/query/predicate';

/**
  AdvLimit dialog Content component.

  @class AdvLimitDialogContentComponent
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
   Columns configiration menu.

   @property colsConfigMenu
   @type {Class}
   @default Ember.inject.service()
   */
  colsConfigMenu: Ember.inject.service(),

  /**
   Service that triggers objectlistview events.

   @property objectlistviewEvents
   @type {Class}
   @default Ember.inject.service()
   */
  objectlistviewEvents: Ember.inject.service(),

  /**
    Service for managing the state of the application.

    @property appState
    @type AppStateService
  */
  appState: Ember.inject.service(),

  /**
    Service for managing advLimits for lists.

    @property advLimit
    @type AdvLimitService
  */
  advLimit: Ember.inject.service(),

  actions: {
    /**
     Apply specified advLimit.

     @method actions.apply
    */
    apply: function() {
      this._hideMessage();
      const advLimit = this.get('model.advLimit');
      if (!this._checkPredicate(advLimit)) {
        this._showMessage('error', 'Can\'t convert current limit string to predicate');
        return;
      }

      this.get('appState').loading();
      const savePromise = this._getSavePromise(advLimit);
      savePromise.then(
        record => {
          this.get('objectlistviewEvents').refreshListTrigger(this.get('model.componentName'));
        }
      ).catch((reason) => {
        this.get('currentController').send('handleError', reason);
      }).finally(() => {
        this.get('appState').reset();
      });

      this.sendAction('close', advLimit);
    },

    /**
      Checks specified advLimit.

      @method actions.check
    */
    check() {
      this._hideMessage();
      const stringPredicate = this.get('model.advLimit');
      if (this._checkPredicate(stringPredicate)) {
        this._showMessage('success', 'Current limit string is correct');
      } else {
        this._showMessage('error', 'Can\'t convert current limit string to predicate');
      }
    },

    /**
      Save specified advLimit.

      @method actions.saveAdvLimit
    */
    saveAdvLimit: function() {
      this._hideMessage();
      const advLimitName = this.get('model.advLimitName');
      if (Ember.isBlank(advLimitName)) {
        this._showMessage('warning', this.get('i18n').t('components.colsconfig-dialog-content.enter-setting-name'));
        return;
      }

      const advLimit = this.get('model.advLimit');
      if (!this._checkPredicate(advLimit)) {
        this._showMessage('error', 'Can\'t convert current limit string to predicate');
        return;
      }

      const savePromise = this._getSavePromise(advLimit, advLimitName);
      this.get('colsConfigMenu').updateNamedAdvLimitTrigger(advLimitName);
      savePromise.then(
        record => {
          this._showMessage(
            'success',
            this.get('i18n').t('components.colsconfig-dialog-content.setting') +
              advLimitName +
              this.get('i18n').t('components.colsconfig-dialog-content.is-saved')
          );
        },
        error => {
          this._showMessage(
            'error',
            this.get('i18n').t('components.colsconfig-dialog-content.have-errors'),
            JSON.stringify(error)
          );
          this.sendAction('close', advLimit);
          this.get('currentController').send('handleError', error);
        }
      );
    },

    handleError(error) {
      this._super(...arguments);
      return true;
    }
  },

  /**
    Show message.

    @param type Message type.
    @param caption Message caption.
    @param message Message text.
    @method _showMessage
  */
  _showMessage(type = 'error', caption = '', message = '') {
    this.set('currentController.message.type', type);
    this.set('currentController.message.visible', true);
    this.set('currentController.message.caption', caption);
    this.set('currentController.message.message', message);
    this._scrollToBottom();
  },

  /**
    Hide message.

    @method _hideMessage
  */
  _hideMessage() {
    this.set('currentController.message.visible', false);
  },

  /**
    Checks predicateString.

    @param stringPredicate Predicate in string form.
    @method _checkPredicate
  */
  _checkPredicate(stringPredicate) {
    const predicate = stringToPredicate(stringPredicate);

    return Ember.isBlank(stringPredicate) || predicate instanceof BasePredicate;
  },

  /**
    Scrolling content to bottom.

    @method _scrollToBottom
  */
  _scrollToBottom() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      const scrollBlock = this.$('.flexberry-colsconfig.content');
      scrollBlock.animate({ scrollTop: scrollBlock.prop('scrollHeight') }, 1000);
    });
  },

  _getSavePromise: function(advLimit, advLimitName) {
    const componentName = this.get('model.componentName');

    return this.get('advLimit').saveAdvLimit(advLimit, componentName, advLimitName)
    .then(result => {
      this.get('colsConfigMenu').updateNamedAdvLimitTrigger(componentName);
    });
  }
});
