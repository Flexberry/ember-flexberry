import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  uniquelD: DS.attr('string'),
  objectPK: DS.attr('number'),
  /**
    Non-stored property.

    @property showName
  */
  showName: DS.attr('string'),
  /**
    Method to set non-stored property.
    Please, use code below in model class (outside of this mixin) otherwise it will be replaced during regeneration of models.
    Please, implement 'showNameCompute' method in model class (outside of this mixin) if you want to compute value of 'showName' property.

    @method _showNameCompute
    @private
    @example
      ```javascript
      _showNameChanged: Ember.on('init', Ember.observer('showName', function() {
        Ember.run.once(this, '_showNameCompute');
      }))
      ```
  */
  _showNameCompute: function() {
    let result = (this.showNameCompute && typeof this.showNameCompute === 'function') ? this.showNameCompute() : null;
    this.set('showName', result);
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
export let defineProjections = function (modelClass) {
  modelClass.defineProjection('StudyRecordL', 'ember-flexberry-dummy-study-record', {
    uniquelD: Projection.attr(''),
    objectPK: Projection.attr(''),
    showName: Projection.attr('', { hidden: true })
  });
};
