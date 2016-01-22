import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Employee from '../../../models/employee';

moduleForComponent('flexberry-groupedit', 'Integration | Component | Flexberry groupedit', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('proj', Employee.projections.get('EmployeeE'));
  this.render(hbs`{{flexberry-groupedit modelProjection=proj componentName='my-group-edit'}}`);
  assert.ok(true);
});
