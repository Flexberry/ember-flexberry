import Ember from 'ember';

export default Ember.Object.extend({
    add: function (proj) {
        this.set(proj.get('name'), proj);
    }
});
