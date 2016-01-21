import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('object-list-view-header-cell', 'Integration | Component | object list view header cell', {
  integration: true
});

test('it renders', function(assert) {
  this.set('myColumn', { header: 'myHeader' });
  this.render(hbs`{{object-list-view-header-cell column=myColumn}}`);

  assert.equal(this.$().text().trim(), 'myHeader');
});
