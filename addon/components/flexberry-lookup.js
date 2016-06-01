/**
  @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

import { translationMacro as t } from 'ember-i18n';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import { StringPredicate } from 'ember-flexberry-data/query/predicate';

/**
  Lookup component for Semantic UI.

  Example:
  ```javascript
  // app/controllers/post.js
  import EditFormController from './edit-form';
  export default EditFormController.extend({
    ...
  });
  ```

  ```handlebars
  <!-- app/templates/post.hbs -->
  ...
  {{flexberry-lookup
    choose="showLookupDialog"
    remove="removeLookupValue"
    value=model.author
    projection="UserL"
    relationName="author"
    displayAttributeName="name"
    title="Author"
    placeholder="Not select"
    chooseText="Select"
    removeText="Clear"
  }}
  ...
  ```

  @class FlexberryLookup
  @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  /**
    Additional observer of value change, updates `displayValue`.

    @property _valueObserver
    @private
   */
  _valueObserver: Ember.observer('value', function() {
    this.set('displayValue', this._buildDisplayValue());
  }),

  /**
    Current store. Used for loading data for autocomplete and for dropdown.

    @property store
    @type DS.Store
    @readOnly
   */
  store: Ember.inject.service('store'),

  /**
    Classes by property of autocomplete.

    @property autocompleteClass
    @type String
    @readOnly
   */
  autocompleteClass: Ember.computed('autocomplete', function() {
    if (this.get('autocomplete')) {
      return 'ui search';
    }
  }),

  /**
    Text that displayed for the user as representation of currently selected value.
    This property is binded to the view and can be changed by user (it won't be applied to model automatically).

    @property displayValue
    @type String
    @readOnly
   */
  displayValue: Ember.computed('value', function() {
    return this._buildDisplayValue();
  }),

  /**
    Object with lookup properties to send on choose action.

    @property chooseData
    @type Object
    @readOnly
   */
  chooseData: Ember.computed('projection', 'relationName', 'title', function() {
    return {
      projection: this.get('projection'),
      relationName: this.get('relationName'),
      title: this.get('title'),
      modelToLookup: this.get('relatedModel'),

      //TODO: move to modal settings.
      sizeClass: this.get('sizeClass')
    };
  }),

  /**
    Object with lookup properties to send on remove action.

    @property removeData
    @type Object
    @readOnly
   */
  removeData: Ember.computed('relationName', function() {
    return {
      relationName: this.get('relationName'),
      modelToLookup: this.get('relatedModel')
    };
  }),

  /**
    Title for modal window.

    @property title
    @type String
   */
  title: undefined,

  /**
    Text to be displayed in field, if value not selected.

    @property placeholder
    @type String
    @default t('flexberry-lookup.placeholder')
   */
  placeholder: t('flexberry-lookup.placeholder'),

  /**
    Text on button opening a modal window.

    @property chooseText
    @type String
    @default t('flexberry-lookup.choose-button-text')
   */
  chooseText: t('flexberry-lookup.choose-button-text'),

  /**
    Text on button clear value.

    TODD: Use 'flexberry-lookup.remove-button-text' from locale.

    @property removeText
    @type String
    @default '<i class="remove icon"></i>'
   */
  removeText: '<i class="remove icon"></i>',

  /**
    CSS classes for choose button.

    @property chooseButtonClass
    @type String
   */
  chooseButtonClass: undefined,

  /**
    CSS classes for remove button.

    @property removeButtonClass
    @type String
   */
  removeButtonClass: undefined,

  /**
    Flag to show that lookup is in autocomplete mode.

    @property autocomplete
    @type Boolean
    @default false
   */
  autocomplete: false,

  /**
    Flag to show that lookup is in dropdown mode.

    @property dropdown
    @type Boolean
    @default false
   */
  dropdown: false,

  /**
    Flag enable to multiple select.

    Note! Not working!

    @property multiselect
    @type Boolean
    @default false
   */
  multiselect: false,

  /**
    Action's name to update model's relation value.

    @property updateLookupAction
    @type String
    @default 'updateLookupValue'
   */
  updateLookupAction: 'updateLookupValue',

  /**
    Min characters count necessary to call autocomplete.

    @property minCharacters
    @type Integer
    @default 1
   */
  minCharacters: 1,

  /**
    Maximum number of results to display on autocomplete or dropdown.

    @property maxResults
    @type Integer
    @default 10
   */
  maxResults: 10,

  /**
    Current selected instance of the model.

    @property value
    @type Object
   */
  value: undefined,

  /**
    Projection name.

    @property projection
    @type String
    @required
   */
  projection: undefined,

  /**
    Relation name.

    @property relationName
    @type String
    @required
   */
  relationName: undefined,

  /**
    Name of the attribute of the model to display for the user.

    @property displayAttributeName
    @type String
    @default null
    @required
   */
  displayAttributeName: null,

  /**
    Standard CSS class names to apply to the view's outer element.
    [More info](http://emberjs.com/api/classes/Ember.Component.html#property_classNames).

    @property classNames
    @type Array
    @readOnly
   */
  classNames: ['flexberry-lookup'],

  /**
    A list of properties of the view to apply as class names.
    [More info](http://emberjs.com/api/classes/Ember.Component.html#property_classNameBindings).

    @property classNameBindings
    @type Array
    @readOnly
   */
  classNameBindings: ['autocompleteClass'],

  actions: {
    /**
      Open window for select value.

      @method actions.choose
      @param {Object} chooseData
     */
    choose(chooseData) {
      if (this.get('readonly')) {
        return;
      }

      this.sendAction('choose', chooseData);
    },

    /**
      Clear current value.

      @method actions.remove
      @param {Object} removeData
     */
    remove(removeData) {
      if (this.get('readonly')) {
        return;
      }

      this.sendAction('remove', removeData);
    },
  },

  /**
    Called when the element of the view has been inserted into the DOM or after the view was re-rendered.
    [More info](http://emberjs.com/api/classes/Ember.Component.html#event_didInsertElement).

    @method didInsertElement
   */
  didInsertElement() {
    this._super();

    if (this.get('readonly')) {
      return;
    }

    if (this.get('autocomplete')) {
      this._onAutocomplete();
    } else if (this.get('dropdown')) {
      this._onDropdown();
    }
  },

  /**
    Initialize component with autocomplete mode.

    @method _onAutocomplete
    @private
   */
  _onAutocomplete() {
    let _this = this;
    let store = this.get('store');
    let relatedModel = this.get('relatedModel');
    let modelName = relatedModel.constructor.modelName;

    let displayAttributeName = _this.get('displayAttributeName');
    if (!displayAttributeName) {
      throw new Error('Required property "displayAttributeName" is not defined.');
    }

    let minCharacters = this.get('minCharacters');
    if (!minCharacters || typeof (minCharacters) !== 'number' || minCharacters <= 0) {
      throw new Error('minCharacters has wrong value.');
    }

    let maxResults = this.get('maxResults');
    if (!maxResults || typeof (maxResults) !== 'number' || maxResults <= 0) {
      throw new Error('maxResults has wrong value.');
    }

    let relationName = this.get('relationName');
    if (!relationName) {
      throw new Error('relationName is not defined.');
    }

    var state;
    this.$().search({
      minCharacters: minCharacters,
      maxResults: maxResults,
      cache: false,
      apiSettings: {
        /**
         * Mocks call to the data source,
         * Uses query language and store for loading data explicitly.
         *
         * @param {Object} settings
         * @param {Function} callback
         */
        responseAsync(settings, callback) {
          let builder = new QueryBuilder(store, modelName);

          if (settings.urlData.query) {
            builder.where(new StringPredicate(displayAttributeName).contains(settings.urlData.query));
          }

          store.query(modelName, builder.build()).then((records) => {
            callback({
              success: true,
              results: records.map(i => {
                return {
                  title: i.get(displayAttributeName),
                  instance: i
                };
              })
            });
          }, () => {
            callback({ success: false });
          });
        }
      },

      /**
       * Handles opening of the autocomplete list.
       * Sets current state (taht autocomplete list is opened) for future purposes.
       */
      onResultsOpen() {
        state = 'opened';
        Ember.Logger.debug(`Flexberry Lookup::autocomplete state = ${state}`);
      },

      /**
       * Handles selection of item from the autocomplete list.
       * Saves selected model and notifies the controller.
       *
       * @param {Object} result Item from array of objects, built in `responseAsync`.
       */
      onSelect(result) {
        state = 'selected';
        Ember.Logger.debug(`Flexberry Lookup::autocomplete state = ${state}; result = ${result}`);

        _this.set('value', result.instance);
        _this.sendAction(
          'updateLookupAction',
          {
            relationName: relationName,
            modelToLookup: relatedModel,
            newRelationValue: result.instance
          });
      },

      /**
       * Handles closing of the autocomplete list.
       * Restores display text if nothing has been selected.
       */
      onResultsClose() {
        // Set displayValue directly because value hasn'been changes
        // and Ember won't change computed property.
        if (state !== 'selected') {
          if (_this.get('displayValue')) {
            _this.set('displayValue', _this._buildDisplayValue());
          } else {
            _this.sendAction('remove', _this.get('removeData'));
          }
        }

        state = 'closed';
        Ember.Logger.debug(`Flexberry Lookup::autocomplete state = ${state}`);
      }
    });
  },

  /**
    Initialize component with dropdown mode.

    @method _onDropdown
    @private
   */
  _onDropdown() {
    let _this = this;
    let store = this.get('store');
    let modelName = this.get('relatedModel').constructor.modelName;
    let minCharacters = this.get('minCharacters');
    let multiselect = this.get('multiselect');
    let displayAttributeName = _this.get('displayAttributeName');
    let relationName = this.get('relationName');
    let relatedModel = this.get('relatedModel');

    this.$('.flexberry-dropdown').dropdown({
      minCharacters: minCharacters,
      allowAdditions: multiselect,
      cache: false,
      apiSettings: {
        responseAsync(settings, callback) {
          console.log('load');
          let builder = new QueryBuilder(store, modelName);

          if (settings.urlData.query) {
            builder.where(new StringPredicate(displayAttributeName).contains(settings.urlData.query));
          }

          store.query(modelName, builder.build()).then((records) => {
            callback({
              success: true,
              results: records.map(i => {
                return {
                  name: i.get(displayAttributeName),
                  value: i
                };
              })
            });
          }, () => {
            callback({ success: false });
          });
        }
      },
      onChange(value) {
        _this.sendAction(
          'updateLookupAction',
          {
            relationName: relationName,
            modelToLookup: relatedModel,
            newRelationValue: value
          });
      }
    }).dropdown('set text', _this.get('displayValue'));
  },

  /**
    Builds display text by selected model.

    @method _buildDisplayValue
    @returns {String}
    @private
   */
  _buildDisplayValue() {
    let selectedModel = this.get('value');
    if (!selectedModel) {
      this.set('placeholder', t('flexberry-lookup.placeholder'));
      return '';
    } else {
      this.set('placeholder', '');
    }

    return selectedModel.get(this.get('displayAttributeName'));
  }
});
