import DS from 'ember-data';
import StoreMixin from 'ember-flexberry-data/mixins/store';

export default DS.Store.reopen(StoreMixin);
