import DS from 'ember-data';
import ProjectedStoreMixin from 'ember-flexberry-projections/mixins/projected-store';

export default DS.Store.reopen(ProjectedStoreMixin);
