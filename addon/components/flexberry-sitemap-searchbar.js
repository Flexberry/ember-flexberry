/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
/* eslint-disable ember/use-ember-get-and-set */
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

export default Ember.Component.extend({

  /**
    Array of search objects.
   
    @property sitemap
    @type Array
   */
  sitemap: [],

  /**
    Result array consisting of filtered objects.
   
    @property _results
    @type Array
    @private
   */
  _results: [],

  /**
    User input from .sitemap-search-input.
   
    @property lastKeyPress
    @type string
   */
  userQuery: null,

  /**
    Toggler for showing .sitemap-search-results-list.
   
    @property isShowingResults
    @type boolean
   */
  isShowingResults: false,

  /**
    Flag for showing error message if user query doesn't get any hits.
   
    @property noHits
    @type boolean
   */
  noHits: Ember.computed('_results', 'userQuery', function() {
    return this.get(this, '_results').length === 0 && !Ember.isEmpty(this.get('userQuery'));
  }),

  /**
    Event timestamp in milliseconds.
   
    @property lastKeyPress
    @type number
   */
  lastKeyPress: 0,

  /**
    Component's input placeholder.
   
    @property placeholder
    @type String
    @default t('components.flexberry-sitemap-searchbar.placeholder')
   */
  placeholder: t('components.flexberry-sitemap-searchbar.placeholder'),

  /**
   * Recursively returns filtered sitemap.
   *
   * @param regexQuery
   * @param currentTree
   * @private
   * @function _searchTree
   */
  _searchTree(regexQuery, currentTree) {
    let resultTree = [];

    currentTree.forEach(element => {
      if (this._elementMatchesRegex(regexQuery, element)) {
        let matchingNode = Ember.$.extend(true, {}, element);
        resultTree.push(matchingNode);
      } else if (this._elementHasChildren(element)) {
        let resultChildren = this._searchTree(regexQuery, element.children);

        if (resultChildren.length > 0) {
          const { link, caption, title } = element;
          resultTree.push({ link, caption, title, children: resultChildren });
        }
      }
    });

    return resultTree;
  },

  /**
   * Checks element caption string for regex.
   *
   * @param regex
   * @param element
   * @private
   * @function _elementMatchesRegex
   */
  _elementMatchesRegex(regex, element) {
    if (element.caption) {
      return regex.test(element.caption.string);
    } else {
      return regex.test(element.title.string);
    }
  },

  /**
   * Checks if element has children.
   *
   * @param element
   * @private
   * @function _elementHasChildren
   */
  _elementHasChildren(element) {
    return (typeof element === 'object') && (!Ember.isEmpty(element.children));
  },

  actions: {
    /**
     Initiate sitemap search.
     
     @private
     @function startSearch
     */
    startSearch() {
      this.set('isShowingResults', true);
      let query = this.get('userQuery').toLowerCase();

      if (query) {
        // Recursive search will be initiated only if last keypress happened more than 200 ms ago (for performance reasons).
        Ember.run.debounce(this, () => {
          let regexQuery = new RegExp(`${query}`, 'gi');

          this.set('_results', this._searchTree(regexQuery, this.get('sitemap')));
        }, 200);

      } else {
        this.set('_results', this.get('sitemap'));
      }
    },

    /**
     Toggle isShowingResults prop.
     
     @private
     @function toggleResultsList
     */
    toggleResultsList() {
      this.toggleProperty('isShowingResults');
    }
  },
  /**
    Initializes DOM-related component's logic.
   */
  didInsertElement() {
    this.set('_results', this.get('sitemap'));

    this.$(document).on('click', e => {
      e.stopPropagation();

      let clickTargetIsNotComponent = !e.target.offsetParent.classList.contains('sitemap-search-results-list') &&
      !e.target.classList.contains('sitemap-search-results-list') &&
      !e.target.classList.contains('sitemap-search-input');
      if (clickTargetIsNotComponent) {
        this.set('isShowingResults', false);
      }
    });
  }
});

