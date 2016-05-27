/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Header cell component for ObjectListView.

  @class ObjectListViewHeaderCell
  @extends FlexberryBaseComponent
*/
export default Ember.Component.extend({
  /**
    Override wrapping element's tag.
  */
  tagName: 'th',

  /**
    Component's CSS class names.
  */
  classNames: ['dt-head-left'],

  /**
    Column related to header cell.

    @property column
    @type Object
    @default null
  */
  column: null,

  /**
    Primary action for header click event.

    @property action
    @type String
    @default 'headerCellClick'
  */
  action: 'headerCellClick',

  /**
    Header click handler.

    @method click
  */
  click(event) {
    this.sendAction('action', this.column, event);
  }
});
