import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

export default DS.Store.reopen(Projection.StoreMixin);
