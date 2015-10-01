import DS from 'ember-data';
import ProjectedStoreMixin from '../mixins/projected-store';

export default DS.Store.reopen(ProjectedStoreMixin);
