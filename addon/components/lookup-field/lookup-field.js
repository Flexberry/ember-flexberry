import Ember from 'ember';

export default Ember.Component.extend({
  placeholder: '(no value)',
  chooseText: 'Choose',
  removeText: 'X',

  projection: undefined,
  value: undefined,
  relationName: undefined,
  title: undefined,
  cssClass: undefined,

  init() {
    this._super();
    if (this.cssClass !== undefined) {
      var classes = this.cssClass.split(' ');
      for (var i = 0; i < classes.length; i++) {
        var classNameToSet = classes[i].trim();
        if (classNameToSet !== '') {
          if (this.classNames === undefined) {
            this.classNames = [];
          }

          this.classNames.push(classNameToSet);
        }
      }
    }
  },

  actions: {
    choose: function(relationName, projection, title) {
      this.sendAction('choose', relationName, projection, title, undefined);
    },
    remove: function(relationName) {
      this.sendAction('remove', relationName, undefined);
    }
  }
});
