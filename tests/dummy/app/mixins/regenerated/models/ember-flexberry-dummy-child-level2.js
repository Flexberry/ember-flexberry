import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  textChild2: DS.attr('string'),
  obj: DS.attr('ember-flexberry-dummy-post-e-obj'),
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
    _parentModelName: 'ember-flexberry-dummy-child-level1'
  });
};

export let defineProjections = function (modelClass) {
  modelClass.defineProjection('AllProps2', 'ember-flexberry-dummy-child-level2', {
    author: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Author.*', {
      createTime: Projection.attr('Author.CreateTime', { hidden: true }),
      creator: Projection.attr('Author.Creator', { hidden: true }),
      editTime: Projection.attr('Author.EditTime', { hidden: true }),
      editor: Projection.attr('Author.Editor', { hidden: true }),
      name: Projection.attr('Author.Name', { hidden: true }),
      eMail: Projection.attr('Author.EMail', { hidden: true }),
      phone1: Projection.attr('Author.Phone1', { hidden: true }),
      phone2: Projection.attr('Author.Phone2', { hidden: true }),
      phone3: Projection.attr('Author.Phone3', { hidden: true }),
      activated: Projection.attr('Author.Activated', { hidden: true }),
      vK: Projection.attr('Author.VK', { hidden: true }),
      facebook: Projection.attr('Author.Facebook', { hidden: true }),
      twitter: Projection.attr('Author.Twitter', { hidden: true }),
      birthday: Projection.attr('Author.Birthday', { hidden: true }),
      gender: Projection.attr('Author.Gender', { hidden: true }),
      vip: Projection.attr('Author.Vip', { hidden: true }),
      karma: Projection.attr('Author.Karma', { hidden: true })
    }, { hidden: true }),
    type: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type.*', {
      createTime: Projection.attr('Type.CreateTime'),
      creator: Projection.attr('Type.Creator'),
      editTime: Projection.attr('Type.EditTime'),
      editor: Projection.attr('Type.Editor'),
      name: Projection.attr('Type.Name'),
      moderated: Projection.attr('Type.Moderated'),
      parent: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', '', {
        createTime: Projection.attr('Type.Parent.CreateTime'),
        creator: Projection.attr('Type.Parent.Creator'),
        editTime: Projection.attr('Type.Parent.EditTime'),
        editor: Projection.attr('Type.Parent.Editor'),
        name: Projection.attr('Type.Parent.Name'),
        moderated: Projection.attr('Type.Parent.Moderated'),
        parent: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', '', {
          createTime: Projection.attr('Type.Parent.Parent.CreateTime'),
          creator: Projection.attr('Type.Parent.Parent.Creator'),
          editTime: Projection.attr('Type.Parent.Parent.EditTime'),
          editor: Projection.attr('Type.Parent.Parent.Editor'),
          name: Projection.attr('Type.Parent.Parent.Name'),
          moderated: Projection.attr('Type.Parent.Parent.Moderated')
        })
      })
    }),
    editor1: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Editor1.*', {
      createTime: Projection.attr('Editor1.CreateTime'),
      creator: Projection.attr('Editor1.Creator'),
      editTime: Projection.attr('Editor1.EditTime'),
      editor: Projection.attr('Editor1.Editor'),
      name: Projection.attr('Editor1.Name'),
      eMail: Projection.attr('Editor1.EMail'),
      phone1: Projection.attr('Editor1.Phone1'),
      phone2: Projection.attr('Editor1.Phone2'),
      phone3: Projection.attr('Editor1.Phone3'),
      activated: Projection.attr('Editor1.Activated'),
      vK: Projection.attr('Editor1.VK'),
      facebook: Projection.attr('Editor1.Facebook'),
      twitter: Projection.attr('Editor1.Twitter'),
      birthday: Projection.attr('Editor1.Birthday'),
      gender: Projection.attr('Editor1.Gender'),
      vip: Projection.attr('Editor1.Vip'),
      karma: Projection.attr('Editor1.Karma')
    })
  });
};
