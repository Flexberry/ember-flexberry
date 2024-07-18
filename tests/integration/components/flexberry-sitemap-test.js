import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-sitemap', 'Integration | Component | flexberry-sitemap', function(hooks) {
 setupRenderingTest(hooks);
test('it renders and works',async function(assert) {
  this.render(hbs`{{flexberry-sitemap}}`);
  assert.equal(this.$().text().trim(), '', 'Empty sitemap, empty result.');
  await render(hbs`
    {{#flexberry-sitemap}}
      template block text
    {{/flexberry-sitemap}}
  `);
  assert.equal(this.$().text().trim(), '', 'Block params not used.');
  // this.set('sitemap', {
  //   nodes: [
  //     {
  //       caption: 'Superheroes',
  //       children: [
  //         { link: 'superman', caption: 'Superman' },
  //         { link: 'ironman', caption: 'Ironman' },
  //       ],
  //     },
  //   ],
  // });
  // this.render(hbs`{{flexberry-sitemap sitemap=sitemap}}`);
  // assert.equal(this.$('.title-item-menu:visible').text().trim(), 'Superheroes', 'Menu is closed.');
  // this.$('.title-item-menu:visible').click();
  // assert.equal(this.$('.title-item-menu:visible').text().trim().replace(/\s+/g, ''), 'SuperheroesSupermanIronman', 'Menu is open.');
  });
});

