/**
  @module ember-flexberry
 */

import Ember from 'ember';

export default Ember.Mixin.create({

  classNameBindings: ['voiceTypingIsActive:icon'],

  /**
    Flag: view button voice typing.

    @property isUseVoiceTyping
    @type Boolean
  */
  isUseVoiceTyping: undefined,

  /**
    Instance of SpeechRecognition.

    @property speechRecognition
    @type Object
  */
  speechRecognition: undefined,

  /**
    Flag: voice typing is active.

    @property voiceTypingIsActive
    @type Boolean
    @readOnly
  */
  voiceTypingIsActive: Ember.computed('isUseVoiceTyping', function() {
    const appConfig = Ember.getOwner(this)._lookupFactory('config:environment');
    const useVoiceTypingInAllControls = Ember.get(appConfig, 'APP.useVoiceTypingInAllControls');
    const isUseVoiceTyping = this.get('isUseVoiceTyping');
    if (!Ember.isNone(isUseVoiceTyping)) {
      return isUseVoiceTyping;
    }

    return useVoiceTypingInAllControls || false;
  }),

  /**
    Update value by voice typing.

    @method _onGetResultSpeechRecognition
    @private
  */
  _onGetResultSpeechRecognition(event) {
    const text = event.results[0][0].transcript;

    this.send('onSuccessSpeechRecognition', text);
  },

  /**
    Report voice typing errors.

    @method _onErrorSpeechRecognition
    @private
  */
  _onErrorSpeechRecognition(event) {
    const text = `Error occurred in recognition: ${event.error}`;

    this.send('onFailureSpeechRecognition', text);
  },

  init() {
    this._super(...arguments);

    if (this.get('voiceTypingIsActive')) {
      // Check for Web Speech API support in the browser.
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!Ember.isNone(window.SpeechRecognition)) {

        // Create a new instance of speech recognition.
        const speechRecognition = new SpeechRecognition();
        speechRecognition.lang = this.get('i18n.locale') || 'ru';
        speechRecognition.interimResults = false;
        speechRecognition.maxAlternatives = 1;

        speechRecognition.addEventListener('result', this._onGetResultSpeechRecognition.bind(this));
        speechRecognition.addEventListener('error', this._onErrorSpeechRecognition.bind(this));

        this.set('speechRecognition', speechRecognition);
      } else {
        this.set('isUseVoiceTyping', false);
      }
    }
  },

  willDestroy() {
    let speechRecognition = this.get('speechRecognition');

    if (!Ember.isNone(speechRecognition)) {
      speechRecognition.removeEventListener('result', this._onGetResultSpeechRecognition);
      speechRecognition.removeEventListener('error', this._onErrorSpeechRecognition);
    }

    this._super(...arguments);
  },

  actions: {

    /**
      Handles action click speech recognition.

      @method actions.voiceTyping
      @public
    */
    voiceTyping() {
      let speechRecognition = this.get('speechRecognition');
      speechRecognition.addEventListener('end', () => {
        speechRecognition.stop();
      }, { once: true });

      speechRecognition.start();
    },

    /**
      Callback success speech recognition.

       @method onSuccessSpeechRecognition
       @param {String} text text.
    */
    onSuccessSpeechRecognition(text) {
      this.set('value', text);
    },

    /**
      Callback failure speech recognition.

       @method onFailureSpeechRecognition
       @param {String} error text error.
    */
    onFailureSpeechRecognition(error) {
      this.set('value', error);
    }
  }
});
