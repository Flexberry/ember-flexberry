import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  textChild1: DS.attr('string'),
  /**
    Non-stored property.

    @property textIf
  */
  textIf: DS.attr('string'),
  /**
    Method to set non-stored property.
    Please, use code below in model class (outside of this mixin) otherwise it will be replaced during regeneration of models.
    Please, implement 'textIfCompute' method in model class (outside of this mixin) if you want to compute value of 'textIf' property.

    @method _textIfCompute
    @private
    @example
      ```javascript
      _textIfChanged: Ember.on('init', Ember.observer('textIf', function() {
        Ember.run.once(this, '_textIfCompute');
      }))
      ```
  */
  _textIfCompute: function() {
    let result = (this.textIfCompute && typeof this.textIfCompute === 'function') ? this.textIfCompute() : null;
    this.set('textIf', result);
  },
  getValidations: function () {
    let parentValidations = this._super();
    let thisValidations = {
    };
    return Ember.$.extend(true, {}, parentValidations, thisValidations);
  },
  init: function () {
    this.set('validations', this.getValidations());
    this._super.apply(this, arguments);
  }
});
export let defineBaseModel = function (modelClass) {
  modelClass.reopenClass({
    _parentModelName: 'ember-flexberry-dummy-suggestion'
  });
};

export let defineProjections = function (modelClass) {
  modelClass.defineProjection('AllProps', 'ember-flexberry-dummy-child-level1', {
    textChild1: Projection.attr('TextChild1', { hidden: true }),
    textIf: Projection.attr('TextIf', { hidden: true }),
    createTime: Projection.attr('CreateTime', { hidden: true }),
    creator: Projection.attr('Creator', { hidden: true }),
    editTime: Projection.attr('EditTime', { hidden: true }),
    editor: Projection.attr('Editor', { hidden: true }),
    address: Projection.attr('Address', { hidden: true }),
    text: Projection.attr('Text', { hidden: true }),
    date: Projection.attr('Date', { hidden: true }),
    votes: Projection.attr('Votes', { hidden: true }),
    moderated: Projection.attr('Moderated', { hidden: true }),
    commentsCount: Projection.attr('CommentsCount', { hidden: true }),
    author: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Author', {

    }, { hidden: true }),
    type: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {

    }, { hidden: true }),
    editor1: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Editor1', {

    }, { hidden: true })
  });
};
